"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import * as coursesApi from "@/lib/api/courses";
import { ApiContentStatus, CourseUpsertInput } from "@/lib/api/types";
import { SessionExpiredError } from "@/lib/api/errors";

export type ActionState = { error?: string } | undefined;

function zipGoals(frText: string, darijaText: string) {
  const fr = frText.split("\n").map((s) => s.trim()).filter(Boolean);
  const darija = darijaText.split("\n").map((s) => s.trim()).filter(Boolean);
  const count = Math.max(fr.length, darija.length);
  return Array.from({ length: count }, (_, i) => ({ fr: fr[i] ?? "", darija: darija[i] ?? "" }));
}

function parseCourseForm(formData: FormData): CourseUpsertInput {
  const collegeYear = String(formData.get("collegeYear") ?? "");
  return {
    academicLevel: formData.get("academicLevel") as CourseUpsertInput["academicLevel"],
    collegeYear: collegeYear ? (collegeYear as CourseUpsertInput["collegeYear"]) : null,
    subject: formData.get("subject") as CourseUpsertInput["subject"],
    position: Number(formData.get("position") ?? 1),
    title: { fr: String(formData.get("titleFr") ?? ""), darija: String(formData.get("titleDarija") ?? "") },
    shortDescription: {
      fr: String(formData.get("shortDescriptionFr") ?? ""),
      darija: String(formData.get("shortDescriptionDarija") ?? ""),
    },
    prerequisites: {
      fr: String(formData.get("prerequisitesFr") ?? ""),
      darija: String(formData.get("prerequisitesDarija") ?? ""),
    },
    goals: zipGoals(String(formData.get("goalsFr") ?? ""), String(formData.get("goalsDarija") ?? "")),
    estimatedMinutes: Number(formData.get("estimatedMinutes") ?? 0),
    xpReward: Number(formData.get("xpReward") ?? 0),
    icon: formData.get("icon") as CourseUpsertInput["icon"],
  };
}

export async function createCourseAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  let courseId: string;
  try {
    const course = await coursesApi.createCourse(parseCourseForm(formData));
    courseId = course.id;
  } catch (e) {
    if (e instanceof SessionExpiredError) redirect("/login");
    return { error: "Impossible de créer le cours. Vérifie les champs." };
  }
  // redirect() throws internally to signal navigation — it must never sit
  // inside the try/catch above, or this function's own catch swallows it
  // and silently returns an error state instead of navigating.
  revalidatePath("/dashboard/courses");
  redirect(`/dashboard/courses/${courseId}/edit`);
}

export async function updateCourseAction(courseId: string, _prevState: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await coursesApi.updateCourse(courseId, parseCourseForm(formData));
    revalidatePath("/dashboard/courses");
    revalidatePath(`/dashboard/courses/${courseId}/edit`);
  } catch (e) {
    if (e instanceof SessionExpiredError) redirect("/login");
    return { error: "Impossible d'enregistrer. Vérifie les champs." };
  }
  return { error: undefined };
}

export async function setCourseStatusAction(courseId: string, status: ApiContentStatus) {
  try {
    await coursesApi.setCourseStatus(courseId, status);
  } catch (e) {
    if (e instanceof SessionExpiredError) redirect("/login");
    throw e;
  }
  revalidatePath("/dashboard/courses");
  revalidatePath(`/dashboard/courses/${courseId}/edit`);
}

export async function deleteCourseAction(courseId: string) {
  try {
    await coursesApi.deleteCourse(courseId);
  } catch (e) {
    if (e instanceof SessionExpiredError) redirect("/login");
    throw e;
  }
  revalidatePath("/dashboard/courses");
  redirect("/dashboard/courses");
}
