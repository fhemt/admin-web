import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getMe } from "@/lib/api/profile";
import { SessionExpiredError } from "@/lib/api/errors";
import { ChangePasswordForm } from "./ChangePasswordForm";

export const metadata: Metadata = { title: "Profil" };

const ROLE_LABEL: Record<string, string> = { ADMIN: "Admin", SUPPORTER: "Support", STUDENT: "Élève" };

export default async function ProfilePage() {
  let me;
  try {
    me = await getMe();
  } catch (e) {
    if (e instanceof SessionExpiredError) redirect("/login");
    throw e;
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Profil</h1>
      </div>

      <div className="mb-6 rounded-2xl border border-border-light bg-surface p-5">
        <div className="flex items-center justify-between border-b border-border-light pb-3">
          <span className="text-sm text-foreground-secondary">Nom</span>
          <span className="text-sm font-medium text-foreground">
            {me.firstName} {me.lastName}
          </span>
        </div>
        <div className="flex items-center justify-between border-b border-border-light py-3">
          <span className="text-sm text-foreground-secondary">Email</span>
          <span className="text-sm font-medium text-foreground">{me.email}</span>
        </div>
        <div className="flex items-center justify-between pt-3">
          <span className="text-sm text-foreground-secondary">Rôle</span>
          <span className="text-sm font-medium text-foreground">{ROLE_LABEL[me.role]}</span>
        </div>
      </div>

      <div className="rounded-2xl border border-border-light bg-surface p-5">
        <h2 className="mb-4 font-display text-base font-bold text-foreground">Changer le mot de passe</h2>
        <ChangePasswordForm />
      </div>
    </div>
  );
}
