"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import * as mockExamsApi from "@/lib/api/mockExams";
import { ApiContentStatus, ApiLocalized, ApiMockExamPart, MockExamUpsertInput } from "@/lib/api/types";
import { SessionExpiredError } from "@/lib/api/errors";

export type ActionState = { error?: string } | undefined;

function parseMockExamForm(formData: FormData): MockExamUpsertInput {
  return {
    position: Number(formData.get("position") ?? 1),
    title: JSON.parse(String(formData.get("titleJson") ?? "{}")) as ApiLocalized,
    durationMinutes: Number(formData.get("durationMinutes") ?? 0),
    difficulty: formData.get("difficulty") as MockExamUpsertInput["difficulty"],
    premium: formData.get("premium") === "on",
    parts: JSON.parse(String(formData.get("partsJson") ?? "[]")) as ApiMockExamPart[],
  };
}

export async function createMockExamAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  let examId: string;
  try {
    const exam = await mockExamsApi.createMockExam(parseMockExamForm(formData));
    examId = exam.id;
  } catch (e) {
    if (e instanceof SessionExpiredError) redirect("/login");
    return { error: "Impossible de créer l'examen. Vérifie les champs." };
  }
  revalidatePath("/dashboard/mock-exams");
  redirect(`/dashboard/mock-exams/${examId}/edit`);
}

export async function updateMockExamAction(examId: string, _prevState: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await mockExamsApi.updateMockExam(examId, parseMockExamForm(formData));
  } catch (e) {
    if (e instanceof SessionExpiredError) redirect("/login");
    return { error: "Impossible d'enregistrer. Vérifie les champs." };
  }
  revalidatePath("/dashboard/mock-exams");
  revalidatePath(`/dashboard/mock-exams/${examId}/edit`);
  return { error: undefined };
}

export async function setMockExamStatusAction(examId: string, status: ApiContentStatus) {
  try {
    await mockExamsApi.setMockExamStatus(examId, status);
  } catch (e) {
    if (e instanceof SessionExpiredError) redirect("/login");
    throw e;
  }
  revalidatePath("/dashboard/mock-exams");
  revalidatePath(`/dashboard/mock-exams/${examId}/edit`);
}

export async function deleteMockExamAction(examId: string) {
  try {
    await mockExamsApi.deleteMockExam(examId);
  } catch (e) {
    if (e instanceof SessionExpiredError) redirect("/login");
    throw e;
  }
  revalidatePath("/dashboard/mock-exams");
  redirect("/dashboard/mock-exams");
}
