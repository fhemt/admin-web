"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import * as studentsApi from "@/lib/api/students";
import { SessionExpiredError } from "@/lib/api/errors";

export async function setSuspendedAction(userId: string, suspended: boolean) {
  try {
    await studentsApi.setStudentSuspended(userId, suspended);
  } catch (e) {
    if (e instanceof SessionExpiredError) redirect("/login");
    throw e;
  }
  revalidatePath("/dashboard/students");
}

export async function setPremiumAction(userId: string, premium: boolean) {
  try {
    await studentsApi.setStudentPremium(userId, premium);
  } catch (e) {
    if (e instanceof SessionExpiredError) redirect("/login");
    throw e;
  }
  revalidatePath("/dashboard/students");
}
