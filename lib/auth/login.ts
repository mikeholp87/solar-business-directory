import { createAdminSupabaseClient } from "@/lib/supabase/admin";

function normalizeIdentifier(value: string) {
  return value.trim().toLowerCase();
}

function isEmailIdentifier(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function resolveLoginEmail(identifier: string) {
  const normalized = normalizeIdentifier(identifier);
  if (!normalized) return null;
  if (isEmailIdentifier(normalized)) return normalized;

  const supabase = createAdminSupabaseClient();
  if (!supabase) return null;

  const [userResult, installerResult] = await Promise.all([
    supabase
      .from("users")
      .select("email, company_name")
      .or(`company_name.ilike.${normalized},email.ilike.${normalized}`)
      .maybeSingle(),
    supabase
      .from("installers")
      .select("email, slug")
      .or(`slug.ilike.${normalized},email.ilike.${normalized}`)
      .maybeSingle()
  ]);

  const userEmail = userResult.data?.email?.trim().toLowerCase();
  if (userEmail) return userEmail;

  const installerEmail = installerResult.data?.email?.trim().toLowerCase();
  if (installerEmail) return installerEmail;

  return null;
}

