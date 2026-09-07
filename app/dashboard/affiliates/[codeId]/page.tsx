import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getMe } from "@/lib/api/profile";
import { listAffiliateCodes, listAffiliatePayouts } from "@/lib/api/affiliates";
import { SessionExpiredError } from "@/lib/api/errors";
import { formatDate } from "@/lib/formatDate";
import { RecordPayoutForm } from "./RecordPayoutForm";

export const metadata: Metadata = { title: "Détails affilié" };

export default async function AffiliateCodeDetailPage({ params }: { params: Promise<{ codeId: string }> }) {
  const { codeId } = await params;
  let me, code, payouts;
  try {
    me = await getMe();
    if (me.role !== "ADMIN") redirect("/dashboard/courses");
    const codes = await listAffiliateCodes();
    code = codes.find((c) => c.id === codeId);
    if (!code) notFound();
    payouts = await listAffiliatePayouts(codeId);
  } catch (e) {
    if (e instanceof SessionExpiredError) redirect("/login");
    throw e;
  }

  const stats = [
    { label: "Ventes", value: code.redemptionCount },
    { label: "Gagné", value: `${code.totalEarned} MAD` },
    { label: "Versé", value: `${code.totalPaid} MAD` },
    { label: "Dû", value: `${code.totalOwed} MAD` },
  ];

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <h1 className="font-display text-2xl font-bold text-foreground">{code.ownerName}</h1>
          <span className="rounded-lg bg-surface-warm px-2 py-1 font-mono text-xs font-semibold text-foreground-secondary">{code.code}</span>
        </div>
        <p className="text-sm text-foreground-secondary">
          {code.discountedPrice} MAD payés par l’élève · {code.commissionAmount} MAD de commission par vente
          {code.ownerContact ? ` · ${code.ownerContact}` : ""}
        </p>
      </div>

      <div className="mb-6 grid grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border-light bg-surface p-4">
            <div className="text-xs text-foreground-tertiary">{s.label}</div>
            <div className="font-display text-lg font-bold text-foreground">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="mb-6 rounded-2xl border border-border-light bg-surface p-5">
        <h2 className="mb-4 text-sm font-semibold text-foreground">Enregistrer un versement</h2>
        <RecordPayoutForm codeId={code.id} />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border-light bg-surface">
        <div className="border-b border-border-light bg-surface-warm px-5 py-3 text-xs font-medium uppercase tracking-wide text-foreground-tertiary">
          Historique des versements
        </div>
        {payouts.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-foreground-tertiary">Aucun versement enregistré.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <tbody>
              {payouts.map((payout) => (
                <tr key={payout.id} className="border-b border-border-light last:border-0">
                  <td className="px-5 py-3 font-medium text-foreground">{payout.amount} MAD</td>
                  <td className="px-5 py-3 text-foreground-secondary">{payout.note ?? "—"}</td>
                  <td className="px-5 py-3 text-right text-xs text-foreground-tertiary">{formatDate(payout.paidAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
