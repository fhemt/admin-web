import "server-only";
import { apiPost } from "@/lib/api/client";
import { ADMIN_DEVICE_ID, clearSessionCookies, getRefreshToken, setSessionCookies } from "@/lib/session";
import { ApiLoginResponse } from "@/lib/api/types";

export async function login(email: string, password: string): Promise<void> {
  await apiPost<void>("/api/v1/admin/auth/login", { email, password }, { auth: false });
}

export async function verifyOtp(email: string, otp: string): Promise<ApiLoginResponse> {
  const response = await apiPost<ApiLoginResponse>(
    "/api/v1/admin/auth/verify-otp",
    { email, otp, deviceId: ADMIN_DEVICE_ID },
    { auth: false }
  );
  await setSessionCookies(response.accessToken, response.refreshToken);
  return response;
}

export async function logout(): Promise<void> {
  try {
    const refreshToken = await getRefreshToken();
    if (refreshToken) {
      await apiPost<void>("/api/v1/auth/logout");
    }
  } finally {
    await clearSessionCookies();
  }
}
