"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { ApiCourse } from "@/lib/api/types";
import { ActionState } from "./actions";

type Props = {
  course?: ApiCourse;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  submitLabel: string;
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground-secondary">{label}</label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-[14px] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-light";

export function CourseForm({ course, action, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const goalsFr = course?.goals.map((g) => g.fr).join("\n") ?? "";
  const goalsDarija = course?.goals.map((g) => g.darija).join("\n") ?? "";

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Niveau">
          <select name="academicLevel" defaultValue={course?.academicLevel ?? "COLLEGE"} className={inputClass}>
            <option value="COLLEGE">Collège</option>
            <option value="LYCEE">Lycée</option>
          </select>
        </Field>
        <Field label="Année (collège uniquement)">
          <select name="collegeYear" defaultValue={course?.collegeYear ?? ""} className={inputClass}>
            <option value="">—</option>
            <option value="AC_1">1ère année</option>
            <option value="AC_2">2ème année</option>
            <option value="AC_3">3ème année</option>
          </select>
        </Field>
        <Field label="Matière">
          <select name="subject" defaultValue={course?.subject ?? "MATH"} className={inputClass}>
            <option value="MATH">Maths</option>
            <option value="PHYSIQUE">Physique-Chimie</option>
            <option value="SVT">SVT</option>
          </select>
        </Field>
        <Field label="Icône">
          <select name="icon" defaultValue={course?.icon ?? "CALCULATOR"} className={inputClass}>
            <option value="CALCULATOR">Calculatrice</option>
            <option value="SIGMA">Sigma</option>
            <option value="RULER">Règle</option>
            <option value="SHAPES">Formes</option>
            <option value="FLASK">Flacon</option>
            <option value="BOOK">Livre</option>
          </select>
        </Field>
        <Field label="Position dans le catalogue">
          <input type="number" name="position" min={1} defaultValue={course?.position ?? 1} required className={inputClass} />
        </Field>
        <Field label="Durée estimée (minutes)">
          <input type="number" name="estimatedMinutes" min={1} defaultValue={course?.estimatedMinutes ?? 30} required className={inputClass} />
        </Field>
        <Field label="XP à la fin du cours">
          <input type="number" name="xpReward" min={0} defaultValue={course?.xpReward ?? 50} required className={inputClass} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Titre (français)">
          <input type="text" name="titleFr" defaultValue={course?.title.fr} required className={inputClass} />
        </Field>
        <Field label="Titre (darija)">
          <input type="text" name="titleDarija" dir="rtl" defaultValue={course?.title.darija} required className={inputClass} />
        </Field>
        <Field label="Description courte (français)">
          <textarea name="shortDescriptionFr" rows={2} defaultValue={course?.shortDescription.fr} required className={inputClass} />
        </Field>
        <Field label="Description courte (darija)">
          <textarea name="shortDescriptionDarija" dir="rtl" rows={2} defaultValue={course?.shortDescription.darija} required className={inputClass} />
        </Field>
        <Field label="Prérequis (français)">
          <textarea name="prerequisitesFr" rows={2} defaultValue={course?.prerequisites.fr} required className={inputClass} />
        </Field>
        <Field label="Prérequis (darija)">
          <textarea name="prerequisitesDarija" dir="rtl" rows={2} defaultValue={course?.prerequisites.darija} required className={inputClass} />
        </Field>
        <Field label="Objectifs — un par ligne (français)">
          <textarea name="goalsFr" rows={4} defaultValue={goalsFr} required className={inputClass} />
        </Field>
        <Field label="Objectifs — un par ligne (darija)">
          <textarea name="goalsDarija" dir="rtl" rows={4} defaultValue={goalsDarija} required className={inputClass} />
        </Field>
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
