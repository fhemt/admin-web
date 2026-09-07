"use client";

import { useMemo, useState, useTransition } from "react";
import { Ban, Loader2, Search, ShieldCheck, Sparkle, StarOff } from "lucide-react";
import { ApiStudent } from "@/lib/api/types";
import { setPremiumAction, setSuspendedAction } from "./actions";

const LEVEL_LABEL: Record<string, string> = { COLLEGE: "Collège", LYCEE: "Lycée" };

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

function StudentRow({ student }: { student: ApiStudent }) {
  const [pending, startTransition] = useTransition();

  return (
    <tr className="border-b border-border-light last:border-0">
      <td className="px-5 py-3">
        <div className="font-medium text-foreground">
          {student.firstName} {student.lastName}
        </div>
        <div className="text-xs text-foreground-tertiary">{student.email}</div>
      </td>
      <td className="px-5 py-3">
        <span className="rounded-lg bg-surface-warm px-2 py-1 font-mono text-xs font-medium text-foreground-secondary">
          {student.referenceCode}
        </span>
      </td>
      <td className="px-5 py-3 text-foreground-secondary">
        {LEVEL_LABEL[student.academicLevel]}
        {student.collegeYear ? ` · ${student.collegeYear.replace("AC_", "")}e` : ""}
      </td>
      <td className="px-5 py-3">
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            student.premium ? "bg-success-light text-success" : "bg-surface-warm text-foreground-tertiary"
          }`}
        >
          {student.premium ? "Premium" : "Gratuit"}
        </span>
      </td>
      <td className="px-5 py-3">
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            student.suspended ? "bg-danger-light text-danger" : "bg-success-light text-success"
          }`}
        >
          {student.suspended ? "Suspendu" : "Actif"}
        </span>
      </td>
      <td className="px-5 py-3 text-xs text-foreground-tertiary">{formatDate(student.createdAt)}</td>
      <td className="px-5 py-3">
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                await setPremiumAction(student.userId, !student.premium);
              })
            }
            title={student.premium ? "Retirer premium" : "Offrir premium"}
            className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs font-semibold text-foreground-secondary transition hover:bg-surface-secondary disabled:opacity-50"
          >
            {student.premium ? <StarOff size={14} strokeWidth={1.75} /> : <Sparkle size={14} strokeWidth={1.75} />}
            {student.premium ? "Retirer premium" : "Offrir premium"}
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              if (!student.suspended && !confirm(`Suspendre le compte de ${student.firstName} ${student.lastName} ?`)) return;
              startTransition(async () => {
                await setSuspendedAction(student.userId, !student.suspended);
              });
            }}
            title={student.suspended ? "Réactiver" : "Suspendre"}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition disabled:opacity-50 ${
              student.suspended
                ? "border-border text-foreground-secondary hover:bg-surface-secondary"
                : "border-danger/20 text-danger hover:bg-danger-light"
            }`}
          >
            {pending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : student.suspended ? (
              <ShieldCheck size={14} strokeWidth={1.75} />
            ) : (
              <Ban size={14} strokeWidth={1.75} />
            )}
            {student.suspended ? "Réactiver" : "Suspendre"}
          </button>
        </div>
      </td>
    </tr>
  );
}

export function StudentsTable({ students }: { students: ApiStudent[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter(
      (s) =>
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.referenceCode.toLowerCase().includes(q)
    );
  }, [students, query]);

  return (
    <div>
      <div className="relative mb-4 max-w-sm">
        <Search size={16} strokeWidth={1.75} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-tertiary" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un élève, un email, un code..."
          className="w-full rounded-xl border border-border bg-surface py-2.5 pl-10 pr-3.5 text-sm text-foreground placeholder:text-foreground-tertiary focus:border-primary focus:outline-none"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border-light bg-surface px-5 py-10 text-center text-sm text-foreground-tertiary">
          Aucun élève trouvé.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border-light bg-surface">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border-light bg-surface-warm text-xs font-medium uppercase tracking-wide text-foreground-tertiary">
                <th className="px-5 py-3 font-medium">Élève</th>
                <th className="px-5 py-3 font-medium">Code référence</th>
                <th className="px-5 py-3 font-medium">Niveau</th>
                <th className="px-5 py-3 font-medium">Premium</th>
                <th className="px-5 py-3 font-medium">Statut</th>
                <th className="px-5 py-3 font-medium">Inscrit le</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((student) => (
                <StudentRow key={student.userId} student={student} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
