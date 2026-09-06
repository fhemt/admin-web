import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ACCESS_TOKEN_COOKIE = "fhemt_admin_access_token";

// Optimistic only — a cookie's presence, not its validity, which the
// backend enforces on every real request. Real authorization never lives
// here (see the Next.js docs on Proxy vs. full session management).
export function proxy(request: NextRequest) {
  const hasSession = request.cookies.has(ACCESS_TOKEN_COOKIE);
  const { pathname } = request.nextUrl;
  const isAuthRoute = pathname === "/login" || pathname === "/verify-otp";

  if (!hasSession && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (hasSession && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard/courses", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
