import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getMe } from "@/lib/api/profile";
import { listPremiumRequests } from "@/lib/api/premium";
import { listAllAffiliatePayouts } from "@/lib/api/affiliates";
import { SessionExpiredError } from "@/lib/api/errors";
import { PaymentsLedger } from "./PaymentsLedger";
import { PayoutsLedger } from "./PayoutsLedger";

export const metadata: Metadata = { title: "Transactions" };

export default async function TransactionsPage() {
  let requests, payouts;
  try {
    const me = await getMe();
    if (me.role !== "ADMIN") redirect("/dashboard/courses");
    [requests, payouts] = await Promise.all([listPremiumRequests(), listAllAffiliatePayouts()]);
  } catch (e) {
    if (e instanceof SessionExpiredError) redirect("/login");
    throw e;
  }

  const totalRevenue = requests.filter((r) => r.status === "APPROVED").reduce((sum, r) => sum + r.pricePaid, 0);
  const totalPaidOut = payouts.reduce((sum, p) => sum + p.amount, 0);
  const pendingCount = requests.filter((r) => r.status === "PENDING").length;

  const stats = [
    { label: "Revenu total", value: `${totalRevenue} MAD` },
    { label: "Versé aux affiliés", value: `${totalPaidOut} MAD` },
    { label: "Net", value: `${totalRevenue - totalPaidOut} MAD` },
    { label: "En attente", value: String(pendingCount) },
  ];

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Transactions</h1>
        <p className="text-sm text-foreground-secondary">
          Historique complet des paiements élèves et des versements affiliés.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border-light bg-surface p-4">
            <div className="text-xs text-foreground-tertiary">{s.label}</div>
            <div className="font-display text-xl font-bold text-foreground">{s.value}</div>
          </div>
        ))}
      </div>

      <section>
        <h2 className="mb-3 font-display text-lg font-bold text-foreground">Paiements élèves</h2>
        <PaymentsLedger requests={requests} />
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg font-bold text-foreground">Versements affiliés</h2>
        <PayoutsLedger payouts={payouts} />
      </section>
    </div>
  );
}
