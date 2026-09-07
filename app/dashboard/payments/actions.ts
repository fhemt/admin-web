"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import * as premiumApi from "@/lib/api/premium";
import { SessionExpiredError } from "@/lib/api/errors";

export async function approveRequestAction(requestId: string) {
  try {
    await premiumApi.reviewPremiumRequest(requestId, true);
  } catch (e) {
    if (e instanceof SessionExpiredError) redirect("/login");
    throw e;
  }
  revalidatePath("/dashboard/payments");
}

export async function rejectRequestAction(requestId: string, rejectionReason: string) {
  try {
    await premiumApi.reviewPremiumRequest(requestId, false, rejectionReason);
  } catch (e) {
    if (e instanceof SessionExpiredError) redirect("/login");
    throw e;
  }
  revalidatePath("/dashboard/payments");
}
