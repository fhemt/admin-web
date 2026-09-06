import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ACCESS_TOKEN_COOKIE = "fhemt_admin_access_token";

// A token that decodes but is expired is treated as "no session" only for
// the auth routes below — everywhere else we still let an expired-but-
// present token through so lib/api/client.ts's silent refresh-token flow
// gets a chance to run, instead of forcing a full re-login on every
// access-token expiry (~1h).
function isAccessTokenValid(token: string | undefined): boolean {
  if (!token) return false;
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString("utf-8"));
    return typeof payload.exp === "number" && payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

// Optimistic only — a cookie's presence, not its validity, which the
// backend enforces on every real request. Real authorization never lives
// here (see the Next.js docs on Proxy vs. full session management).
export function proxy(request: NextRequest) {
  const token = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const hasSession = Boolean(token);
  const { pathname } = request.nextUrl;
  const isAuthRoute = pathname === "/login" || pathname === "/verify-otp";

  if (!hasSession && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  // Only bounce away from the auth routes when the token is actually still
  // valid — a stale/expired one must not trap the user in a redirect loop
  // (dashboard throws SessionExpiredError -> /login -> bounced back here).
  if (isAuthRoute && isAccessTokenValid(token)) {
    return NextResponse.redirect(new URL("/dashboard/courses", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
