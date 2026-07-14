import { cookies } from "next/headers";
import { getAdminEmail } from "@/lib/env";
import { getSupabaseOrNull } from "@/lib/repositories/shared";

export type SessionUser = {
  id: string;
  email: string;
  role: "admin" | "installer";
};

function getAuthMetadataRole(user: { user_metadata?: unknown; app_metadata?: unknown }) {
  const metadata = [
    user.user_metadata as Record<string, unknown> | undefined,
    user.app_metadata as Record<string, unknown> | undefined
  ];
  const rawRole = metadata.map((item) => item?.role).find((value) => typeof value === "string");
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
  const adminEmail = getAdminEmail();
  const isConfiguredAdminEmail = adminEmail && user.email.trim().toLowerCase() === adminEmail.toLowerCase();
  const metadataRole = getAuthMetadataRole(user);
  const isAuthMetadataAdmin = metadataRole === "admin";

  if (!data) {
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
    id: data.id,
    email: data.email,
    role: isConfiguredAdminEmail || isAuthMetadataAdmin ? "admin" : (data.role as SessionUser["role"])
  };
}
