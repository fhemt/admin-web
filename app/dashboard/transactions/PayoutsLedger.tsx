import { ApiAffiliatePayoutWithCode } from "@/lib/api/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

export function PayoutsLedger({ payouts }: { payouts: ApiAffiliatePayoutWithCode[] }) {
  if (payouts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border-light bg-surface px-5 py-10 text-center text-sm text-foreground-tertiary">
        Aucun versement enregistré.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border-light bg-surface">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border-light bg-surface-warm text-xs font-medium uppercase tracking-wide text-foreground-tertiary">
            <th className="px-5 py-3 font-medium">Affilié</th>
            <th className="px-5 py-3 font-medium">Code</th>
            <th className="px-5 py-3 font-medium">Montant</th>
            <th className="px-5 py-3 font-medium">Note</th>
            <th className="px-5 py-3 font-medium">Versé le</th>
          </tr>
        </thead>
        <tbody>
          {payouts.map((p) => (
            <tr key={p.id} className="border-b border-border-light last:border-0">
              <td className="px-5 py-3 font-medium text-foreground">{p.ownerName ?? "—"}</td>
              <td className="px-5 py-3">
                <span className="rounded-lg bg-surface-warm px-2 py-1 font-mono text-xs font-medium text-foreground-secondary">
                  {p.code ?? "—"}
                </span>
              </td>
              <td className="px-5 py-3 font-semibold text-foreground">{p.amount} MAD</td>
              <td className="px-5 py-3 text-foreground-secondary">{p.note ?? "—"}</td>
              <td className="px-5 py-3 text-xs text-foreground-tertiary">{formatDate(p.paidAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
