import type { Metadata } from "next";
import { ExerciseForm } from "../ExerciseForm";
import { createExerciseAction } from "../actions";

export const metadata: Metadata = { title: "Nouvel exercice" };

export default async function NewExercisePage({ params }: PageProps<"/dashboard/courses/[courseId]/exercises/new">) {
  const { courseId } = await params;
  const boundCreate = createExerciseAction.bind(null, courseId);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Nouvel exercice</h1>
        <p className="text-sm text-foreground-secondary">L’exercice démarre en brouillon — il ne sera visible des élèves qu’une fois publié.</p>
      </div>
      <ExerciseForm action={boundCreate} submitLabel="Créer l'exercice" />
    </div>
  );
}
