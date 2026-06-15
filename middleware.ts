import { createServerClient } from "@supabase/ssr";
import type { SetAllCookies } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });
  const hasSupabaseEnv = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!hasSupabaseEnv) return response;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: Parameters<SetAllCookies>[0]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        }
      }
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;
  if (!path.startsWith("/admin") && !path.startsWith("/installer-dashboard")) return response;

  if (!user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirect", path);
    return NextResponse.redirect(loginUrl);
  }

  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
  if (path.startsWith("/admin") && profile?.role !== "admin") return NextResponse.redirect(new URL("/installer-dashboard", request.url));
  if (path.startsWith("/installer-dashboard") && !["admin", "installer"].includes(profile?.role ?? "")) return NextResponse.redirect(new URL("/", request.url));

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/installer-dashboard/:path*"]
};
