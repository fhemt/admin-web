import type { Metadata } from "next";
import { LessonForm } from "../LessonForm";
import { createLessonAction } from "../actions";

export const metadata: Metadata = { title: "Nouvelle leçon" };

export default async function NewLessonPage({ params }: PageProps<"/dashboard/courses/[courseId]/lessons/new">) {
  const { courseId } = await params;
  const boundCreate = createLessonAction.bind(null, courseId);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Nouvelle leçon</h1>
        <p className="text-sm text-foreground-secondary">La leçon démarre en brouillon — elle ne sera visible des élèves qu’une fois publiée.</p>
      </div>
      <LessonForm action={boundCreate} submitLabel="Créer la leçon" />
    </div>
  );
}
