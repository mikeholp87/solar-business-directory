import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const admin = createAdminSupabaseClient();
  if (!admin) {
    console.error("[signup] createAdminSupabaseClient returned null — check SUPABASE_SERVICE_ROLE_KEY");
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

  const emailLower = email.toLowerCase().trim();

  const { data: authData, error: createError } = await admin.auth.admin.createUser({
    email: emailLower,
    password,
    email_confirm: true,
    user_metadata: { role: userRole, company_name: companyName }
  });
  if (createError) {
    const msg = createError.message.includes("already")
      ? "An account with this email already exists"
      : createError.message;
    console.error("[signup] createUser failed:", createError.message);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
  if (!authData.user) {
    console.error("[signup] createUser returned no user");
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }

  console.log("[signup] auth user created:", authData.user.id);

  const { error: insertError } = await admin.from("users").insert({
    id: authData.user.id,
    email: emailLower,
    role: userRole,
    company_name: companyName
  });
  if (insertError) {
    console.error("[signup] insert into users failed:", insertError.message);
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, userId: authData.user.id });
}
