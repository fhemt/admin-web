import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Pencil } from "lucide-react";
import { getCourse } from "@/lib/api/courses";
import { listLessons } from "@/lib/api/lessons";
import { listExercises } from "@/lib/api/exercises";
import { ApiError, SessionExpiredError } from "@/lib/api/errors";
import { StatusBadge } from "@/components/StatusBadge";
import { ACADEMIC_LEVEL_LABEL, COLLEGE_YEAR_LABEL, COURSE_ICON_LABEL, SUBJECT_LABEL } from "@/lib/labels";

export const metadata: Metadata = { title: "Cours" };

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-foreground-tertiary">{label}</dt>
      <dd className="mt-1 text-sm text-foreground">{children}</dd>
    </div>
  );
}

function LocalizedBlock({ fr, darija }: { fr: string; darija: string }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <p className="text-sm text-foreground">{fr || <span className="text-foreground-tertiary">—</span>}</p>
      <p dir="rtl" className="text-sm text-foreground">
        {darija || <span className="text-foreground-tertiary">—</span>}
      </p>
    </div>
  );
}

export default async function ShowCoursePage({ params }: PageProps<"/dashboard/courses/[courseId]">) {
  const { courseId } = await params;

  let course, lessons, exercises;
  try {
    [course, lessons, exercises] = await Promise.all([getCourse(courseId), listLessons(courseId), listExercises(courseId)]);
  } catch (e) {
    if (e instanceof SessionExpiredError) redirect("/login");
    if (e instanceof ApiError && e.code === "COURSE_001") notFound();
    throw e;
  }

  const sortedLessons = [...lessons].sort((a, b) => a.position - b.position);
  const sortedExercises = [...exercises].sort((a, b) => a.position - b.position);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold text-foreground">{course.title.fr}</h1>
            <StatusBadge status={course.status} />
          </div>
          <p dir="rtl" className="text-sm text-foreground-secondary">
            {course.title.darija}
          </p>
        </div>
        <Link
          href={`/dashboard/courses/${courseId}/edit`}
          className="flex shrink-0 items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary transition hover:bg-primary-pressed"
        >
          <Pencil size={15} strokeWidth={1.75} />
          Modifier
        </Link>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 rounded-2xl border border-border-light bg-surface p-4 sm:grid-cols-4">
        <Field label="Niveau">
          {ACADEMIC_LEVEL_LABEL[course.academicLevel]}
          {course.collegeYear ? ` · ${COLLEGE_YEAR_LABEL[course.collegeYear]}` : ""}
        </Field>
        <Field label="Matière">{SUBJECT_LABEL[course.subject]}</Field>
        <Field label="Icône">{COURSE_ICON_LABEL[course.icon] ?? course.icon}</Field>
        <Field label="Position">{course.position}</Field>
        <Field label="Durée estimée">{course.estimatedMinutes} min</Field>
        <Field label="XP">{course.xpReward}</Field>
        <Field label="Leçons">{lessons.length}</Field>
        <Field label="Exercices">{exercises.length}</Field>
      </div>

      <div className="mb-6 rounded-2xl border border-border-light bg-surface p-4">
        <h2 className="mb-3 font-display text-base font-bold text-foreground">Description courte</h2>
        <LocalizedBlock fr={course.shortDescription.fr} darija={course.shortDescription.darija} />
      </div>

      <div className="mb-6 rounded-2xl border border-border-light bg-surface p-4">
        <h2 className="mb-3 font-display text-base font-bold text-foreground">Prérequis</h2>
        <LocalizedBlock fr={course.prerequisites.fr} darija={course.prerequisites.darija} />
      </div>

      <div className="mb-6 rounded-2xl border border-border-light bg-surface p-4">
        <h2 className="mb-3 font-display text-base font-bold text-foreground">Objectifs</h2>
        {course.goals.length === 0 ? (
          <p className="text-sm text-foreground-tertiary">Aucun objectif renseigné.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {course.goals.map((goal, i) => (
              <li key={i} className="border-b border-border-light pb-3 last:border-0 last:pb-0">
                <LocalizedBlock fr={goal.fr} darija={goal.darija} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mb-6 rounded-2xl border border-border-light bg-surface p-4">
        <h2 className="mb-3 font-display text-base font-bold text-foreground">Leçons</h2>
        <div className="flex flex-col gap-1">
          {sortedLessons.map((lesson) => (
            <Link
              key={lesson.id}
              href={`/dashboard/courses/${courseId}/lessons/${lesson.id}/edit`}
              className="flex items-center justify-between rounded-lg px-2.5 py-2 text-sm transition hover:bg-surface-warm"
            >
              <span className="text-foreground">
                {lesson.position}. {lesson.title.fr}
              </span>
            </Link>
          ))}
          {lessons.length === 0 && <p className="px-2.5 py-2 text-sm text-foreground-tertiary">Aucune leçon pour l’instant.</p>}
        </div>
      </div>

      <div className="rounded-2xl border border-border-light bg-surface p-4">
        <h2 className="mb-3 font-display text-base font-bold text-foreground">Exercices</h2>
        <div className="flex flex-col gap-1">
          {sortedExercises.map((exercise) => (
            <Link
              key={exercise.id}
              href={`/dashboard/courses/${courseId}/exercises/${exercise.id}/edit`}
              className="flex items-center justify-between rounded-lg px-2.5 py-2 text-sm transition hover:bg-surface-warm"
            >
              <span className="text-foreground">
                {exercise.position}. {exercise.title.fr}
              </span>
            </Link>
          ))}
          {exercises.length === 0 && <p className="px-2.5 py-2 text-sm text-foreground-tertiary">Aucun exercice pour l’instant.</p>}
        </div>
      </div>
    </div>
  );
}
