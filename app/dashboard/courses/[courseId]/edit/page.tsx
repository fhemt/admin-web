import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { getCourse } from "@/lib/api/courses";
import { listLessons } from "@/lib/api/lessons";
import { listExercises } from "@/lib/api/exercises";
import { ApiError, SessionExpiredError } from "@/lib/api/errors";
import { StatusBadge } from "@/components/StatusBadge";
import { CourseForm } from "../../CourseForm";
import { StatusControls } from "../../StatusControls";
import { updateCourseAction } from "../../actions";

export const metadata: Metadata = { title: "Modifier le cours" };

export default async function EditCoursePage({ params }: PageProps<"/dashboard/courses/[courseId]/edit">) {
  const { courseId } = await params;

  let course, lessons, exercises;
  try {
    [course, lessons, exercises] = await Promise.all([getCourse(courseId), listLessons(courseId), listExercises(courseId)]);
  } catch (e) {
    if (e instanceof SessionExpiredError) redirect("/login");
    if (e instanceof ApiError && e.code === "COURSE_001") notFound();
    throw e;
  }

  const boundUpdate = updateCourseAction.bind(null, courseId);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">{course.title.fr}</h1>
          <p className="text-sm text-foreground-secondary">{lessons.length} leçon(s) · {exercises.length} exercice(s)</p>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-border-light bg-surface p-4">
        <StatusControls courseId={course.id} status={course.status} />
      </div>

      <div className="mb-6 rounded-2xl border border-border-light bg-surface p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-base font-bold text-foreground">Leçons</h2>
          <Link
            href={`/dashboard/courses/${courseId}/lessons/new`}
            className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-foreground-secondary transition hover:border-primary hover:text-primary"
          >
            <Plus size={13} strokeWidth={2} />
            Nouvelle leçon
          </Link>
        </div>
        <div className="flex flex-col gap-1">
          {lessons.map((lesson) => (
            <Link
              key={lesson.id}
              href={`/dashboard/courses/${courseId}/lessons/${lesson.id}/edit`}
              className="flex items-center justify-between rounded-lg px-2.5 py-2 text-sm transition hover:bg-surface-warm"
            >
              <span className="text-foreground">
                {lesson.position}. {lesson.title.fr}
              </span>
              <StatusBadge status={lesson.status} />
            </Link>
          ))}
          {lessons.length === 0 && <p className="px-2.5 py-2 text-sm text-foreground-tertiary">Aucune leçon pour l’instant.</p>}
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-border-light bg-surface p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-base font-bold text-foreground">Exercices</h2>
          <Link
            href={`/dashboard/courses/${courseId}/exercises/new`}
            className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-foreground-secondary transition hover:border-primary hover:text-primary"
          >
            <Plus size={13} strokeWidth={2} />
            Nouvel exercice
          </Link>
        </div>
        <div className="flex flex-col gap-1">
          {exercises.map((exercise) => (
            <Link
              key={exercise.id}
              href={`/dashboard/courses/${courseId}/exercises/${exercise.id}/edit`}
              className="flex items-center justify-between rounded-lg px-2.5 py-2 text-sm transition hover:bg-surface-warm"
            >
              <span className="text-foreground">
                {exercise.position}. {exercise.title.fr}
              </span>
              <StatusBadge status={exercise.status} />
            </Link>
          ))}
          {exercises.length === 0 && <p className="px-2.5 py-2 text-sm text-foreground-tertiary">Aucun exercice pour l’instant.</p>}
        </div>
      </div>

      <CourseForm course={course} action={boundUpdate} submitLabel="Enregistrer" />
    </div>
  );
}
