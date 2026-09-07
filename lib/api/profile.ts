import "server-only";
import { redirect } from "next/navigation";
import { apiGet, apiPost } from "@/lib/api/client";
import { ApiAdminUser } from "@/lib/api/types";
import { SessionExpiredError } from "@/lib/api/errors";

export function getMe() {
  return apiGet<ApiAdminUser>("/api/v1/users/me");
}

/** Server Actions have no middleware layer of their own — unlike a page,
 * which naturally 404s/redirects on render, a Server Action is a directly
 * callable server endpoint, reachable by anyone with a valid session
 * regardless of which page they're viewing. Every mutating Server Action
 * must call this first: today the backend also happens to reject a
 * non-admin token on every route these actions hit, but that's the
 * backend's own rule, not this app's — this is this app's independent
 * check, so a future backend route added under the broader ADMIN+SUPPORTER
 * pattern (or a regression in SecurityConfig) can't silently turn one of
 * these into a privilege-escalation path. */
export async function requireAdmin(): Promise<ApiAdminUser> {
  let me: ApiAdminUser;
  try {
    me = await getMe();
  } catch (e) {
    if (e instanceof SessionExpiredError) redirect("/login");
    throw e;
  }
  if (me.role !== "ADMIN") redirect("/dashboard/courses");
  return me;
}

export function changePassword(currentPassword: string, newPassword: string) {
  return apiPost<void>("/api/v1/users/me/change-password", { currentPassword, newPassword });
}
