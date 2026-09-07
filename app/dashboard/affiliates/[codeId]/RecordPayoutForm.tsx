"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { Field, inputClass } from "@/components/form/Field";
import { recordPayoutAction } from "../actions";

export function RecordPayoutForm({ codeId }: { codeId: string }) {
  const [state, formAction, pending] = useActionState(recordPayoutAction.bind(null, codeId), undefined);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <div className="grid grid-cols-[140px_1fr] gap-3">
        <Field label="Montant (MAD)">
          <input type="number" name="amount" required min={1} step={1} className={inputClass} />
        </Field>
        <Field label="Note (optionnel)">
          <input type="text" name="note" placeholder="Virement du 10/09" className={inputClass} />
        </Field>
      </div>

      {state?.error && <p className="text-sm text-danger">{state.error}</p>}

      <div>
        <button
          type="submit"
          disabled={pending}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-on-primary transition hover:bg-primary-pressed disabled:opacity-60"
        >
          {pending && <Loader2 size={15} className="animate-spin" />}
          Enregistrer le versement
        </button>
      </div>
    </form>
  );
}
