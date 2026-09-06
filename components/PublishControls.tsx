"use client";

import { useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { ApiContentStatus } from "@/lib/api/types";
import { STATUS_LABEL } from "@/lib/labels";

const ALL_STATUSES: ApiContentStatus[] = ["DRAFT", "PENDING_REVIEW", "CHANGES_REQUESTED", "PUBLISHED"];

type Props = {
  status: ApiContentStatus;
  onStatusChange: (status: ApiContentStatus) => Promise<unknown>;
  onDelete: () => Promise<unknown>;
  deleteConfirmMessage?: string;
};

export function PublishControls({ status, onStatusChange, onDelete, deleteConfirmMessage = "Supprimer définitivement ?" }: Props) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-3">
      <select
        defaultValue={status}
        disabled={pending}
        onChange={(e) => startTransition(async () => { await onStatusChange(e.target.value as ApiContentStatus); })}
        className="rounded-xl border border-border bg-surface px-3.5 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-light"
      >
        {ALL_STATUSES.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABEL[s]}
          </option>
        ))}
      </select>
      {pending && <Loader2 size={16} className="animate-spin text-foreground-tertiary" />}
      <button
        type="button"
        onClick={() => {
          if (confirm(deleteConfirmMessage)) {
            startTransition(async () => { await onDelete(); });
          }
        }}
        className="ml-auto flex items-center gap-1.5 rounded-xl border border-danger/20 px-3.5 py-2 text-sm font-medium text-danger transition hover:bg-danger-light"
      >
        <Trash2 size={15} strokeWidth={1.75} />
        Supprimer
      </button>
    </div>
  );
}
