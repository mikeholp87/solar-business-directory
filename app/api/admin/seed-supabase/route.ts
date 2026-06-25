import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseAdminEnv } from "@/lib/env";
import { seedMockData } from "@/lib/seeding/mock-data";

export const runtime = "nodejs";

function isAuthorized(request: NextRequest) {
  const providedToken = request.headers.get("x-admin-seed-token")?.trim();
  const expectedToken = process.env.ADMIN_SEED_TOKEN?.trim();
  return Boolean(providedToken && expectedToken && providedToken === expectedToken);
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminEnv = getSupabaseAdminEnv();
  if (!adminEnv) {
    return NextResponse.json(
      {
        error: "Supabase admin env is not configured",
        debug: {
          hasUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()),
          hasAdminToken: Boolean(process.env.ADMIN_SEED_TOKEN?.trim())
        }
      },
      { status: 500 }
    );
  }

  try {
    const supabase = createClient(adminEnv.url, adminEnv.serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const summary = await seedMockData(supabase);
    return NextResponse.json({ ok: true, summary });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
