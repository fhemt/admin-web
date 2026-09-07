"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import * as teamApi from "@/lib/api/team";
import { ApiRole } from "@/lib/api/types";
import { requireAdmin } from "@/lib/api/profile";
import { SessionExpiredError } from "@/lib/api/errors";

export type ActionState = { error?: string } | undefined;

export async function inviteMemberAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  try {
    await teamApi.inviteTeamMember({
      email: String(formData.get("email") ?? "").trim().toLowerCase(),
      firstName: String(formData.get("firstName") ?? "").trim(),
      lastName: String(formData.get("lastName") ?? "").trim(),
      role: formData.get("role") as ApiRole,
    });
  } catch (e) {
    if (e instanceof SessionExpiredError) redirect("/login");
    return { error: "Impossible d'envoyer l'invitation. Vérifie l'email et réessaie." };
  }
  revalidatePath("/dashboard/team");
  redirect("/dashboard/team");
}

export async function revokeInviteAction(token: string) {
  await requireAdmin();
  try {
    await teamApi.revokeInvite(token);
  } catch (e) {
    if (e instanceof SessionExpiredError) redirect("/login");
    throw e;
  }
  revalidatePath("/dashboard/team");
}
