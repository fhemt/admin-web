"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { ApiAffiliateCode } from "@/lib/api/types";
import { formatDate } from "@/lib/formatDate";
import { setAffiliateCodeActiveAction } from "./actions";

function ActiveToggle({ code }: { code: ApiAffiliateCode }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={(e) => {
        e.preventDefault();
        startTransition(async () => {
          await setAffiliateCodeActiveAction(code.id, !code.active);
        });
      }}
      className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition disabled:opacity-50 ${
        code.active ? "bg-success-light text-success" : "bg-surface-warm text-foreground-tertiary"
      }`}
    >
      {pending && <Loader2 size={12} className="animate-spin" />}
      {code.active ? "Actif" : "Désactivé"}
    </button>
  );
}

export function AffiliatesTable({ codes }: { codes: ApiAffiliateCode[] }) {
  if (codes.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border-light bg-surface px-5 py-10 text-center text-sm text-foreground-tertiary">
        Aucun code affilié pour l’instant.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border-light bg-surface">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border-light bg-surface-warm text-xs font-medium uppercase tracking-wide text-foreground-tertiary">
            <th className="px-5 py-3 font-medium">Code</th>
            <th className="px-5 py-3 font-medium">Propriétaire</th>
            <th className="px-5 py-3 font-medium">Prix élève</th>
            <th className="px-5 py-3 font-medium">Commission</th>
            <th className="px-5 py-3 font-medium">Ventes</th>
            <th className="px-5 py-3 font-medium">Dû</th>
            <th className="px-5 py-3 font-medium">Statut</th>
            <th className="px-5 py-3 font-medium">Créé le</th>
          </tr>
        </thead>
        <tbody>
          {codes.map((code) => (
            <tr key={code.id} className="border-b border-border-light last:border-0 hover:bg-surface-secondary">
              <td className="p-0">
                <Link href={`/dashboard/affiliates/${code.id}`} className="block px-5 py-3">
                  <span className="rounded-lg bg-surface-warm px-2 py-1 font-mono text-xs font-semibold text-foreground">{code.code}</span>
                </Link>
              </td>
              <td className="p-0">
                <Link href={`/dashboard/affiliates/${code.id}`} className="block px-5 py-3 font-medium text-foreground">
                  {code.ownerName}
                </Link>
              </td>
              <td className="p-0">
                <Link href={`/dashboard/affiliates/${code.id}`} className="block px-5 py-3 text-foreground-secondary">
                  {code.discountedPrice} MAD
                </Link>
              </td>
              <td className="p-0">
                <Link href={`/dashboard/affiliates/${code.id}`} className="block px-5 py-3 text-foreground-secondary">
                  {code.commissionAmount} MAD
                </Link>
              </td>
              <td className="p-0">
                <Link href={`/dashboard/affiliates/${code.id}`} className="block px-5 py-3 text-foreground-secondary">
                  {code.redemptionCount}
                </Link>
              </td>
              <td className="p-0">
                <Link href={`/dashboard/affiliates/${code.id}`} className="block px-5 py-3 font-semibold text-foreground">
                  {code.totalOwed} MAD
                </Link>
              </td>
              <td className="px-5 py-3">
                <ActiveToggle code={code} />
              </td>
              <td className="p-0">
                <Link href={`/dashboard/affiliates/${code.id}`} className="block px-5 py-3 text-xs text-foreground-tertiary">
                  {formatDate(code.createdAt)}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
