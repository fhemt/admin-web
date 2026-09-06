import "server-only";
import { apiGet, apiPost } from "@/lib/api/client";
import { ApiAdminUser } from "@/lib/api/types";

export function getMe() {
  return apiGet<ApiAdminUser>("/api/v1/users/me");
}

export function changePassword(currentPassword: string, newPassword: string) {
  return apiPost<void>("/api/v1/users/me/change-password", { currentPassword, newPassword });
}
