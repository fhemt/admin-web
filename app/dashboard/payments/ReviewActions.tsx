"use client";

import { useTransition } from "react";
import { Check, Loader2, X } from "lucide-react";
import { approveRequestAction, rejectRequestAction } from "./actions";

export function ReviewActions({ requestId }: { requestId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          const reason = window.prompt("Raison du refus (envoyée à l'élève) :");
          if (reason === null) return;
          startTransition(async () => {
            await rejectRequestAction(requestId, reason.trim());
          });
        }}
        className="flex items-center gap-1.5 rounded-xl border border-border px-3.5 py-2 text-sm font-semibold text-danger transition hover:bg-danger-light disabled:opacity-50"
      >
        <X size={15} strokeWidth={2.5} />
        Refuser
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (!confirm("Confirmer le paiement et activer premium pour cet élève ?")) return;
          startTransition(async () => {
            await approveRequestAction(requestId);
          });
        }}
        className="flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-sm font-semibold text-on-primary transition hover:bg-primary-pressed disabled:opacity-50"
      >
        {pending ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} strokeWidth={2.5} />}
        Approuver
      </button>
    </div>
  );
}
