import { NextResponse, type NextRequest } from "next/server";

const protectedPaths = ["/admin", "/installer-dashboard", "/billing"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!protectedPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const demoRole = request.cookies.get("demo-role")?.value;
  const hasSupabaseSession = request.cookies.getAll().some((cookie) => cookie.name.startsWith("sb-"));
  if (!demoRole && !hasSupabaseSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/admin") && demoRole && demoRole !== "admin") {
    return NextResponse.redirect(new URL("/installer-dashboard", request.url));
  }

  if (pathname.startsWith("/installer-dashboard") && demoRole === "admin") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/installer-dashboard/:path*", "/billing/:path*"]
};
