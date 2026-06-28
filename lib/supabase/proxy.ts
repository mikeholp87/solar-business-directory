import { createServerClient } from "@supabase/ssr";
import type { SetAllCookies } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabasePublicEnv } from "@/lib/env";

function copyCookies(source: NextResponse, target: NextResponse) {
  source.cookies.getAll().forEach(({ name, value, ...options }) => {
    target.cookies.set(name, value, options);
  });
}

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({ request });
  const { url, anonKey } = getSupabasePublicEnv();

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: Parameters<SetAllCookies>[0]) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        });
      }
    }
  });

  const { data, error } = await supabase.auth.getClaims();
  return {
    response,
    sessionExists: !error && Boolean(data?.claims?.sub)
  };
}

export function finalizeResponse(baseResponse: NextResponse, targetResponse: NextResponse) {
  copyCookies(baseResponse, targetResponse);
  targetResponse.headers.set("vary", "Cookie");
  targetResponse.headers.set("Cache-Control", "private, no-store");
  return targetResponse;
}
