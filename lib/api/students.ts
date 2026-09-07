import "server-only";
import { apiGet, apiPatch } from "@/lib/api/client";
import { ApiStudent } from "@/lib/api/types";

export function listStudents() {
  return apiGet<ApiStudent[]>("/api/v1/admin/users");
}

export function setStudentSuspended(userId: string, suspended: boolean) {
  return apiPatch<ApiStudent>(`/api/v1/admin/users/${userId}/suspend?suspended=${suspended}`);
}

export function setStudentPremium(userId: string, premium: boolean) {
  return apiPatch<ApiStudent>(`/api/v1/admin/users/${userId}/premium?premium=${premium}`);
}
