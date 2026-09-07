import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getMe } from "@/lib/api/profile";
import { getMaintenanceStatus } from "@/lib/api/system";
import { SessionExpiredError } from "@/lib/api/errors";
import { MaintenanceToggle } from "./MaintenanceToggle";

export const metadata: Metadata = { title: "Maintenance" };

export default async function MaintenancePage() {
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
        <h1 className="font-display text-2xl font-bold text-foreground">Maintenance</h1>
        <p className="mt-1 text-sm text-foreground-secondary">
          Verrouille l’app mobile sur un écran de maintenance pour tous les élèves, immédiatement.
        </p>
      </div>

      <div className="rounded-2xl border border-border-light bg-surface p-5">
        <MaintenanceToggle status={status} />
      </div>
    </div>
  );
}
