"use client";

import { useActionState, useState } from "react";
import { Loader2 } from "lucide-react";
import { ApiCorrection, ApiExercise, ApiLocalized } from "@/lib/api/types";
import { Field, inputClass } from "@/components/form/Field";
import { LocalizedInput, LocalizedTextarea } from "@/components/form/LocalizedField";
import { LocalizedListEditor } from "@/components/form/LocalizedListEditor";
import { DIFFICULTY_LABEL } from "@/lib/labels";
import { ActionState } from "./actions";

const EMPTY: ApiLocalized = { fr: "", darija: "" };

type Props = {
  exercise?: ApiExercise;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  submitLabel: string;
};

export function ExerciseForm({ exercise, action, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [title, setTitle] = useState<ApiLocalized>(exercise?.title ?? { ...EMPTY });
  const [statement, setStatement] = useState<ApiLocalized>(exercise?.statement ?? { ...EMPTY });
  const [hints, setHints] = useState<ApiLocalized[]>(exercise?.hints ?? []);
  const [correction, setCorrection] = useState<ApiCorrection>(
    exercise?.correction ?? { solution: { ...EMPTY }, steps: [], commonMistakes: [] }
  );

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <input type="hidden" name="titleJson" value={JSON.stringify(title)} />
      <input type="hidden" name="statementJson" value={JSON.stringify(statement)} />
      <input type="hidden" name="hintsJson" value={JSON.stringify(hints)} />
      <input type="hidden" name="correctionJson" value={JSON.stringify(correction)} />

      <div className="grid grid-cols-2 gap-4">
        <Field label="Niveau de difficulté">
          <select name="difficulty" defaultValue={exercise?.difficulty ?? "FACILE"} className={inputClass}>
            {Object.entries(DIFFICULTY_LABEL).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Position dans le cours">
          <input type="number" name="position" min={1} defaultValue={exercise?.position ?? 1} required className={inputClass} />
        </Field>
        <Field label="Durée estimée (minutes)">
          <input type="number" name="estimatedMinutes" min={1} defaultValue={exercise?.estimatedMinutes ?? 5} required className={inputClass} />
        </Field>
        <Field label="Accès">
          <label className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2.5 text-[14px]">
            <input type="checkbox" name="premium" defaultChecked={exercise?.premium ?? true} className="size-4 accent-[var(--primary)]" />
            Réservé aux comptes premium
          </label>
        </Field>
      </div>

      <Field label="Titre">
        <LocalizedInput value={title} onChange={setTitle} />
      </Field>

      <Field label="Énoncé">
        <LocalizedTextarea value={statement} onChange={setStatement} rows={3} />
      </Field>

      <Field label="Indices">
        <LocalizedListEditor items={hints} onChange={setHints} addLabel="Ajouter un indice" />
      </Field>

      <div>
        <h2 className="mb-3 font-display text-lg font-bold text-foreground">Correction</h2>
        <div className="flex flex-col gap-4">
          <Field label="Solution">
            <LocalizedTextarea value={correction.solution} onChange={(solution) => setCorrection({ ...correction, solution })} rows={2} />
          </Field>
          <Field label="Étapes">
            <LocalizedListEditor items={correction.steps} onChange={(steps) => setCorrection({ ...correction, steps })} addLabel="Ajouter une étape" />
          </Field>
          <Field label="Erreurs fréquentes">
            <LocalizedListEditor
              items={correction.commonMistakes}
              onChange={(commonMistakes) => setCorrection({ ...correction, commonMistakes })}
              addLabel="Ajouter une erreur fréquente"
            />
          </Field>
        </div>
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
