import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getMe } from "@/lib/api/profile";
import { listStudents } from "@/lib/api/students";
import { SessionExpiredError } from "@/lib/api/errors";
import { StudentsTable } from "./StudentsTable";

export const metadata: Metadata = { title: "Élèves" };

export default async function StudentsPage() {
  let me, students;
  try {
    me = await getMe();
    if (me.role !== "ADMIN") redirect("/dashboard/courses");
    students = await listStudents();
  } catch (e) {
    if (e instanceof SessionExpiredError) redirect("/login");
    throw e;
  }

  const premiumCount = students.filter((s) => s.premium).length;
  const suspendedCount = students.filter((s) => s.suspended).length;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Élèves</h1>
        <p className="text-sm text-foreground-secondary">
          {students.length} élève{students.length !== 1 ? "s" : ""} · {premiumCount} premium · {suspendedCount} suspendu
          {suspendedCount !== 1 ? "s" : ""}
        </p>
      </div>

      <StudentsTable students={students} />
    </div>
  );
}
