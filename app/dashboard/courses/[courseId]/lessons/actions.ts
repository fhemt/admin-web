"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import * as lessonsApi from "@/lib/api/lessons";
import { ApiContentBlock, ApiContentStatus, ApiLocalized, ApiQuiz, LessonUpsertInput } from "@/lib/api/types";
import { SessionExpiredError } from "@/lib/api/errors";

export type ActionState = { error?: string } | undefined;

function parseLessonForm(formData: FormData): LessonUpsertInput {
  return {
    position: Number(formData.get("position") ?? 1),
    title: JSON.parse(String(formData.get("titleJson") ?? "{}")) as ApiLocalized,
    objective: JSON.parse(String(formData.get("objectiveJson") ?? "{}")) as ApiLocalized,
    estimatedMinutes: Number(formData.get("estimatedMinutes") ?? 0),
    xpReward: Number(formData.get("xpReward") ?? 0),
    content: JSON.parse(String(formData.get("contentJson") ?? "[]")) as ApiContentBlock[],
    quiz: JSON.parse(String(formData.get("quizJson") ?? "{}")) as ApiQuiz,
  };
}

export async function createLessonAction(courseId: string, _prevState: ActionState, formData: FormData): Promise<ActionState> {
  let lessonId: string;
  try {
    const lesson = await lessonsApi.createLesson(courseId, parseLessonForm(formData));
    lessonId = lesson.id;
  } catch (e) {
    if (e instanceof SessionExpiredError) redirect("/login");
    return { error: "Impossible de créer la leçon. Vérifie les champs." };
  }
  revalidatePath(`/dashboard/courses/${courseId}/edit`);
  redirect(`/dashboard/courses/${courseId}/lessons/${lessonId}/edit`);
}

export async function updateLessonAction(
  courseId: string,
  lessonId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    await lessonsApi.updateLesson(courseId, lessonId, parseLessonForm(formData));
  } catch (e) {
    if (e instanceof SessionExpiredError) redirect("/login");
    return { error: "Impossible d'enregistrer. Vérifie les champs." };
  }
  revalidatePath(`/dashboard/courses/${courseId}/edit`);
  revalidatePath(`/dashboard/courses/${courseId}/lessons/${lessonId}/edit`);
  return { error: undefined };
}

export async function setLessonStatusAction(courseId: string, lessonId: string, status: ApiContentStatus) {
  try {
    await lessonsApi.setLessonStatus(courseId, lessonId, status);
  } catch (e) {
    if (e instanceof SessionExpiredError) redirect("/login");
    throw e;
  }
  revalidatePath(`/dashboard/courses/${courseId}/edit`);
  revalidatePath(`/dashboard/courses/${courseId}/lessons/${lessonId}/edit`);
}

export async function deleteLessonAction(courseId: string, lessonId: string) {
  try {
    await lessonsApi.deleteLesson(courseId, lessonId);
  } catch (e) {
    if (e instanceof SessionExpiredError) redirect("/login");
    throw e;
  }
  revalidatePath(`/dashboard/courses/${courseId}/edit`);
  redirect(`/dashboard/courses/${courseId}/edit`);
}
