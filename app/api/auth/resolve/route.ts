import { NextResponse } from "next/server";
import { resolveLoginEmail } from "@/lib/auth/login";

type ResolveBody = {
  identifier?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as ResolveBody | null;
  const identifier = typeof body?.identifier === "string" ? body.identifier : "";
  const email = await resolveLoginEmail(identifier);

  if (!email) {
    return NextResponse.json({ error: "Invalid username or password." }, { status: 404 });
  }

  return NextResponse.json({ email });
}
