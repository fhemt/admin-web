"use server";

import { redirect } from "next/navigation";
import * as profileApi from "@/lib/api/profile";
import { ApiError, SessionExpiredError } from "@/lib/api/errors";

export type ActionState = { error?: string; success?: boolean } | undefined;

export async function changePasswordAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (newPassword !== confirmPassword) {
    return { error: "Les deux mots de passe ne correspondent pas." };
  }
  if (newPassword.length < 8) {
    return { error: "Le nouveau mot de passe doit faire au moins 8 caractères." };
  }

  try {
    await profileApi.changePassword(currentPassword, newPassword);
  } catch (e) {
    if (e instanceof SessionExpiredError) redirect("/login");
    if (e instanceof ApiError && e.code === "AUTH_002") return { error: "Mot de passe actuel incorrect." };
    return { error: "Impossible de changer le mot de passe. Réessaie." };
  }
  return { success: true };
}
