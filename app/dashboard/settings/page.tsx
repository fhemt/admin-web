import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getMe } from "@/lib/api/profile";
import { getMaintenanceStatus } from "@/lib/api/system";
import { SessionExpiredError } from "@/lib/api/errors";
import { MaintenanceToggle } from "./MaintenanceToggle";

export const metadata: Metadata = { title: "Paramètres" };

export default async function SettingsPage() {
  let me, status;
  try {
    me = await getMe();
    if (me.role !== "ADMIN") redirect("/dashboard/courses");
    status = await getMaintenanceStatus();
  } catch (e) {
    if (e instanceof SessionExpiredError) redirect("/login");
    throw e;
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Paramètres</h1>
      </div>

      <div className="rounded-2xl border border-border-light bg-surface p-5">
        <h2 className="mb-1 font-display text-base font-bold text-foreground">Mode maintenance</h2>
        <p className="mb-4 text-sm text-foreground-secondary">
          Verrouille l’app mobile sur un écran de maintenance pour tous les élèves, immédiatement.
        </p>
        <MaintenanceToggle status={status} />
      </div>
    </div>
  );
}
