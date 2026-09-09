import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getLesson } from "@/lib/api/lessons";
import { ApiError, SessionExpiredError } from "@/lib/api/errors";
import { DeleteButton } from "@/components/DeleteButton";
import { LessonForm } from "../../LessonForm";
import { deleteLessonAction, updateLessonAction } from "../../actions";

export const metadata: Metadata = { title: "Modifier la leçon" };

export default async function EditLessonPage({ params }: PageProps<"/dashboard/courses/[courseId]/lessons/[lessonId]/edit">) {
  const { courseId, lessonId } = await params;

  let lesson;
  try {
    lesson = await getLesson(courseId, lessonId);
  } catch (e) {
    if (e instanceof SessionExpiredError) redirect("/login");
    if (e instanceof ApiError && e.code === "LESSON_001") notFound();
    throw e;
  }

  const boundUpdate = updateLessonAction.bind(null, courseId, lessonId);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">{lesson.title.fr}</h1>
        <p className="text-sm text-foreground-secondary">{lesson.content.length} bloc(s) de contenu · {lesson.quiz.questions.length} question(s) de quiz</p>
      </div>

      <div className="mb-6 rounded-2xl border border-border-light bg-surface p-4">
        <DeleteButton
          onDelete={deleteLessonAction.bind(null, courseId, lessonId)}
          confirmMessage="Supprimer définitivement cette leçon ?"
        />
      </div>

      <LessonForm lesson={lesson} action={boundUpdate} submitLabel="Enregistrer" />
    </div>
  );
}
