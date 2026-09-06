import type { Metadata } from "next";
import { CourseForm } from "../CourseForm";
import { createCourseAction } from "../actions";

export const metadata: Metadata = { title: "Nouveau cours" };

export default function NewCoursePage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-1 font-display text-2xl font-bold text-foreground">Nouveau cours</h1>
      <p className="mb-6 text-sm text-foreground-secondary">
        Le cours démarre en brouillon — il ne sera visible des élèves qu’une fois publié.
      </p>
      <CourseForm action={createCourseAction} submitLabel="Créer le cours" />
    </div>
  );
}
