"use server";

import { redirect } from "next/navigation";
import * as authApi from "@/lib/api/auth";
import { ApiError } from "@/lib/api/errors";

export type ActionState = { error?: string } | undefined;

export async function loginAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Entre ton email et ton mot de passe." };
  }

  try {
    await authApi.login(email, password);
  } catch (e) {
    if (e instanceof ApiError) {
      if (e.code === "AUTH_001" || e.code === "AUTH_002") return { error: "Email ou mot de passe incorrect." };
      if (e.code === "AUTH_014") return { error: "Ce compte n'a pas accès au portail admin." };
    }
    return { error: "Une erreur est survenue. Réessaie." };
  }

  redirect(`/verify-otp?email=${encodeURIComponent(email)}`);
}

export async function verifyOtpAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const otp = String(formData.get("otp") ?? "").trim();

  if (!otp) {
    return { error: "Entre le code reçu par email." };
  }

  try {
    await authApi.verifyOtp(email, otp);
  } catch (e) {
    if (e instanceof ApiError && e.code === "AUTH_013") {
      return { error: "Code invalide ou expiré." };
    }
    return { error: "Une erreur est survenue. Réessaie." };
  }

  redirect("/dashboard/courses");
}

export async function logoutAction() {
  await authApi.logout();
  redirect("/login");
}
