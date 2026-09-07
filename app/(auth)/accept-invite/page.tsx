import type { Metadata } from "next";
import Link from "next/link";
import { ApiTeamInvite } from "@/lib/api/types";
import { lookupInvite } from "@/lib/api/team";
import { ApiError } from "@/lib/api/errors";
import { AcceptInviteForm } from "../AcceptInviteForm";

export const metadata: Metadata = { title: "Activer mon compte" };

const ROLE_LABEL: Record<string, string> = { ADMIN: "Admin", SUPPORTER: "Support", STUDENT: "Élève" };

export default async function AcceptInvitePage({ searchParams }: PageProps<"/accept-invite">) {
  const { token } = await searchParams;

  let invite: ApiTeamInvite | null = null;
  if (token && typeof token === "string") {
    try {
      invite = await lookupInvite(token);
    } catch (e) {
      if (!(e instanceof ApiError && e.code === "AUTH_015")) throw e;
    }
  }

  if (!invite || typeof token !== "string") {
    return <InvalidInvite />;
  }

  return (
    <>
      <h1 className="mb-1 font-display text-xl font-bold text-foreground">Active ton compte</h1>
      <p className="mb-6 text-sm text-foreground-secondary">
        Tu rejoins le portail admin Fhemt en tant que <span className="font-medium text-foreground">{ROLE_LABEL[invite.role]}</span>
        {" — "}
        <span className="font-medium text-foreground">{invite.email}</span>. Choisis un mot de passe pour continuer.
      </p>
      <AcceptInviteForm token={token} />
    </>
  );
}

function InvalidInvite() {
  return (
    <>
      <h1 className="mb-1 font-display text-xl font-bold text-foreground">Invitation invalide</h1>
      <p className="mb-6 text-sm text-foreground-secondary">
        Ce lien d’invitation est invalide ou a expiré. Demande à un admin de t’en envoyer un nouveau.
      </p>
      <Link href="/login" className="text-sm font-medium text-primary hover:text-primary-pressed">
        Retour à la connexion
      </Link>
    </>
  );
}
