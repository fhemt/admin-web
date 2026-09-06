"use client";

import { useActionState } from "react";
import { KeyRound, Loader2 } from "lucide-react";
import { verifyOtpAction } from "./actions";

export function OtpForm({ email }: { email: string }) {
  const [state, formAction, pending] = useActionState(verifyOtpAction, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="email" value={email} />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="otp" className="text-sm font-medium text-foreground-secondary">
          Code reçu par email
        </label>
        <div className="relative">
          <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-tertiary" size={18} strokeWidth={1.5} />
          <input
            id="otp"
            name="otp"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            required
            autoFocus
            placeholder="123456"
            className="w-full rounded-xl border border-border bg-surface py-2.5 pl-11 pr-4 text-[20px] tracking-[0.3em] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-light"
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
        Vérifier
      </button>
    </form>
  );
}
