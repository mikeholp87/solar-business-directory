import { NextResponse, type NextRequest } from "next/server";
import { finalizeResponse, updateSession } from "@/lib/supabase/proxy";

const protectedPaths = ["/admin", "/installer-dashboard", "/billing"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!protectedPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const { response, sessionExists } = await updateSession(request);
  const demoRole = request.cookies.get("demo-role")?.value;
  if (!demoRole && !sessionExists) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return finalizeResponse(response, NextResponse.redirect(loginUrl));
  }

  if (pathname.startsWith("/admin") && demoRole && demoRole !== "admin") {
    return finalizeResponse(response, NextResponse.redirect(new URL("/installer-dashboard", request.url)));
  }

  if (pathname.startsWith("/installer-dashboard") && demoRole === "admin") {
    return finalizeResponse(response, NextResponse.redirect(new URL("/admin", request.url)));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/installer-dashboard/:path*", "/billing/:path*"]
};
