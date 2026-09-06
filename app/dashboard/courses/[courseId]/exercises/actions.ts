"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import * as exercisesApi from "@/lib/api/exercises";
import { ApiContentStatus, ApiCorrection, ApiLocalized, ExerciseUpsertInput } from "@/lib/api/types";
import { SessionExpiredError } from "@/lib/api/errors";

export type ActionState = { error?: string } | undefined;

function parseExerciseForm(formData: FormData): ExerciseUpsertInput {
  return {
    position: Number(formData.get("position") ?? 1),
    title: JSON.parse(String(formData.get("titleJson") ?? "{}")) as ApiLocalized,
    difficulty: formData.get("difficulty") as ExerciseUpsertInput["difficulty"],
    estimatedMinutes: Number(formData.get("estimatedMinutes") ?? 0),
    premium: formData.get("premium") === "on",
    statement: JSON.parse(String(formData.get("statementJson") ?? "{}")) as ApiLocalized,
    hints: JSON.parse(String(formData.get("hintsJson") ?? "[]")) as ApiLocalized[],
    correction: JSON.parse(String(formData.get("correctionJson") ?? "{}")) as ApiCorrection,
  };
}

export async function createExerciseAction(courseId: string, _prevState: ActionState, formData: FormData): Promise<ActionState> {
  let exerciseId: string;
  try {
    const exercise = await exercisesApi.createExercise(courseId, parseExerciseForm(formData));
    exerciseId = exercise.id;
  } catch (e) {
    if (e instanceof SessionExpiredError) redirect("/login");
    return { error: "Impossible de créer l'exercice. Vérifie les champs." };
  }
  revalidatePath(`/dashboard/courses/${courseId}/edit`);
  redirect(`/dashboard/courses/${courseId}/exercises/${exerciseId}/edit`);
}

export async function updateExerciseAction(
  courseId: string,
  exerciseId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    await exercisesApi.updateExercise(courseId, exerciseId, parseExerciseForm(formData));
  } catch (e) {
    if (e instanceof SessionExpiredError) redirect("/login");
    return { error: "Impossible d'enregistrer. Vérifie les champs." };
  }
  revalidatePath(`/dashboard/courses/${courseId}/edit`);
  revalidatePath(`/dashboard/courses/${courseId}/exercises/${exerciseId}/edit`);
  return { error: undefined };
}

export async function setExerciseStatusAction(courseId: string, exerciseId: string, status: ApiContentStatus) {
  try {
    await exercisesApi.setExerciseStatus(courseId, exerciseId, status);
  } catch (e) {
    if (e instanceof SessionExpiredError) redirect("/login");
    throw e;
  }
  revalidatePath(`/dashboard/courses/${courseId}/edit`);
  revalidatePath(`/dashboard/courses/${courseId}/exercises/${exerciseId}/edit`);
}

export async function deleteExerciseAction(courseId: string, exerciseId: string) {
  try {
    await exercisesApi.deleteExercise(courseId, exerciseId);
  } catch (e) {
    if (e instanceof SessionExpiredError) redirect("/login");
    throw e;
  }
  revalidatePath(`/dashboard/courses/${courseId}/edit`);
  redirect(`/dashboard/courses/${courseId}/edit`);
}
