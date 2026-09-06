import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getMockExam } from "@/lib/api/mockExams";
import { ApiError, SessionExpiredError } from "@/lib/api/errors";
import { PublishControls } from "@/components/PublishControls";
import { MockExamForm } from "../../MockExamForm";
import { deleteMockExamAction, setMockExamStatusAction, updateMockExamAction } from "../../actions";

export const metadata: Metadata = { title: "Modifier l'examen blanc" };

export default async function EditMockExamPage({ params }: PageProps<"/dashboard/mock-exams/[examId]/edit">) {
  const { examId } = await params;

  let exam;
  try {
    exam = await getMockExam(examId);
  } catch (e) {
    if (e instanceof SessionExpiredError) redirect("/login");
    if (e instanceof ApiError && e.code === "MOCKEXAM_001") notFound();
    throw e;
  }

  const boundUpdate = updateMockExamAction.bind(null, examId);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">{exam.title.fr}</h1>
      </div>

      <div className="mb-6 rounded-2xl border border-border-light bg-surface p-4">
        <PublishControls
          status={exam.status}
          onStatusChange={setMockExamStatusAction.bind(null, examId)}
          onDelete={deleteMockExamAction.bind(null, examId)}
          deleteConfirmMessage="Supprimer définitivement cet examen ?"
        />
      </div>

      <MockExamForm exam={exam} action={boundUpdate} submitLabel="Enregistrer" />
    </div>
  );
}
