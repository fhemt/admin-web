"use client";

import { useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";

type Props = {
  onDelete: () => Promise<unknown>;
  confirmMessage?: string;
};

export function DeleteButton({ onDelete, confirmMessage = "Supprimer définitivement ?" }: Props) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-end gap-3">
      {pending && <Loader2 size={16} className="animate-spin text-foreground-tertiary" />}
      <button
        type="button"
        onClick={() => {
          if (confirm(confirmMessage)) {
            startTransition(async () => { await onDelete(); });
          }
        }}
        className="flex items-center gap-1.5 rounded-xl border border-danger/20 px-3.5 py-2 text-sm font-medium text-danger transition hover:bg-danger-light"
      >
        <Trash2 size={15} strokeWidth={1.75} />
        Supprimer
      </button>
    </div>
  );
}
