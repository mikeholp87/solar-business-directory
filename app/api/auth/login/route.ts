import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { email, password } = body;
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  const supabase = await createServerSupabaseClient();

  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: email.toLowerCase().trim(),
    password,
  });

  if (signInError) {
    console.error("[login] signInWithPassword failed:", signInError.message);
    return NextResponse.json({ error: signInError.message }, { status: 401 });
  }

  if (!signInData.user) {
    return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("users")
    .select("id, email, role")
    .eq("id", signInData.user.id)
    .maybeSingle();

  const role = (profile?.role === "admin" ? "admin" : "installer") as "admin" | "installer";

  return NextResponse.json({
    success: true,
    user: {
      id: signInData.user.id,
      email: profile?.email ?? signInData.user.email,
      role,
    },
  });
}
