import "server-only";
import { ADMIN_DEVICE_ID, clearSessionCookies, getAccessToken, getRefreshToken, setSessionCookies } from "@/lib/session";
import { ApiError, SessionExpiredError } from "@/lib/api/errors";

const API_URL = process.env.API_URL ?? "http://localhost:8080";

interface ApiEnvelope<T> {
  data?: T;
  error?: { code: string; message: { fr: string; ar: string; en: string } };
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  auth?: boolean;
};

let refreshInFlight: Promise<boolean> | null = null;

async function refreshSession(): Promise<boolean> {
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      const refreshToken = await getRefreshToken();
      if (!refreshToken) return false;
      try {
        const res = await fetch(`${API_URL}/api/v1/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken, deviceId: ADMIN_DEVICE_ID }),
          cache: "no-store",
        });
        const envelope: ApiEnvelope<{ accessToken: string; refreshToken: string }> = await res.json();
        if (!res.ok || envelope.error || !envelope.data) return false;
        await setSessionCookies(envelope.data.accessToken, envelope.data.refreshToken);
        return true;
      } catch {
        return false;
      }
    })();
  }
  const result = await refreshInFlight;
  refreshInFlight = null;
  return result;
}

async function rawRequest<T>(path: string, options: RequestOptions, isRetry = false): Promise<T> {
  const { method = "GET", body, auth = true } = options;
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  if (auth) {
    const token = await getAccessToken();
    if (!token) throw new SessionExpiredError();
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });

  const envelope: ApiEnvelope<T> = await res.json();

  if (envelope.error) {
    const { code } = envelope.error;
    if (res.status === 401 && auth && !isRetry) {
      if (code === "AUTH_005") {
        const refreshed = await refreshSession();
        if (refreshed) return rawRequest<T>(path, options, true);
      }
      try {
        await clearSessionCookies();
      } catch {
        // Called from a plain Server Component render (a page's data fetch,
        // not a Server Action) — cookies can't be mutated there. The stale
        // cookie is harmless; it gets overwritten on the next successful
        // login, and proxy.ts treats an expired token as no session anyway.
      }
      throw new SessionExpiredError();
    }
    throw new ApiError(code, res.status, envelope.error.message.fr);
  }

  return envelope.data as T;
}

export function apiGet<T>(path: string, options?: Omit<RequestOptions, "method" | "body">) {
  return rawRequest<T>(path, { ...options, method: "GET" });
}
export function apiPost<T>(path: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">) {
  return rawRequest<T>(path, { ...options, method: "POST", body });
}
export function apiPut<T>(path: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">) {
  return rawRequest<T>(path, { ...options, method: "PUT", body });
}
export function apiPatch<T>(path: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">) {
  return rawRequest<T>(path, { ...options, method: "PATCH", body });
}
export function apiDelete<T>(path: string, options?: Omit<RequestOptions, "method" | "body">) {
  return rawRequest<T>(path, { ...options, method: "DELETE" });
}
