import "server-only";
import { cookies } from "next/headers";

const ACCESS_TOKEN_COOKIE = "fhemt_admin_access_token";
const REFRESH_TOKEN_COOKIE = "fhemt_admin_refresh_token";

// Not device-bound the way the mobile app is (see AdminAuthServiceImpl) —
// a fixed id is all the backend's session store needs.
export const ADMIN_DEVICE_ID = "admin-web";

const baseCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export async function setSessionCookies(accessToken: string, refreshToken: string) {
  const store = await cookies();
  store.set(ACCESS_TOKEN_COOKIE, accessToken, { ...baseCookieOptions, maxAge: 60 * 60 });
  store.set(REFRESH_TOKEN_COOKIE, refreshToken, { ...baseCookieOptions, maxAge: 60 * 60 * 24 * 7 });
}

export async function clearSessionCookies() {
  const store = await cookies();
  store.delete(ACCESS_TOKEN_COOKIE);
  store.delete(REFRESH_TOKEN_COOKIE);
}

export async function getAccessToken() {
  const store = await cookies();
  return store.get(ACCESS_TOKEN_COOKIE)?.value;
}

export async function getRefreshToken() {
  const store = await cookies();
  return store.get(REFRESH_TOKEN_COOKIE)?.value;
}

export async function isAuthenticated() {
  return Boolean(await getAccessToken());
}
