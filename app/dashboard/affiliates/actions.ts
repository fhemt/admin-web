"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import * as affiliatesApi from "@/lib/api/affiliates";
import { requireAdmin } from "@/lib/api/profile";
import { ApiError, SessionExpiredError } from "@/lib/api/errors";

export type ActionState = { error?: string } | undefined;

export async function createAffiliateCodeAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  try {
    await affiliatesApi.createAffiliateCode({
      code: String(formData.get("code") ?? "").trim(),
      ownerName: String(formData.get("ownerName") ?? "").trim(),
      ownerContact: String(formData.get("ownerContact") ?? "").trim() || undefined,
      discountedPrice: Number(formData.get("discountedPrice")),
      commissionAmount: Number(formData.get("commissionAmount")),
    });
  } catch (e) {
    if (e instanceof SessionExpiredError) redirect("/login");
    return { error: e instanceof ApiError ? e.message : "Impossible de créer ce code. Réessaie." };
  }
  revalidatePath("/dashboard/affiliates");
  redirect("/dashboard/affiliates");
}

export async function setAffiliateCodeActiveAction(codeId: string, active: boolean) {
  await requireAdmin();
  try {
    await affiliatesApi.setAffiliateCodeActive(codeId, active);
  } catch (e) {
    if (e instanceof SessionExpiredError) redirect("/login");
    throw e;
  }
  revalidatePath("/dashboard/affiliates");
  revalidatePath(`/dashboard/affiliates/${codeId}`);
}

export async function recordPayoutAction(codeId: string, _prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const amount = Number(formData.get("amount"));
  try {
    await affiliatesApi.recordAffiliatePayout(codeId, amount, String(formData.get("note") ?? "").trim() || undefined);
  } catch (e) {
    if (e instanceof SessionExpiredError) redirect("/login");
    return { error: e instanceof ApiError ? e.message : "Impossible d'enregistrer ce versement. Réessaie." };
  }
  revalidatePath(`/dashboard/affiliates/${codeId}`);
  revalidatePath("/dashboard/affiliates");
  return undefined;
}
