"use client";

import { Plus, Trash2 } from "lucide-react";
import { ApiLocalized, ApiMockExamPart } from "@/lib/api/types";
import { Field } from "@/components/form/Field";
import { LocalizedTextarea } from "@/components/form/LocalizedField";
import { LocalizedListEditor } from "@/components/form/LocalizedListEditor";

const EMPTY: ApiLocalized = { fr: "", darija: "" };

function newPart(): ApiMockExamPart {
  return { id: crypto.randomUUID(), prompt: { ...EMPTY }, solution: { ...EMPTY }, steps: [] };
}

export function PartsEditor({ parts, onChange }: { parts: ApiMockExamPart[]; onChange: (parts: ApiMockExamPart[]) => void }) {
  const updatePart = (i: number, part: ApiMockExamPart) => onChange(parts.map((p, idx) => (idx === i ? part : p)));

  return (
    <div className="flex flex-col gap-4">
      {parts.map((part, i) => (
        <div key={part.id} className="rounded-2xl border border-border-light bg-surface-warm p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-foreground-tertiary">Partie {i + 1}</span>
            <button
              type="button"
              onClick={() => onChange(parts.filter((_, idx) => idx !== i))}
              className="rounded-lg p-1.5 text-foreground-tertiary transition hover:bg-danger-light hover:text-danger"
            >
              <Trash2 size={15} strokeWidth={1.75} />
            </button>
          </div>
          <div className="flex flex-col gap-3">
            <Field label="Énoncé">
              <LocalizedTextarea value={part.prompt} onChange={(prompt) => updatePart(i, { ...part, prompt })} rows={2} />
            </Field>
            <Field label="Solution">
              <LocalizedTextarea value={part.solution} onChange={(solution) => updatePart(i, { ...part, solution })} rows={2} />
            </Field>
            <Field label="Étapes">
              <LocalizedListEditor items={part.steps} onChange={(steps) => updatePart(i, { ...part, steps })} addLabel="Ajouter une étape" />
            </Field>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...parts, newPart()])}
        className="flex items-center gap-1.5 self-start rounded-xl border border-dashed border-border px-4 py-2 text-sm font-medium text-foreground-secondary transition hover:border-primary hover:text-primary"
      >
        <Plus size={16} strokeWidth={2} />
        Ajouter une partie
      </button>
    </div>
  );
}
