import { cookies } from "next/headers";
import { getAdminEmail } from "@/lib/env";
import { getSupabaseOrNull } from "@/lib/repositories/shared";

export type SessionUser = {
  id: string;
  email: string;
  role: "admin" | "installer";
};

function getAuthMetadataRole(user: { app_metadata?: unknown }) {
  const metadata = user.app_metadata as Record<string, unknown> | undefined;
  const rawRole = metadata?.role;
  return rawRole === "admin" ? "admin" : rawRole === "installer" ? "installer" : null;
}

export async function getCurrentSessionUser(): Promise<SessionUser | null> {
  const supabase = await getSupabaseOrNull();
  if (!supabase) {
    const cookieStore = await cookies();
    const demoRole = cookieStore.get("demo-role")?.value;
    const demoEmail = cookieStore.get("demo-email")?.value;
    if (!demoRole || !demoEmail) return null;
    return {
      id: `demo-${demoRole}`,
      email: demoEmail,
      role: demoRole === "admin" ? "admin" : "installer"
    };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return null;

  const { data } = await supabase.from("users").select("id,email,role").eq("id", user.id).maybeSingle();
  const { data: emailMatch } = !data
    ? await supabase.from("users").select("id,email,role").ilike("email", user.email.trim()).maybeSingle()
    : { data: null };
  const profile = data ?? emailMatch;
  const adminEmail = getAdminEmail();
  const isConfiguredAdminEmail = adminEmail && user.email.trim().toLowerCase() === adminEmail.toLowerCase();
  const isAuthMetadataAdmin = getAuthMetadataRole(user) === "admin";

  if (!profile) {
    if (isConfiguredAdminEmail || isAuthMetadataAdmin) {
      return {
        id: user.id,
        email: user.email,
        role: "admin"
      };
    }
    return null;
  }
  return {
    id: profile.id,
    email: profile.email,
    role: isConfiguredAdminEmail || isAuthMetadataAdmin ? "admin" : (profile.role as SessionUser["role"])
  };
}
