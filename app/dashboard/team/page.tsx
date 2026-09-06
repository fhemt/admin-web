import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { getMe } from "@/lib/api/profile";
import { listPendingInvites, listTeamMembers } from "@/lib/api/team";
import { SessionExpiredError } from "@/lib/api/errors";
import { RevokeInviteButton } from "./RevokeInviteButton";

export const metadata: Metadata = { title: "Équipe" };

const ROLE_LABEL: Record<string, string> = { ADMIN: "Admin", TEACHER: "Enseignant", STUDENT: "Élève" };

export default async function TeamPage() {
  let me, members, invites;
  try {
    [me, members, invites] = await Promise.all([getMe(), listTeamMembers(), listPendingInvites()]);
  } catch (e) {
    if (e instanceof SessionExpiredError) redirect("/login");
    throw e;
  }

  const isAdmin = me.role === "ADMIN";

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Équipe</h1>
          <p className="text-sm text-foreground-secondary">{members.length} membre(s) · {invites.length} invitation(s) en attente.</p>
        </div>
        {isAdmin && (
          <Link
            href="/dashboard/team/invite"
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary transition hover:bg-primary-pressed"
          >
            <Plus size={16} strokeWidth={2} />
            Inviter un membre
          </Link>
        )}
      </div>

      <div className="mb-6 overflow-hidden rounded-2xl border border-border-light bg-surface">
        <div className="border-b border-border-light bg-surface-warm px-5 py-3 text-xs font-medium uppercase tracking-wide text-foreground-tertiary">
          Membres
        </div>
        <table className="w-full text-left text-sm">
          <tbody>
            {members.map((member) => (
              <tr key={member.userId} className="border-b border-border-light last:border-0">
                <td className="px-5 py-3">
                  <div className="font-medium text-foreground">
                    {member.firstName} {member.lastName}
                  </div>
                  <div className="text-xs text-foreground-tertiary">{member.email}</div>
                </td>
                <td className="px-5 py-3 text-right text-foreground-secondary">{ROLE_LABEL[member.role]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {invites.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-border-light bg-surface">
          <div className="border-b border-border-light bg-surface-warm px-5 py-3 text-xs font-medium uppercase tracking-wide text-foreground-tertiary">
            Invitations en attente
          </div>
          <table className="w-full text-left text-sm">
            <tbody>
              {invites.map((invite) => (
                <tr key={invite.token} className="border-b border-border-light last:border-0">
                  <td className="px-5 py-3">
                    <div className="font-medium text-foreground">
                      {invite.firstName} {invite.lastName}
                    </div>
                    <div className="text-xs text-foreground-tertiary">{invite.email}</div>
                  </td>
                  <td className="px-5 py-3 text-foreground-secondary">{ROLE_LABEL[invite.role]}</td>
                  {isAdmin && (
                    <td className="px-5 py-3 text-right">
                      <RevokeInviteButton token={invite.token} />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
