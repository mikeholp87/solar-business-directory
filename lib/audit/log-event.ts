import { getCurrentSessionUser } from "@/lib/auth/session";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function logAuditEvent(params: {
  action: string;
  entityType: string;
  entityId?: string;
  payload?: Record<string, unknown>;
}) {
  const supabase = createAdminSupabaseClient();
  if (!supabase) return { ok: true as const };

  const user = await getCurrentSessionUser().catch(() => null);
  const { error } = await supabase.from("audit_logs").insert({
    actor_user_id: user?.id ?? null,
    actor_role: user?.role ?? null,
    action: params.action,
    entity_type: params.entityType,
    entity_id: params.entityId ?? null,
    payload: params.payload ?? {}
  });

  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const };
}
