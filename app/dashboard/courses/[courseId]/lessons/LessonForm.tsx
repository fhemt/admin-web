"use client";

import { useActionState, useState } from "react";
import { Loader2 } from "lucide-react";
import { ApiContentBlock, ApiLesson, ApiLocalized, ApiQuiz } from "@/lib/api/types";
import { Field, inputClass } from "@/components/form/Field";
import { LocalizedInput } from "@/components/form/LocalizedField";
import { ContentBlockEditor } from "@/components/form/ContentBlockEditor";
import { QuizEditor } from "@/components/form/QuizEditor";
import { ActionState } from "./actions";

const EMPTY: ApiLocalized = { fr: "", darija: "" };

type Props = {
  lesson?: ApiLesson;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  submitLabel: string;
};

export function LessonForm({ lesson, action, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [title, setTitle] = useState<ApiLocalized>(lesson?.title ?? { ...EMPTY });
  const [objective, setObjective] = useState<ApiLocalized>(lesson?.objective ?? { ...EMPTY });
  const [content, setContent] = useState<ApiContentBlock[]>(lesson?.content ?? []);
  const [quiz, setQuiz] = useState<ApiQuiz>(lesson?.quiz ?? { id: crypto.randomUUID(), passScore: 0.7, questions: [] });

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <input type="hidden" name="titleJson" value={JSON.stringify(title)} />
      <input type="hidden" name="objectiveJson" value={JSON.stringify(objective)} />
      <input type="hidden" name="contentJson" value={JSON.stringify(content)} />
      <input type="hidden" name="quizJson" value={JSON.stringify(quiz)} />

      <div className="grid grid-cols-3 gap-4">
        <Field label="Position dans le cours">
          <input type="number" name="position" min={1} defaultValue={lesson?.position ?? 1} required className={inputClass} />
        </Field>
        <Field label="Durée estimée (minutes)">
          <input type="number" name="estimatedMinutes" min={1} defaultValue={lesson?.estimatedMinutes ?? 10} required className={inputClass} />
        </Field>
        <Field label="XP à la fin de la leçon">
          <input type="number" name="xpReward" min={0} defaultValue={lesson?.xpReward ?? 10} required className={inputClass} />
        </Field>
      </div>

      <Field label="Titre">
        <LocalizedInput value={title} onChange={setTitle} />
      </Field>
      <Field label="Objectif">
        <LocalizedInput value={objective} onChange={setObjective} />
      </Field>

      <div>
        <h2 className="mb-3 font-display text-lg font-bold text-foreground">Contenu</h2>
        <ContentBlockEditor blocks={content} onChange={setContent} />
      </div>

      <div>
        <h2 className="mb-3 font-display text-lg font-bold text-foreground">Quiz</h2>
        <QuizEditor value={quiz} onChange={setQuiz} />
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
