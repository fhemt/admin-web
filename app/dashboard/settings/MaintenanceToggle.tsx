"use client";

import { useActionState, useState } from "react";
import { Loader2 } from "lucide-react";
import { ApiMaintenanceStatus } from "@/lib/api/types";
import { Field, inputClass } from "@/components/form/Field";
import { updateMaintenanceAction } from "./actions";

export function MaintenanceToggle({ status }: { status: ApiMaintenanceStatus }) {
  const [state, formAction, pending] = useActionState(updateMaintenanceAction, undefined);
  const [active, setActive] = useState(status.active);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex items-center gap-2.5 rounded-xl border border-border bg-surface px-3.5 py-3 text-sm">
        <input
          type="checkbox"
          name="active"
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
          className="size-4 accent-[var(--primary)]"
        />
        <span className="font-medium text-foreground">Activer le mode maintenance</span>
      </label>

      {active && (
        <Field label="Message affiché aux élèves (optionnel)">
          <textarea name="message" rows={2} defaultValue={status.message ?? ""} className={inputClass} />
        </Field>
      )}

      {state?.error && <p className="text-sm text-danger">{state.error}</p>}

      <div>
        <button
          type="submit"
          disabled={pending}
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition hover:bg-primary-pressed disabled:opacity-60"
        >
          {pending && <Loader2 size={16} className="animate-spin" />}
          Enregistrer
        </button>
      </div>
    </form>
  );
}
