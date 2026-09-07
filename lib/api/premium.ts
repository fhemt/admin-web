import "server-only";
import { apiGet, apiPut } from "@/lib/api/client";
import { ApiPremiumRequest, ApiPremiumRequestStatus } from "@/lib/api/types";

export function listPremiumRequests(status?: ApiPremiumRequestStatus) {
  return apiGet<ApiPremiumRequest[]>(`/api/v1/admin/premium-requests${status ? `?status=${status}` : ""}`);
}

export function reviewPremiumRequest(requestId: string, approve: boolean, rejectionReason?: string) {
  return apiPut<ApiPremiumRequest>(`/api/v1/admin/premium-requests/${requestId}/review`, { approve, rejectionReason });
}
