import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function POST(request: Request) {
  let body: { email?: string; redirect?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { email, redirect } = body;
  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const supabase = await createServerSupabaseClient();

  const { origin } = new URL(request.url);
  const redirectTo = `${origin}${redirect ?? "/installer-dashboard"}`;

  const { error } = await supabase.auth.signInWithOtp({
    email: email.toLowerCase().trim(),
    options: { emailRedirectTo: redirectTo },
  });

  if (error) {
    console.error("[magic-link] signInWithOtp failed:", error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
