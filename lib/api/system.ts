import "server-only";
import { apiGet, apiPut } from "@/lib/api/client";
import { ApiMaintenanceStatus } from "@/lib/api/types";

export function getMaintenanceStatus() {
  return apiGet<ApiMaintenanceStatus>("/api/v1/admin/system/maintenance");
}

export function updateMaintenance(active: boolean, message?: string) {
  return apiPut<void>("/api/v1/admin/system/maintenance", { active, message });
}
