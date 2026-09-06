"use client";

import { useActionState, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { ApiAcademicLevel, ApiCollegeYear, ApiCourseIcon, ApiLocalized, ApiSubject } from "@/lib/api/types";
import { Field, inputClass } from "@/components/form/Field";
import { LocalizedInput, LocalizedTextarea } from "@/components/form/LocalizedField";
import { ACADEMIC_LEVEL_LABEL, COLLEGE_YEAR_LABEL, SUBJECT_LABEL } from "@/lib/labels";
import { ActionState } from "../actions";

const EMPTY: ApiLocalized = { fr: "", darija: "" };
const STEPS = ["Classification", "Titre", "Description", "Prérequis & objectifs", "Récapitulatif"];

const ICON_OPTIONS: { value: ApiCourseIcon; label: string }[] = [
  { value: "CALCULATOR", label: "Calculatrice" },
  { value: "SIGMA", label: "Sigma" },
  { value: "RULER", label: "Règle" },
  { value: "SHAPES", label: "Formes" },
  { value: "FLASK", label: "Flacon" },
  { value: "BOOK", label: "Livre" },
];

export function CreateCourseWizard({ action }: { action: (prevState: ActionState, formData: FormData) => Promise<ActionState> }) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [step, setStep] = useState(0);
  const [stepError, setStepError] = useState<string | null>(null);

  const [academicLevel, setAcademicLevel] = useState<ApiAcademicLevel>("COLLEGE");
  const [collegeYear, setCollegeYear] = useState<ApiCollegeYear>("AC_1");
  const [subject, setSubject] = useState<ApiSubject>("MATH");
  const [icon, setIcon] = useState<ApiCourseIcon>("CALCULATOR");
  const [position, setPosition] = useState(1);
  const [title, setTitle] = useState<ApiLocalized>({ ...EMPTY });
  const [shortDescription, setShortDescription] = useState<ApiLocalized>({ ...EMPTY });
  const [estimatedMinutes, setEstimatedMinutes] = useState(30);
  const [xpReward, setXpReward] = useState(50);
  const [prerequisites, setPrerequisites] = useState<ApiLocalized>({ ...EMPTY });
  const [goalsFrText, setGoalsFrText] = useState("");
  const [goalsDarijaText, setGoalsDarijaText] = useState("");

  const stepErrorFor = (): string | null => {
    if (step === 1 && (!title.fr.trim() || !title.darija.trim())) return "Le titre est requis en français et en darija.";
    if (step === 2 && (!shortDescription.fr.trim() || !shortDescription.darija.trim()))
      return "La description est requise en français et en darija.";
    if (step === 3 && (!prerequisites.fr.trim() || !prerequisites.darija.trim()))
      return "Les prérequis sont requis en français et en darija.";
    return null;
  };

  const goNext = () => {
    const err = stepErrorFor();
    if (err) {
      setStepError(err);
      return;
    }
    setStepError(null);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const goBack = () => {
    setStepError(null);
    setStep((s) => Math.max(s - 1, 0));
  };

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <input type="hidden" name="academicLevel" value={academicLevel} />
      <input type="hidden" name="collegeYear" value={academicLevel === "COLLEGE" ? collegeYear : ""} />
      <input type="hidden" name="subject" value={subject} />
      <input type="hidden" name="icon" value={icon} />
      <input type="hidden" name="position" value={position} />
      <input type="hidden" name="estimatedMinutes" value={estimatedMinutes} />
      <input type="hidden" name="xpReward" value={xpReward} />
      <input type="hidden" name="titleFr" value={title.fr} />
      <input type="hidden" name="titleDarija" value={title.darija} />
      <input type="hidden" name="shortDescriptionFr" value={shortDescription.fr} />
      <input type="hidden" name="shortDescriptionDarija" value={shortDescription.darija} />
      <input type="hidden" name="prerequisitesFr" value={prerequisites.fr} />
      <input type="hidden" name="prerequisitesDarija" value={prerequisites.darija} />
      <input type="hidden" name="goalsFr" value={goalsFrText} />
      <input type="hidden" name="goalsDarija" value={goalsDarijaText} />

      <div className="flex items-center">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  i <= step ? "bg-primary text-on-primary" : "bg-surface-secondary text-foreground-tertiary"
                }`}
              >
                {i < step ? <Check size={14} strokeWidth={2.5} /> : i + 1}
              </div>
              <span className={`text-center text-[11px] font-medium ${i === step ? "text-foreground" : "text-foreground-tertiary"}`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && <div className="mx-2 h-px flex-1 bg-border-light" />}
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border-light bg-surface p-6">
        {step === 0 && (
          <div className="grid grid-cols-2 gap-4">
            <Field label="Niveau">
              <select
                value={academicLevel}
                onChange={(e) => setAcademicLevel(e.target.value as ApiAcademicLevel)}
                className={inputClass}
              >
                <option value="COLLEGE">Collège</option>
                <option value="LYCEE">Lycée</option>
              </select>
            </Field>
            {academicLevel === "COLLEGE" && (
              <Field label="Année">
                <select value={collegeYear} onChange={(e) => setCollegeYear(e.target.value as ApiCollegeYear)} className={inputClass}>
                  <option value="AC_1">1ère année</option>
                  <option value="AC_2">2ème année</option>
                  <option value="AC_3">3ème année</option>
                </select>
              </Field>
            )}
            <Field label="Matière">
              <select value={subject} onChange={(e) => setSubject(e.target.value as ApiSubject)} className={inputClass}>
                <option value="MATH">Maths</option>
                <option value="PHYSIQUE">Physique-Chimie</option>
                <option value="SVT">SVT</option>
              </select>
            </Field>
            <Field label="Icône">
              <select value={icon} onChange={(e) => setIcon(e.target.value as ApiCourseIcon)} className={inputClass}>
                {ICON_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Position dans le catalogue">
              <input type="number" min={1} value={position} onChange={(e) => setPosition(Number(e.target.value))} className={inputClass} />
            </Field>
          </div>
        )}

        {step === 1 && (
          <Field label="Titre du cours">
            <LocalizedInput value={title} onChange={setTitle} />
          </Field>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4">
            <Field label="Description courte">
              <LocalizedTextarea value={shortDescription} onChange={setShortDescription} rows={3} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Durée estimée (minutes)">
                <input
                  type="number"
                  min={1}
                  value={estimatedMinutes}
                  onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                  className={inputClass}
                />
              </Field>
              <Field label="XP à la fin du cours">
                <input type="number" min={0} value={xpReward} onChange={(e) => setXpReward(Number(e.target.value))} className={inputClass} />
              </Field>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-4">
            <Field label="Prérequis">
              <LocalizedTextarea value={prerequisites} onChange={setPrerequisites} rows={2} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Objectifs — un par ligne (français)">
                <textarea rows={4} value={goalsFrText} onChange={(e) => setGoalsFrText(e.target.value)} className={inputClass} />
              </Field>
              <Field label="Objectifs — un par ligne (darija)">
                <textarea dir="rtl" rows={4} value={goalsDarijaText} onChange={(e) => setGoalsDarijaText(e.target.value)} className={inputClass} />
              </Field>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between border-b border-border-light pb-2">
              <span className="text-foreground-secondary">Niveau</span>
              <span className="font-medium text-foreground">
                {ACADEMIC_LEVEL_LABEL[academicLevel]}
                {academicLevel === "COLLEGE" ? ` · ${COLLEGE_YEAR_LABEL[collegeYear]}` : ""}
              </span>
            </div>
            <div className="flex justify-between border-b border-border-light pb-2">
              <span className="text-foreground-secondary">Matière</span>
              <span className="font-medium text-foreground">{SUBJECT_LABEL[subject]}</span>
            </div>
            <div className="flex justify-between border-b border-border-light pb-2">
              <span className="text-foreground-secondary">Titre</span>
              <span className="font-medium text-foreground">{title.fr || "—"}</span>
            </div>
            <div className="flex justify-between border-b border-border-light pb-2">
              <span className="text-foreground-secondary">Description</span>
              <span className="max-w-[60%] text-right font-medium text-foreground">{shortDescription.fr || "—"}</span>
            </div>
            <div className="flex justify-between border-b border-border-light pb-2">
              <span className="text-foreground-secondary">Durée / XP</span>
              <span className="font-medium text-foreground">
                {estimatedMinutes} min · {xpReward} XP
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground-secondary">Objectifs</span>
              <span className="font-medium text-foreground">{goalsFrText.split("\n").filter(Boolean).length} objectif(s)</span>
            </div>
          </div>
        )}
      </div>

      {stepError && <p className="text-sm text-danger">{stepError}</p>}
      {state?.error && <p className="text-sm text-danger">{state.error}</p>}

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={goBack}
          disabled={step === 0}
          className="flex items-center gap-1.5 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground-secondary transition hover:border-primary hover:text-primary disabled:opacity-40"
        >
          <ChevronLeft size={16} strokeWidth={2} />
          Précédent
        </button>
        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={goNext}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition hover:bg-primary-pressed"
          >
            Suivant
            <ChevronRight size={16} strokeWidth={2} />
          </button>
        ) : (
          <button
            type="submit"
            disabled={pending}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition hover:bg-primary-pressed disabled:opacity-60"
          >
            {pending && <Loader2 size={16} className="animate-spin" />}
            Créer le cours
          </button>
        )}
      </div>
    </form>
  );
}
