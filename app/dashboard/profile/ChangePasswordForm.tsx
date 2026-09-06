"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { Field, inputClass } from "@/components/form/Field";
import { changePasswordAction } from "./actions";

export function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(changePasswordAction, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Field label="Mot de passe actuel">
        <input type="password" name="currentPassword" required className={inputClass} />
      </Field>
      <Field label="Nouveau mot de passe">
        <input type="password" name="newPassword" required minLength={8} className={inputClass} />
      </Field>
      <Field label="Confirme le nouveau mot de passe">
        <input type="password" name="confirmPassword" required minLength={8} className={inputClass} />
      </Field>

      {state?.error && <p className="text-sm text-danger">{state.error}</p>}
      {state?.success && <p className="text-sm text-success">Mot de passe changé avec succès.</p>}

      <div>
        <button
          type="submit"
          disabled={pending}
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition hover:bg-primary-pressed disabled:opacity-60"
        >
          {pending && <Loader2 size={16} className="animate-spin" />}
          Changer le mot de passe
        </button>
      </div>
    </form>
  );
}
