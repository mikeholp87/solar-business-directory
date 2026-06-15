import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export type NotificationInput = {
  eventType: string;
  recipientEmail?: string;
  recipientRole?: "admin" | "installer";
  subject: string;
  body: string;
  payload?: Record<string, unknown>;
  channel?: "email" | "sms" | "in_app";
};

export async function queueEmailNotification(input: NotificationInput) {
  const supabase = createAdminSupabaseClient();
  if (!supabase) return { ok: true as const };

  const { error } = await supabase.from("notification_outbox").insert({
    event_type: input.eventType,
    channel: input.channel ?? "email",
    recipient_email: input.recipientEmail ?? null,
    recipient_role: input.recipientRole ?? null,
    subject: input.subject,
    body: input.body,
    payload: input.payload ?? {},
    status: "queued"
  });

  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const };
}
