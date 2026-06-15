import { reviews as fallbackReviews } from "@/lib/data";
import { queueEmailNotification } from "@/lib/notifications/email";
import { installerApprovedTemplate } from "@/lib/notifications/templates/installer-approved";
import { logAuditEvent } from "@/lib/audit/log-event";
import { getSupabaseOrNull, mergeReviewRecord } from "@/lib/repositories/shared";
import { listInstallerApplications } from "@/lib/repositories/applications";
import { getLeadDashboardSummary } from "@/lib/repositories/leads";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import type { Installer, Lead, Review, Territory } from "@/lib/types";

function adminClient() {
  return createAdminSupabaseClient();
}

export async function getAdminDashboardData() {
  const summary = await getLeadDashboardSummary();
  const applications = await listInstallerApplications();
  const reviews = await listReviewsForAdmin();
  return { ...summary, applications, reviews };
}

export async function listReviewsForAdmin(): Promise<Review[]> {
  const supabase = await getSupabaseOrNull();
  if (!supabase) return fallbackReviews.map((review) => ({ ...review, approved: true }));
  const { data } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
  return (data ?? []).map((row) => {
    const fallback = fallbackReviews.find((item) => item.installerId === row.installer_id) ?? fallbackReviews[0];
    return mergeReviewRecord(row, fallback);
  });
}

export async function updateInstallerApplicationStatus(applicationId: string, status: "pending" | "approved" | "suspended" | "cancelled") {
  const supabase = adminClient();
  if (!supabase) return { ok: true as const };
  const { data: application } = await supabase.from("installer_applications").select("*").eq("id", applicationId).maybeSingle();
  const { error } = await supabase.from("installer_applications").update({ status }).eq("id", applicationId);
  if (error) return { ok: false as const, error: error.message };

  if (status === "approved" && application) {
    const notification = installerApprovedTemplate({ companyName: application.company_name, email: application.email });
    await queueEmailNotification({
      eventType: "application.approved",
      recipientEmail: notification.recipientEmail,
      recipientRole: "installer",
      subject: notification.subject,
      body: notification.body,
      payload: { application_id: applicationId, company_name: application.company_name }
    });
  }

  await logAuditEvent({
    action: `installer_application.${status}`,
    entityType: "installer_application",
    entityId: applicationId,
    payload: { status }
  });
  return { ok: true as const };
}

export async function updateInstallerAdmin(installerId: string, payload: Partial<Installer>) {
  const supabase = adminClient();
  if (!supabase) return { ok: true as const };
  const { error } = await supabase.from("installers").update({
    status: payload.status,
    subscription_status: payload.subscriptionStatus,
    lead_price: payload.leadPrice,
    monthly_install_capacity: payload.monthlyInstallCapacity,
    internal_notes: payload.internalNotes,
    description: payload.description,
    areas_covered: payload.areasCovered,
    survey_turnaround_days: payload.surveyTurnaroundDays,
    website: payload.website,
    phone: payload.phone
  }).eq("id", installerId);
  if (error) return { ok: false as const, error: error.message };
  await logAuditEvent({
    action: "installer.updated",
    entityType: "installer",
    entityId: installerId,
    payload
  });
  return { ok: true as const };
}

export async function updateTerritoryAdmin(territoryId: string, payload: Partial<Territory>) {
  const supabase = adminClient();
  if (!supabase) return { ok: true as const };
  const { error } = await supabase.from("territories").update({
    status: payload.status,
    max_installer_slots: payload.maxInstallerSlots,
    priority: payload.priority,
    notes: payload.notes,
    lead_volume: payload.leadVolume
  }).eq("id", territoryId);
  if (error) return { ok: false as const, error: error.message };
  await logAuditEvent({
    action: "territory.updated",
    entityType: "territory",
    entityId: territoryId,
    payload
  });
  return { ok: true as const };
}

export async function updateLeadAdmin(leadId: string, payload: Partial<Lead>) {
  const supabase = adminClient();
  if (!supabase) return { ok: true as const };
  const { error } = await supabase.from("leads").update({
    stage: payload.stage,
    invoice_status: payload.invoiceStatus,
    assigned_installer_id: payload.assignedInstallerId,
    referral_fee_paid: payload.referralFeePaid,
    notes: payload.notes
  }).eq("id", leadId);
  if (error) return { ok: false as const, error: error.message };
  await logAuditEvent({
    action: "lead.updated",
    entityType: "lead",
    entityId: leadId,
    payload
  });
  return { ok: true as const };
}

export async function updateReviewAdmin(reviewId: string, approved: boolean) {
  const supabase = adminClient();
  if (!supabase) return { ok: true as const };
  const { error } = await supabase.from("reviews").update({ approved }).eq("id", reviewId);
  if (error) return { ok: false as const, error: error.message };
  await logAuditEvent({
    action: approved ? "review.approved" : "review.rejected",
    entityType: "review",
    entityId: reviewId,
    payload: { approved }
  });
  return { ok: true as const };
}

export async function exportLeadsCsv() {
  const summary = await getLeadDashboardSummary();
  const headers = ["id", "name", "postcode", "stage", "territory", "installer", "invoice_status", "referral_fee_due"];
  const rows = summary.leads.map((lead) => [
    lead.id,
    `${lead.firstName} ${lead.lastName}`,
    lead.postcode,
    lead.stage,
    summary.territories.find((territory) => territory.id === lead.territoryId)?.name ?? "Unmatched",
    summary.installers.find((installer) => installer.id === lead.assignedInstallerId)?.companyName ?? "Unassigned",
    lead.invoiceStatus,
    String(lead.referralFeeDue)
  ]);

  return [headers, ...rows].map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
}
