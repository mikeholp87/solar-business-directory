import { getSupabaseOrNull } from "@/lib/repositories/shared";
import { queueEmailNotification } from "@/lib/notifications/email";
import { applicationReceivedTemplate } from "@/lib/notifications/templates/application-received";
import { NOTIFICATION_RECIPIENTS } from "@/lib/notifications/recipients";
import { installerApprovedTemplate } from "@/lib/notifications/templates/installer-approved";
import { logAuditEvent } from "@/lib/audit/log-event";

function splitContactName(contactName: string): { firstName: string; lastName: string } {
  const parts = contactName.trim().split(/\s+/);
  if (parts.length === 0) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

async function createLeadFromApplication(payload: Record<string, unknown>) {
  const supabase = await getSupabaseOrNull();
  if (!supabase) return;

  const contactName = String(payload.contact_name ?? "");
  const { firstName, lastName } = splitContactName(contactName);
  const company = String(payload.company_name ?? "");
  const existingNotes = String(payload.notes ?? "");
  const notes = existingNotes
    ? `Installer application from ${company}.\n${existingNotes}`
    : `Installer application from ${company}.`;

  const leadPayload = {
    first_name: firstName,
    last_name: lastName,
    email: String(payload.email ?? ""),
    phone: String(payload.phone ?? ""),
    postcode: "N/A",
    interests: Array.isArray(payload.services) ? payload.services : [],
    consent_contact: true,
    consent_marketing: false,
    gdpr_acceptance: true,
    source: "installer_application",
    stage: "new_enquiry" as const,
    notes
  };

  const { error } = await supabase.from("leads").insert(leadPayload);
  if (error) {
    console.error("Failed to create lead from application:", error.message);
  }
}

export async function listInstallerApplications() {
  const supabase = await getSupabaseOrNull();
  if (!supabase) return [];

  const { data } = await supabase.from("installer_applications").select("*").order("created_at", { ascending: false });
  return data ?? [];
}

export async function createInstallerApplication(payload: Record<string, unknown>) {
  const supabase = await getSupabaseOrNull();
  if (supabase) {
    const { error } = await supabase.from("installer_applications").insert(payload);
    if (error) return { ok: false as const, error: error.message };

    await createLeadFromApplication(payload);
  }

  const notification = applicationReceivedTemplate({
    companyName: String(payload.company_name ?? ""),
    contactName: String(payload.contact_name ?? ""),
    email: String(payload.email ?? ""),
    territoryCount: Array.isArray(payload.preferred_territories) ? payload.preferred_territories.length : 0
  });

  await Promise.all([
    queueEmailNotification({
      eventType: "application.received",
      recipientRole: "admin",
      subject: notification.subject,
      body: notification.body,
      payload
    }),
    queueEmailNotification({
      eventType: "application.received",
      recipientEmail: NOTIFICATION_RECIPIENTS.dan,
      recipientRole: "admin",
      subject: notification.subject,
      body: notification.body,
      payload
    }),
    logAuditEvent({
      action: "installer_application.created",
      entityType: "installer_application",
      payload
    })
  ]);

  return { ok: true as const };
}
