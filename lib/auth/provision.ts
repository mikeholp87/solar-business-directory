import { createAdminSupabaseClient } from "@/lib/supabase/admin";

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

async function findAuthUserByEmail(email: string) {
  const supabase = createAdminSupabaseClient();
  if (!supabase) return null;

  let page = 1;
  const perPage = 1000;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) throw error;

    const user = data.users.find((item) => normalizeEmail(item.email ?? "") === email);
    if (user) return user;

    if (data.users.length < perPage) return null;
    page += 1;
  }
}

async function adoptProfileToAuthUser(email: string, authUserId: string) {
  const supabase = createAdminSupabaseClient();
  if (!supabase) return { ok: false as const, error: "Supabase admin client is not configured." };

  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("id,email")
    .eq("email", email)
    .maybeSingle();

  if (profileError) return { ok: false as const, error: profileError.message };
  if (!profile) return { ok: true as const };
  if (profile.id === authUserId) return { ok: true as const };

  const { error: installerError } = await supabase.from("installers").update({ user_id: authUserId }).eq("user_id", profile.id);
  if (installerError) return { ok: false as const, error: installerError.message };

  const { error: auditError } = await supabase.from("audit_logs").update({ actor_user_id: authUserId }).eq("actor_user_id", profile.id);
  if (auditError) return { ok: false as const, error: auditError.message };

  const { error: profileUpdateError } = await supabase.from("users").update({ id: authUserId }).eq("id", profile.id);
  if (profileUpdateError) return { ok: false as const, error: profileUpdateError.message };

  return { ok: true as const };
}

export type ProvisionAuthUserResult =
  | { ok: true; action: "created" | "updated"; authUserId: string }
  | { ok: false; error: string };

export async function provisionAuthUserForProfile(emailInput: string, password: string): Promise<ProvisionAuthUserResult> {
  const email = normalizeEmail(emailInput);
  if (!email) return { ok: false, error: "Email is required." };
  if (password.length < 6) return { ok: false, error: "Password must be at least 6 characters." };

  const supabase = createAdminSupabaseClient();
  if (!supabase) return { ok: false, error: "Supabase admin client is not configured." };

  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("id,email,role,company_name")
    .eq("email", email)
    .maybeSingle();

  if (profileError) {
    return { ok: false, error: profileError.message };
  }

  if (!profile) {
    return { ok: false, error: "No matching profile row exists in public.users." };
  }

  const existingAuthUser = await findAuthUserByEmail(email);
  const userMetadata = {
    role: profile.role,
    company_name: profile.company_name ?? undefined
  };

  if (existingAuthUser) {
    const { data, error } = await supabase.auth.admin.updateUserById(existingAuthUser.id, {
      password,
      email_confirm: true,
      user_metadata: userMetadata
    });
    if (error) return { ok: false, error: error.message };
    const adoption = await adoptProfileToAuthUser(email, existingAuthUser.id);
    if (!adoption.ok) return { ok: false, error: adoption.error };
    return { ok: true, action: "updated", authUserId: data.user.id };
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: userMetadata
  });
  if (error) return { ok: false, error: error.message };
  if (!data.user) return { ok: false, error: "Failed to create the auth user." };
  return { ok: true, action: "created", authUserId: data.user.id };
}
