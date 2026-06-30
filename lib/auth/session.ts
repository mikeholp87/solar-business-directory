import { cookies } from "next/headers";
import { getSupabaseOrNull } from "@/lib/repositories/shared";

export type SessionUser = {
  id: string;
  email: string;
  role: "admin" | "installer";
};

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
  if (!data) return null;
  return {
    id: data.id,
    email: data.email,
    role: data.role as SessionUser["role"]
  };
}
