"use client";

import { useActionState } from "react";
import { KeyRound, Loader2 } from "lucide-react";
import { acceptInviteAction } from "./actions";

export function AcceptInviteForm({ token }: { token: string }) {
  const boundAction = acceptInviteAction.bind(null, token);
  const [state, formAction, pending] = useActionState(boundAction, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-foreground-secondary">
          Mot de passe
        </label>
        <div className="relative">
          <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-tertiary" size={18} strokeWidth={1.5} />
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            className="w-full rounded-xl border border-border bg-surface py-2.5 pl-11 pr-4 text-[15px] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-light"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground-secondary">
          Confirme le mot de passe
        </label>
        <div className="relative">
          <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-tertiary" size={18} strokeWidth={1.5} />
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            className="w-full rounded-xl border border-border bg-surface py-2.5 pl-11 pr-4 text-[15px] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-light"
          />
        </div>
      </div>

      {state?.error && <p className="text-sm text-danger">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-[15px] font-semibold text-on-primary transition hover:bg-primary-pressed disabled:opacity-60"
      >
        {pending && <Loader2 size={16} className="animate-spin" />}
        Activer mon compte
      </button>
    </form>
  );
}
