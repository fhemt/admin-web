"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { Field, inputClass } from "@/components/form/Field";
import { inviteMemberAction } from "./actions";

export function InviteForm() {
  const [state, formAction, pending] = useActionState(inviteMemberAction, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Prénom">
          <input type="text" name="firstName" required className={inputClass} />
        </Field>
        <Field label="Nom">
          <input type="text" name="lastName" required className={inputClass} />
        </Field>
      </div>
      <Field label="Email">
        <input type="email" name="email" required className={inputClass} />
      </Field>
      <Field label="Rôle">
        <select name="role" defaultValue="SUPPORTER" className={inputClass}>
          <option value="SUPPORTER">Support</option>
          <option value="ADMIN">Admin</option>
        </select>
      </Field>

      {state?.error && <p className="text-sm text-danger">{state.error}</p>}

      <div>
        <button
          type="submit"
          disabled={pending}
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition hover:bg-primary-pressed disabled:opacity-60"
        >
          {pending && <Loader2 size={16} className="animate-spin" />}
          Envoyer l&apos;invitation
        </button>
      </div>
    </form>
  );
}
