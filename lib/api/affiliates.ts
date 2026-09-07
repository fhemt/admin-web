import "server-only";
import { apiGet, apiPatch, apiPost } from "@/lib/api/client";
import { ApiAffiliateCode, ApiAffiliatePayout, ApiAffiliatePayoutWithCode } from "@/lib/api/types";

export function listAffiliateCodes() {
  return apiGet<ApiAffiliateCode[]>("/api/v1/admin/affiliate-codes");
}

export function createAffiliateCode(input: {
  code: string;
  ownerName: string;
  ownerContact?: string;
  discountedPrice: number;
  commissionAmount: number;
}) {
  return apiPost<ApiAffiliateCode>("/api/v1/admin/affiliate-codes", input);
}

export function setAffiliateCodeActive(codeId: string, active: boolean) {
  return apiPatch<ApiAffiliateCode>(`/api/v1/admin/affiliate-codes/${codeId}/active?active=${active}`);
}

export function recordAffiliatePayout(codeId: string, amount: number, note?: string) {
  return apiPost<ApiAffiliatePayout>(`/api/v1/admin/affiliate-codes/${codeId}/payouts`, { amount, note });
}

export function listAffiliatePayouts(codeId: string) {
  return apiGet<ApiAffiliatePayout[]>(`/api/v1/admin/affiliate-codes/${codeId}/payouts`);
}

export function listAllAffiliatePayouts() {
  return apiGet<ApiAffiliatePayoutWithCode[]>("/api/v1/admin/affiliate-codes/payouts");
}
