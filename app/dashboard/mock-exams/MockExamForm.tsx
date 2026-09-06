"use client";

import { useActionState, useState } from "react";
import { Loader2 } from "lucide-react";
import { ApiLocalized, ApiMockExam, ApiMockExamPart } from "@/lib/api/types";
import { Field, inputClass } from "@/components/form/Field";
import { LocalizedInput } from "@/components/form/LocalizedField";
import { DIFFICULTY_LABEL } from "@/lib/labels";
import { PartsEditor } from "./PartsEditor";
import { ActionState } from "./actions";

const EMPTY: ApiLocalized = { fr: "", darija: "" };

type Props = {
  exam?: ApiMockExam;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  submitLabel: string;
};

export function MockExamForm({ exam, action, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [title, setTitle] = useState<ApiLocalized>(exam?.title ?? { ...EMPTY });
  const [parts, setParts] = useState<ApiMockExamPart[]>(exam?.parts ?? []);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <input type="hidden" name="titleJson" value={JSON.stringify(title)} />
      <input type="hidden" name="partsJson" value={JSON.stringify(parts)} />

      <div className="grid grid-cols-2 gap-4">
        <Field label="Niveau de difficulté">
          <select name="difficulty" defaultValue={exam?.difficulty ?? "MOYEN"} className={inputClass}>
            {Object.entries(DIFFICULTY_LABEL).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Position dans le catalogue">
          <input type="number" name="position" min={1} defaultValue={exam?.position ?? 1} required className={inputClass} />
        </Field>
        <Field label="Durée (minutes)">
          <input type="number" name="durationMinutes" min={1} defaultValue={exam?.durationMinutes ?? 60} required className={inputClass} />
        </Field>
        <Field label="Accès">
          <label className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2.5 text-[14px]">
            <input type="checkbox" name="premium" defaultChecked={exam?.premium ?? true} className="size-4 accent-[var(--primary)]" />
            Réservé aux comptes premium
          </label>
        </Field>
      </div>

      <Field label="Titre">
        <LocalizedInput value={title} onChange={setTitle} />
      </Field>

      <div>
        <h2 className="mb-3 font-display text-lg font-bold text-foreground">Parties de l&apos;examen</h2>
        <PartsEditor parts={parts} onChange={setParts} />
      </div>

      {state?.error && <p className="text-sm text-danger">{state.error}</p>}

      <div>
        <button
          type="submit"
          disabled={pending}
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition hover:bg-primary-pressed disabled:opacity-60"
        >
          {pending && <Loader2 size={16} className="animate-spin" />}
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
