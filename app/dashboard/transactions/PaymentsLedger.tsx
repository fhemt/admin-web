"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ApiPremiumRequest, ApiPremiumRequestStatus } from "@/lib/api/types";
import { formatDate } from "@/lib/formatDate";

const STATUS_LABEL: Record<ApiPremiumRequestStatus, string> = {
  PENDING: "En attente",
  APPROVED: "Approuvé",
  REJECTED: "Refusé",
};

const STATUS_CLASSES: Record<ApiPremiumRequestStatus, string> = {
  PENDING: "bg-gold-light text-gold",
  APPROVED: "bg-success-light text-success",
  REJECTED: "bg-danger-light text-danger",
};

const STATUS_TABS: (ApiPremiumRequestStatus | "ALL")[] = ["ALL", "PENDING", "APPROVED", "REJECTED"];

export function PaymentsLedger({ requests }: { requests: ApiPremiumRequest[] }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApiPremiumRequestStatus | "ALL">("ALL");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return requests.filter((r) => {
      if (statusFilter !== "ALL" && r.status !== statusFilter) return false;
      if (!q) return true;
      return (
        `${r.userFirstName} ${r.userLastName}`.toLowerCase().includes(q) ||
        r.userEmail.toLowerCase().includes(q) ||
        r.userReferenceCode.toLowerCase().includes(q) ||
        (r.promoCode ?? "").toLowerCase().includes(q)
      );
    });
  }, [requests, query, statusFilter]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search size={16} strokeWidth={1.75} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-tertiary" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Élève, email, code..."
            className="w-full rounded-xl border border-border bg-surface py-2.5 pl-10 pr-3.5 text-sm text-foreground placeholder:text-foreground-tertiary focus:border-primary focus:outline-none"
          />
        </div>
        <div className="flex gap-1.5 rounded-xl border border-border-light bg-surface p-1">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                statusFilter === tab ? "bg-primary text-on-primary" : "text-foreground-secondary hover:bg-surface-secondary"
              }`}
            >
              {tab === "ALL" ? "Tout" : STATUS_LABEL[tab]}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border-light bg-surface px-5 py-10 text-center text-sm text-foreground-tertiary">
          Aucune transaction trouvée.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border-light bg-surface">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border-light bg-surface-warm text-xs font-medium uppercase tracking-wide text-foreground-tertiary">
                <th className="px-5 py-3 font-medium">Élève</th>
                <th className="px-5 py-3 font-medium">Code référence</th>
                <th className="px-5 py-3 font-medium">Montant</th>
                <th className="px-5 py-3 font-medium">Code promo</th>
                <th className="px-5 py-3 font-medium">Statut</th>
                <th className="px-5 py-3 font-medium">Soumis le</th>
                <th className="px-5 py-3 font-medium">Traité le</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-border-light last:border-0">
                  <td className="px-5 py-3">
                    <div className="font-medium text-foreground">
                      {r.userFirstName} {r.userLastName}
                    </div>
                    <div className="text-xs text-foreground-tertiary">{r.userEmail}</div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="rounded-lg bg-surface-warm px-2 py-1 font-mono text-xs font-medium text-foreground-secondary">
                      {r.userReferenceCode}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-semibold text-foreground">{r.pricePaid} MAD</td>
                  <td className="px-5 py-3 text-foreground-secondary">
                    {r.promoCode ? (
                      <>
                        {r.promoCode}
                        {r.affiliateOwnerName ? ` — ${r.affiliateOwnerName}` : ""}
                      </>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_CLASSES[r.status]}`}>
                      {STATUS_LABEL[r.status]}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs text-foreground-tertiary">{formatDate(r.submittedAt)}</td>
                  <td className="px-5 py-3 text-xs text-foreground-tertiary">{formatDate(r.reviewedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
