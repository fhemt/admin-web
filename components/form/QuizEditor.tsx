"use client";

import { Plus, Trash2 } from "lucide-react";
import { ApiQuiz, ApiQuizChoice, ApiQuizQuestion } from "@/lib/api/types";
import { Field, inputClass } from "./Field";
import { LocalizedInput } from "./LocalizedField";

const EMPTY = { fr: "", darija: "" };

function newChoice(): ApiQuizChoice {
  return { id: crypto.randomUUID(), label: { ...EMPTY } };
}

function newQuestion(): ApiQuizQuestion {
  const choices = [newChoice(), newChoice()];
  return { id: crypto.randomUUID(), prompt: { ...EMPTY }, choices, correctChoiceId: choices[0].id, explanation: { ...EMPTY } };
}

export function QuizEditor({ value, onChange }: { value: ApiQuiz; onChange: (value: ApiQuiz) => void }) {
  const updateQuestion = (i: number, question: ApiQuizQuestion) =>
    onChange({ ...value, questions: value.questions.map((q, idx) => (idx === i ? question : q)) });

  return (
    <div className="flex flex-col gap-4">
      <Field label="Score de réussite (entre 0 et 1)">
        <input
          type="number"
          min={0}
          max={1}
          step={0.05}
          className={`${inputClass} max-w-[140px]`}
          value={value.passScore}
          onChange={(e) => onChange({ ...value, passScore: Number(e.target.value) })}
        />
      </Field>

      {value.questions.map((q, i) => (
        <div key={q.id} className="rounded-2xl border border-border-light bg-surface-warm p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-foreground-tertiary">Question {i + 1}</span>
            <button
              type="button"
              onClick={() => onChange({ ...value, questions: value.questions.filter((_, idx) => idx !== i) })}
              className="rounded-lg p-1.5 text-foreground-tertiary transition hover:bg-danger-light hover:text-danger"
            >
              <Trash2 size={15} strokeWidth={1.75} />
            </button>
          </div>

          <Field label="Question">
            <LocalizedInput value={q.prompt} onChange={(prompt) => updateQuestion(i, { ...q, prompt })} />
          </Field>

          <div className="mt-3 flex flex-col gap-2">
            <span className="text-sm font-medium text-foreground-secondary">Choix — coche la bonne réponse</span>
            {q.choices.map((c) => (
              <div key={c.id} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`correct-${q.id}`}
                  checked={q.correctChoiceId === c.id}
                  onChange={() => updateQuestion(i, { ...q, correctChoiceId: c.id })}
                  className="size-4 accent-[var(--primary)]"
                />
                <div className="flex-1">
                  <LocalizedInput
                    value={c.label}
                    onChange={(label) =>
                      updateQuestion(i, { ...q, choices: q.choices.map((cc) => (cc.id === c.id ? { ...cc, label } : cc)) })
                    }
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const choices = q.choices.filter((cc) => cc.id !== c.id);
                    updateQuestion(i, {
                      ...q,
                      choices,
                      correctChoiceId: q.correctChoiceId === c.id ? (choices[0]?.id ?? "") : q.correctChoiceId,
                    });
                  }}
                  className="rounded-lg p-2 text-foreground-tertiary transition hover:bg-danger-light hover:text-danger"
                >
                  <Trash2 size={14} strokeWidth={1.75} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => updateQuestion(i, { ...q, choices: [...q.choices, newChoice()] })}
              className="flex items-center gap-1.5 self-start rounded-lg border border-dashed border-border px-3 py-1.5 text-xs font-medium text-foreground-secondary transition hover:border-primary hover:text-primary"
            >
              <Plus size={14} strokeWidth={2} />
              Ajouter un choix
            </button>
          </div>

          <div className="mt-3">
            <Field label="Explication — affichée après la réponse">
              <LocalizedInput value={q.explanation} onChange={(explanation) => updateQuestion(i, { ...q, explanation })} />
            </Field>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange({ ...value, questions: [...value.questions, newQuestion()] })}
        className="flex items-center gap-1.5 self-start rounded-xl border border-dashed border-border px-4 py-2 text-sm font-medium text-foreground-secondary transition hover:border-primary hover:text-primary"
      >
        <Plus size={16} strokeWidth={2} />
        Ajouter une question
      </button>
    </div>
  );
}
