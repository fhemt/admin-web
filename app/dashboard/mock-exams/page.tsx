import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { listMockExams } from "@/lib/api/mockExams";
import { SessionExpiredError } from "@/lib/api/errors";
import { StatusBadge } from "@/components/StatusBadge";
import { DIFFICULTY_LABEL } from "@/lib/labels";

export const metadata: Metadata = { title: "Examens blancs" };

export default async function MockExamsPage() {
  let exams;
  try {
    exams = await listMockExams();
  } catch (e) {
    if (e instanceof SessionExpiredError) redirect("/login");
    throw e;
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Examens blancs</h1>
          <p className="text-sm text-foreground-secondary">{exams.length} examen(s) au total, tous statuts confondus.</p>
        </div>
        <Link
          href="/dashboard/mock-exams/new"
          className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary transition hover:bg-primary-pressed"
        >
          <Plus size={16} strokeWidth={2} />
          Nouvel examen
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border-light bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border-light bg-surface-warm text-xs uppercase tracking-wide text-foreground-tertiary">
            <tr>
              <th className="px-5 py-3 font-medium">Titre</th>
              <th className="px-5 py-3 font-medium">Difficulté</th>
              <th className="px-5 py-3 font-medium">Durée</th>
              <th className="px-5 py-3 font-medium">Parties</th>
              <th className="px-5 py-3 font-medium">Statut</th>
            </tr>
          </thead>
          <tbody>
            {exams.map((exam) => (
              <tr key={exam.id} className="border-b border-border-light last:border-0 hover:bg-surface-warm">
                <td className="px-5 py-3">
                  <Link href={`/dashboard/mock-exams/${exam.id}/edit`} className="font-medium text-foreground hover:text-primary">
                    {exam.title.fr}
                  </Link>
                </td>
                <td className="px-5 py-3 text-foreground-secondary">{DIFFICULTY_LABEL[exam.difficulty]}</td>
                <td className="px-5 py-3 text-foreground-secondary">{exam.durationMinutes} min</td>
                <td className="px-5 py-3 text-foreground-secondary">{exam.parts.length}</td>
                <td className="px-5 py-3">
                  <StatusBadge status={exam.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {exams.length === 0 && (
          <div className="px-5 py-10 text-center text-sm text-foreground-tertiary">Aucun examen blanc pour l’instant.</div>
        )}
      </div>
    </div>
  );
}
