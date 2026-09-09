import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { listCourses } from "@/lib/api/courses";
import { SessionExpiredError } from "@/lib/api/errors";
import { StatusBadge } from "@/components/StatusBadge";
import { ACADEMIC_LEVEL_LABEL, COLLEGE_YEAR_LABEL, SUBJECT_LABEL } from "@/lib/labels";

export const metadata: Metadata = { title: "Cours" };

export default async function CoursesPage() {
  let courses;
  try {
    courses = await listCourses();
  } catch (e) {
    if (e instanceof SessionExpiredError) redirect("/login");
    throw e;
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Cours</h1>
          <p className="text-sm text-foreground-secondary">{courses.length} cours au total, tous statuts confondus.</p>
        </div>
        <Link
          href="/dashboard/courses/new"
          className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary transition hover:bg-primary-pressed"
        >
          <Plus size={16} strokeWidth={2} />
          Nouveau cours
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border-light bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border-light bg-surface-warm text-xs uppercase tracking-wide text-foreground-tertiary">
            <tr>
              <th className="px-5 py-3 font-medium">Titre</th>
              <th className="px-5 py-3 font-medium">Niveau</th>
              <th className="px-5 py-3 font-medium">Matière</th>
              <th className="px-5 py-3 font-medium">Leçons</th>
              <th className="px-5 py-3 font-medium">Statut</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="border-b border-border-light last:border-0 hover:bg-surface-warm">
                <td className="px-5 py-3">
                  <Link href={`/dashboard/courses/${course.id}`} className="font-medium text-foreground hover:text-primary">
                    {course.title.fr}
                  </Link>
                </td>
                <td className="px-5 py-3 text-foreground-secondary">
                  {ACADEMIC_LEVEL_LABEL[course.academicLevel]}
                  {course.collegeYear ? ` · ${COLLEGE_YEAR_LABEL[course.collegeYear]}` : ""}
                </td>
                <td className="px-5 py-3 text-foreground-secondary">{SUBJECT_LABEL[course.subject]}</td>
                <td className="px-5 py-3 text-foreground-secondary">{course.lessonIds.length}</td>
                <td className="px-5 py-3">
                  <StatusBadge status={course.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {courses.length === 0 && (
          <div className="px-5 py-10 text-center text-sm text-foreground-tertiary">Aucun cours pour l’instant.</div>
        )}
      </div>
    </div>
  );
}
