import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getExercise } from "@/lib/api/exercises";
import { ApiError, SessionExpiredError } from "@/lib/api/errors";
import { PublishControls } from "@/components/PublishControls";
import { ExerciseForm } from "../../ExerciseForm";
import { deleteExerciseAction, setExerciseStatusAction, updateExerciseAction } from "../../actions";

export const metadata: Metadata = { title: "Modifier l'exercice" };

export default async function EditExercisePage({ params }: PageProps<"/dashboard/courses/[courseId]/exercises/[exerciseId]/edit">) {
  const { courseId, exerciseId } = await params;

  let exercise;
  try {
    exercise = await getExercise(courseId, exerciseId);
  } catch (e) {
    if (e instanceof SessionExpiredError) redirect("/login");
    if (e instanceof ApiError && e.code === "EXERCISE_001") notFound();
    throw e;
  }

  const boundUpdate = updateExerciseAction.bind(null, courseId, exerciseId);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">{exercise.title.fr}</h1>
      </div>

      <div className="mb-6 rounded-2xl border border-border-light bg-surface p-4">
        <PublishControls
          status={exercise.status}
          onStatusChange={setExerciseStatusAction.bind(null, courseId, exerciseId)}
          onDelete={deleteExerciseAction.bind(null, courseId, exerciseId)}
          deleteConfirmMessage="Supprimer définitivement cet exercice ?"
        />
      </div>

      <ExerciseForm exercise={exercise} action={boundUpdate} submitLabel="Enregistrer" />
    </div>
  );
}
