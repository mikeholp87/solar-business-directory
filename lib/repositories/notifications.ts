import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function listNotificationOutbox(limit = 50) {
  const supabase = createAdminSupabaseClient();
  if (!supabase) return [];
  const { data } = await supabase.from("notification_outbox").select("*").order("created_at", { ascending: false }).limit(limit);
  return data ?? [];
}

export async function queueNotification(payload: {
  eventType: string;
  subject: string;
  body: string;
  recipientEmail?: string;
  recipientRole?: "admin" | "installer";
  channel?: "email" | "sms" | "in_app";
  payload?: Record<string, unknown>;
}) {
  const supabase = createAdminSupabaseClient();
  if (!supabase) return { ok: true as const };
  const { error } = await supabase.from("notification_outbox").insert({
    event_type: payload.eventType,
    subject: payload.subject,
    body: payload.body,
    recipient_email: payload.recipientEmail ?? null,
    recipient_role: payload.recipientRole ?? null,
    channel: payload.channel ?? "email",
    payload: payload.payload ?? {},
    status: "queued"
  });
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const };
}
