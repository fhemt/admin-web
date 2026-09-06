import type { Metadata } from "next";
import { MockExamForm } from "../MockExamForm";
import { createMockExamAction } from "../actions";

export const metadata: Metadata = { title: "Nouvel examen blanc" };

export default function NewMockExamPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Nouvel examen blanc</h1>
        <p className="text-sm text-foreground-secondary">L’examen démarre en brouillon — il ne sera visible des élèves qu’une fois publié.</p>
      </div>
      <MockExamForm action={createMockExamAction} submitLabel="Créer l'examen" />
    </div>
  );
}
