import { NextResponse } from "next/server";
import { finalizeResponse } from "@/lib/supabase/proxy";
import { createRouteSupabaseClient } from "@/lib/supabase/route-client";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const callbackUrl = new URL("/login", origin);
  const response = NextResponse.next();

  if (code) {
    const supabase = await createRouteSupabaseClient(response);
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const { data: authData } = await supabase.auth.getUser();
      if (authData.user?.id) {
        const { data: profile } = await supabase
          .from("users")
          .select("role")
          .eq("id", authData.user.id)
          .maybeSingle();
        const rolePath = profile?.role === "admin" ? "/admin" : "/installer-dashboard";
        return finalizeResponse(response, NextResponse.redirect(`${origin}${rolePath}`));
      }
      callbackUrl.searchParams.set("error", "missing_user_profile");
      return finalizeResponse(response, NextResponse.redirect(callbackUrl));
    }
  }

  callbackUrl.searchParams.set("error", "auth_callback_failed");
  return finalizeResponse(response, NextResponse.redirect(callbackUrl));
}
