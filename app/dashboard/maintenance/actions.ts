"use server";

import { redirect } from "next/navigation";
import * as systemApi from "@/lib/api/system";
import { SessionExpiredError } from "@/lib/api/errors";

export type ActionState = { error?: string } | undefined;

// Deliberately no revalidatePath: MaintenanceToggle already reflects the new
// state optimistically the instant the checkbox is clicked, and this is the
// only place on the page that reads maintenance status — revalidating would
// just re-fetch the whole page server-side and repaint it, which is exactly
// the "feels like a refresh" flash this was built to avoid.
export async function updateMaintenanceAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const active = formData.get("active") === "on";
  const message = String(formData.get("message") ?? "").trim();

  try {
    await systemApi.updateMaintenance(active, active && message ? message : undefined);
  } catch (e) {
    if (e instanceof SessionExpiredError) redirect("/login");
    return { error: "Impossible de mettre à jour le statut. Réessaie." };
  }
  return { error: undefined };
}
