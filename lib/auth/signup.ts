import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { getSignupEnv } from "@/lib/env";
import { createRouteSupabaseClient } from "@/lib/supabase/route-client";
import type { NextResponse } from "next/server";

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function slugifyCompanyName(value: string) {
  const base = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || "installer";
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

export type SignupRole = "installer" | "admin";

export type CreateSignupAccountInput = {
  email: string;
  password: string;
  companyName?: string;
  role: SignupRole;
  adminInviteCode?: string;
};

export type CreateSignupAccountResult =
  | { ok: true; role: SignupRole }
  | { ok: false; error: string };

export async function createSignupAccount(response: NextResponse, input: CreateSignupAccountInput): Promise<CreateSignupAccountResult> {
  const email = normalizeEmail(input.email);
  const password = input.password.trim();
  const role = input.role;
  const companyName = input.companyName?.trim() ?? "";

  if (!email) return { ok: false, error: "Email is required." };
  if (password.length < 6) return { ok: false, error: "Password must be at least 6 characters." };
  if (role === "installer" && !companyName) return { ok: false, error: "Company name is required for installer accounts." };
  if (role === "admin") {
    const { adminInviteCode } = getSignupEnv();
    if (!adminInviteCode) return { ok: false, error: "Admin signup is not enabled." };
    if (input.adminInviteCode?.trim() !== adminInviteCode) {
      return { ok: false, error: "Invalid admin invite code." };
    }
  }

  const adminSupabase = createAdminSupabaseClient();
  if (!adminSupabase) return { ok: false, error: "Supabase admin client is not configured." };

  const existingAuthUser = await findAuthUserByEmail(email);
  if (existingAuthUser) return { ok: false, error: "An account with that email already exists. Sign in instead." };

  const userMetadata =
    role === "installer"
      ? {
          role,
          company_name: companyName,
          installer_slug: `${slugifyCompanyName(companyName)}-${crypto.randomUUID().slice(0, 8)}`
        }
      : {
          role,
          company_name: companyName || undefined
        };

  const { data, error } = await adminSupabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: userMetadata
  });
  if (error) return { ok: false, error: error.message };
  if (!data.user) return { ok: false, error: "Failed to create the auth user." };

  const supabase = await createRouteSupabaseClient(response);
  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
  if (signInError) return { ok: false, error: signInError.message };

  return { ok: true, role };
}
