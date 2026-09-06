"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import * as systemApi from "@/lib/api/system";
import { SessionExpiredError } from "@/lib/api/errors";

export type ActionState = { error?: string } | undefined;

export async function updateMaintenanceAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const active = formData.get("active") === "on";
  const message = String(formData.get("message") ?? "").trim();

  try {
    await systemApi.updateMaintenance(active, active && message ? message : undefined);
  } catch (e) {
    if (e instanceof SessionExpiredError) redirect("/login");
    return { error: "Impossible de mettre à jour le statut. Réessaie." };
  }
  revalidatePath("/dashboard/settings");
  return { error: undefined };
}
