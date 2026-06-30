import { NextResponse } from "next/server";
import { createSignupAccount } from "@/lib/auth/signup";

type SignupBody = {
  email?: string;
  password?: string;
  companyName?: string;
  role?: "installer" | "admin";
  adminInviteCode?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as SignupBody | null;
  const email = typeof body?.email === "string" ? body.email : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const companyName = typeof body?.companyName === "string" ? body.companyName : "";
  const role = body?.role === "admin" ? "admin" : "installer";
  const adminInviteCode = typeof body?.adminInviteCode === "string" ? body.adminInviteCode : undefined;
  const cookieResponse = new NextResponse(null, { status: 200 });
  const result = await createSignupAccount(cookieResponse, { email, password, companyName, role, adminInviteCode });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const response = NextResponse.json(result);
  cookieResponse.cookies.getAll().forEach(({ name, value, ...options }) => {
    response.cookies.set(name, value, options);
  });
  return response;
}
