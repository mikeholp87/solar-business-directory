import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function POST(request: Request) {
  const admin = createAdminSupabaseClient();
  if (!admin) {
    return NextResponse.json({ error: "Service not configured" }, { status: 500 });
  }

  let body: { email?: string; password?: string; companyName?: string; role?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { email, password, companyName, role } = body;

  if (!email || !password || !companyName) {
    return NextResponse.json({ error: "Email, password, and company name are required" }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
  }

  const allowedRoles = ["installer"];
  const userRole = allowedRoles.includes(role ?? "") ? role! : "installer";

  const { data: existingUsers, error: listError } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 1000
  });
  if (listError) {
    return NextResponse.json({ error: "Failed to check existing users" }, { status: 500 });
  }

  const emailLower = email.toLowerCase().trim();
  const alreadyExists = existingUsers.users.some(
    (u) => u.email?.toLowerCase() === emailLower
  );
  if (alreadyExists) {
    return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
  }

  const { data: authData, error: createError } = await admin.auth.admin.createUser({
    email: emailLower,
    password,
    email_confirm: true,
    user_metadata: { role: userRole, company_name: companyName }
  });
  if (createError) {
    return NextResponse.json({ error: createError.message }, { status: 400 });
  }
  if (!authData.user) {
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }

  const { error: insertError } = await admin.from("users").insert({
    id: authData.user.id,
    email: emailLower,
    role: userRole
  });
  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, userId: authData.user.id });
}
