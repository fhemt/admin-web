"use client";

import { useTransition } from "react";
import { Loader2, X } from "lucide-react";
import { revokeInviteAction } from "./actions";

export function RevokeInviteButton({ token }: { token: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm("Annuler cette invitation ?")) {
          startTransition(async () => {
            await revokeInviteAction(token);
          });
        }
      }}
      className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-foreground-tertiary transition hover:bg-danger-light hover:text-danger disabled:opacity-50"
    >
      {pending ? <Loader2 size={13} className="animate-spin" /> : <X size={13} strokeWidth={2} />}
      Annuler
    </button>
  );
}
