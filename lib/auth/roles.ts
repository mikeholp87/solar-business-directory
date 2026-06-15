import { redirect } from "next/navigation";
import { getCurrentSessionUser } from "@/lib/auth/session";

export async function requireRole(allowedRoles: Array<"admin" | "installer">, redirectTo = "/login") {
  const user = await getCurrentSessionUser();
  if (!user || !allowedRoles.includes(user.role)) {
    redirect(`${redirectTo}?redirect=${encodeURIComponent("/")}`);
  }
  return user;
}

export function roleDashboardPath(role: "admin" | "installer") {
  return role === "admin" ? "/admin" : "/installer-dashboard";
}
