import { getSupabaseOrNull } from "@/lib/repositories/shared";
import { queueEmailNotification } from "@/lib/notifications/email";
import { applicationReceivedTemplate } from "@/lib/notifications/templates/application-received";
import { installerApprovedTemplate } from "@/lib/notifications/templates/installer-approved";
import { logAuditEvent } from "@/lib/audit/log-event";

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
    logAuditEvent({
      action: "installer_application.created",
      entityType: "installer_application",
      payload
    })
  ]);

  return { ok: true as const };
}
