import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getMe } from "@/lib/api/profile";
import { SessionExpiredError } from "@/lib/api/errors";
import { InviteForm } from "../InviteForm";

export const metadata: Metadata = { title: "Inviter un membre" };

export default async function InviteMemberPage() {
  let me;
  try {
    me = await getMe();
  } catch (e) {
    if (e instanceof SessionExpiredError) redirect("/login");
    throw e;
  }
  if (me.role !== "ADMIN") redirect("/dashboard/team");

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Inviter un membre</h1>
        <p className="text-sm text-foreground-secondary">Un email avec un lien d’activation lui sera envoyé.</p>
      </div>
      <InviteForm />
    </div>
  );
}
