import { NextResponse } from "next/server";
import { getCurrentSessionUser } from "@/lib/auth/session";
import { provisionAuthUserForProfile } from "@/lib/auth/provision";

type ProvisionBody = {
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  const user = await getCurrentSessionUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json().catch(() => null)) as ProvisionBody | null;
  const email = typeof body?.email === "string" ? body.email : "";
  const password = typeof body?.password === "string" ? body.password : "";

  const result = await provisionAuthUserForProfile(email, password);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(result);
}

