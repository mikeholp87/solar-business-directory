import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { sendNotificationEmailViaEmailJs } from "@/lib/notifications/emailjs";

export type NotificationInput = {
  eventType: string;
  recipientEmail?: string;
  recipientRole?: "admin" | "installer";
  subject: string;
  body: string;
  payload?: Record<string, unknown>;
  channel?: "email" | "sms" | "in_app";
};

type QueueNotificationDependencies = {
  supabase?: NonNullable<ReturnType<typeof createAdminSupabaseClient>>;
  sendEmail?: typeof sendNotificationEmailViaEmailJs;
};

export async function queueEmailNotification(input: NotificationInput, deps: QueueNotificationDependencies = {}) {
  const supabase = deps.supabase ?? createAdminSupabaseClient();
  if (!supabase) return { ok: true as const };
  const channel = input.channel ?? "email";

  const { data: inserted, error } = await supabase
    .from("notification_outbox")
    .insert({
      event_type: input.eventType,
      channel,
      recipient_email: input.recipientEmail ?? null,
      recipient_role: input.recipientRole ?? null,
      subject: input.subject,
      body: input.body,
      payload: input.payload ?? {},
      status: "queued"
    })
    .select("id")
    .single();

  if (error) return { ok: false as const, error: error.message };
  if (!inserted?.id) return { ok: false as const, error: "Failed to persist notification" };

  if (channel === "email" && input.recipientEmail) {
    const sendEmail = deps.sendEmail ?? sendNotificationEmailViaEmailJs;
    const delivery = await sendEmail({
      recipientEmail: input.recipientEmail,
      subject: input.subject,
      body: input.body,
      eventType: input.eventType,
      payload: input.payload,
      recipientRole: input.recipientRole
    });

    if (delivery.ok) {
      await supabase
        .from("notification_outbox")
        .update({ status: "sent", sent_at: new Date().toISOString(), last_error: null })
        .eq("id", inserted.id);
      return { ok: true as const, status: "sent" as const };
    }

    await supabase
      .from("notification_outbox")
      .update({ status: "failed", last_error: delivery.error })
      .eq("id", inserted.id);
    return { ok: true as const, status: "failed" as const, error: delivery.error };
  }

  return { ok: true as const };
}
