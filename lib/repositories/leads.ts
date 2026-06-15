import { leads as fallbackLeads } from "@/lib/data";
import { assignLeadToInstaller } from "@/lib/lead-assignment";
import { getSupabaseOrNull, mergeLeadRecord } from "@/lib/repositories/shared";
import { listInstallers } from "@/lib/repositories/installers";
import { listTerritories } from "@/lib/repositories/territories";
import { queueEmailNotification } from "@/lib/notifications/email";
import { leadReceivedTemplate } from "@/lib/notifications/templates/lead-received";
import { logAuditEvent } from "@/lib/audit/log-event";
import type { Lead } from "@/lib/types";

export async function listLeads(): Promise<Lead[]> {
  const supabase = await getSupabaseOrNull();
  if (!supabase) return fallbackLeads;

  const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
  if (!data) return fallbackLeads;
  return data.map((row) => mergeLeadRecord(row, fallbackLeads[0]));
}

export async function getLeadDashboardSummary() {
  const leads = await listLeads();
  const territories = await listTerritories();
  const installers = await listInstallers();
  const activeInstallers = installers.filter((installer) => installer.status === "active");
  const pendingApplications = installers.filter((installer) => installer.status === "pending");
  const busAccepted = leads.filter((lead) => lead.stage === "bus_accepted");
  const completedInstalls = leads.filter((lead) => lead.stage === "installation_completed");
  const leadsThisMonth = leads.filter((lead) => new Date(lead.createdAt).getMonth() === new Date().getMonth());
  const fullTerritories = territories.filter((territory) => territory.activeInstallerCount >= territory.maxInstallerSlots);
  const availableTerritories = territories.filter((territory) => territory.activeInstallerCount < territory.maxInstallerSlots);
  const commissionDue = leads.reduce((total, lead) => total + (lead.referralFeePaid ? 0 : lead.referralFeeDue), 0);

  return {
    leads,
    territories,
    installers,
    activeInstallers,
    pendingApplications,
    busAccepted,
    completedInstalls,
    leadsThisMonth,
    fullTerritories,
    availableTerritories,
    commissionDue
  };
}

export async function createLeadFromForm(params: {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  postcode: string;
  address?: string;
  homeowner_status?: string;
  current_heating_source?: string;
  monthly_bill?: string;
  property_type?: string;
  bedrooms?: number;
  interests: string[];
  consent_contact: boolean;
  consent_marketing: boolean;
  gdpr_acceptance: boolean;
  preferred_installer_id?: string | null;
  source?: string;
}) {
  const territories = await listTerritories();
  const installers = await listInstallers();
  const assignment = assignLeadToInstaller({
    postcode: params.postcode,
    preferredInstallerId: params.preferred_installer_id ?? undefined,
    territories,
    installers
  });

  const payload = {
    first_name: params.first_name,
    last_name: params.last_name,
    email: params.email,
    phone: params.phone,
    postcode: params.postcode.toUpperCase(),
    address: params.address,
    homeowner_status: params.homeowner_status === "yes",
    current_heating_source: params.current_heating_source,
    monthly_bill: params.monthly_bill,
    property_type: params.property_type,
    bedrooms: params.bedrooms,
    interests: params.interests,
    consent_contact: params.consent_contact,
    consent_marketing: params.consent_marketing,
    gdpr_acceptance: params.gdpr_acceptance,
    territory_id: assignment.territoryId,
    preferred_installer_id: params.preferred_installer_id ?? null,
    assigned_installer_id: assignment.assignedInstallerId,
    source: params.source ?? "directory",
    stage: "new_enquiry"
  };

  const supabase = await getSupabaseOrNull();
  if (supabase) {
    const { error } = await supabase.from("leads").insert(payload);
    if (error) {
      return { ok: false as const, error: error.message, assignment };
    }
  }

  const assignedInstaller = installers.find((installer) => installer.id === assignment.assignedInstallerId);
  const notification = leadReceivedTemplate({
    firstName: params.first_name,
    lastName: params.last_name,
    postcode: params.postcode.toUpperCase(),
    stage: "new_enquiry",
    source: params.source ?? "directory"
  });
  await Promise.all([
    queueEmailNotification({
      eventType: "lead.received",
      recipientRole: "admin",
      subject: notification.subject,
      body: notification.body,
      payload
    }),
    assignedInstaller?.email
      ? queueEmailNotification({
          eventType: "lead.assigned",
          recipientEmail: assignedInstaller.email,
          recipientRole: "installer",
          subject: `New lead assigned: ${params.first_name} ${params.last_name}`,
          body: `${notification.body}\n\nAssigned installer: ${assignedInstaller.companyName}`,
          payload
        })
      : Promise.resolve({ ok: true as const }),
    logAuditEvent({
      action: "lead.created",
      entityType: "lead",
      payload
    })
  ]);

  return { ok: true as const, assignment, payload };
}
