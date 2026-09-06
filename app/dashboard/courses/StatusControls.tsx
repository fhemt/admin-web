"use client";

import { useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { ApiContentStatus } from "@/lib/api/types";
import { deleteCourseAction, setCourseStatusAction } from "./actions";
import { STATUS_LABEL } from "./status";

const ALL_STATUSES: ApiContentStatus[] = ["DRAFT", "PENDING_REVIEW", "CHANGES_REQUESTED", "PUBLISHED"];

export function StatusControls({ courseId, status }: { courseId: string; status: ApiContentStatus }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-3">
      <select
        defaultValue={status}
        disabled={pending}
        onChange={(e) => startTransition(() => setCourseStatusAction(courseId, e.target.value as ApiContentStatus))}
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
          if (confirm("Supprimer définitivement ce cours ?")) {
            startTransition(() => deleteCourseAction(courseId));
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
