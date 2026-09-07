"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { Field, inputClass } from "@/components/form/Field";
import { createAffiliateCodeAction } from "./actions";

export function CreateAffiliateForm() {
  const [state, formAction, pending] = useActionState(createAffiliateCodeAction, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Field label="Code">
        <input
          type="text"
          name="code"
          required
          placeholder="PROF-AHMED"
          className={`${inputClass} font-mono uppercase`}
          style={{ textTransform: "uppercase" }}
        />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Nom du propriétaire">
          <input type="text" name="ownerName" required placeholder="Prof. Ahmed" className={inputClass} />
        </Field>
        <Field label="Contact (optionnel)">
          <input type="text" name="ownerContact" placeholder="Téléphone ou email" className={inputClass} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Prix payé par l'élève (MAD)">
          <input type="number" name="discountedPrice" required min={0} step={1} className={inputClass} />
        </Field>
        <Field label="Commission de l'affilié (MAD)">
          <input type="number" name="commissionAmount" required min={0} step={1} className={inputClass} />
        </Field>
      </div>

      {state?.error && <p className="text-sm text-danger">{state.error}</p>}

      <div>
        <button
          type="submit"
          disabled={pending}
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition hover:bg-primary-pressed disabled:opacity-60"
        >
          {pending && <Loader2 size={16} className="animate-spin" />}
          Créer le code
        </button>
      </div>
    </form>
  );
}
