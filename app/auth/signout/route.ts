import { NextResponse } from "next/server";
import { createRouteSupabaseClient } from "@/lib/supabase/route-client";

export async function GET(request: Request) {
  const { origin } = new URL(request.url);
  const response = NextResponse.redirect(`${origin}/login`);
  const supabase = await createRouteSupabaseClient(response);
  await supabase.auth.signOut();
  return response;
}
