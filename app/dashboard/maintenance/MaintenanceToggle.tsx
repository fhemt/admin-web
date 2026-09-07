"use client";

import { useActionState, useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { ApiMaintenanceStatus } from "@/lib/api/types";
import { Field, inputClass } from "@/components/form/Field";
import { updateMaintenanceAction } from "./actions";

export function MaintenanceToggle({ status }: { status: ApiMaintenanceStatus }) {
  const [state, formAction, pending] = useActionState(updateMaintenanceAction, undefined);
  const [active, setActive] = useState(status.active);
  const [justSaved, setJustSaved] = useState(false);

  // Adjust state during render (not in an effect) when the action's result
  // changes — the React-recommended pattern for deriving state from a prop/
  // value that changed since the last render: https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const [seenState, setSeenState] = useState(state);
  if (state !== seenState) {
    setSeenState(state);
    setJustSaved(state !== undefined && !state.error);
  }

  // No page re-render backs this action (see actions.ts), so this banner is
  // the only signal the save actually went through — auto-hides after a
  // couple of seconds. The setState here is inside the timeout callback,
  // not synchronously in the effect body, so it doesn't cascade renders.
  useEffect(() => {
    if (!justSaved) return;
    const timeout = setTimeout(() => setJustSaved(false), 2000);
    return () => clearTimeout(timeout);
  }, [justSaved]);

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

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition hover:bg-primary-pressed disabled:opacity-60"
        >
          {pending && <Loader2 size={16} className="animate-spin" />}
          Enregistrer
        </button>
        {justSaved && (
          <span className="flex items-center gap-1.5 text-sm font-medium text-success">
            <Check size={16} strokeWidth={2.5} />
            Enregistré
          </span>
        )}
      </div>
    </form>
  );
}
