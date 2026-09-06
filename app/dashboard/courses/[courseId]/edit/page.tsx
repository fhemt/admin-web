import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getCourse } from "@/lib/api/courses";
import { ApiError, SessionExpiredError } from "@/lib/api/errors";
import { CourseForm } from "../../CourseForm";
import { StatusControls } from "../../StatusControls";
import { updateCourseAction } from "../../actions";

export const metadata: Metadata = { title: "Modifier le cours" };

export default async function EditCoursePage({ params }: PageProps<"/dashboard/courses/[courseId]/edit">) {
  const { courseId } = await params;

  let course;
  try {
    course = await getCourse(courseId);
  } catch (e) {
    if (e instanceof SessionExpiredError) redirect("/login");
    if (e instanceof ApiError && e.code === "COURSE_001") notFound();
    throw e;
  }

  const boundUpdate = updateCourseAction.bind(null, courseId);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">{course.title.fr}</h1>
          <p className="text-sm text-foreground-secondary">{course.lessonIds.length} leçon(s)</p>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-border-light bg-surface p-4">
        <StatusControls courseId={course.id} status={course.status} />
      </div>

      <CourseForm course={course} action={boundUpdate} submitLabel="Enregistrer" />
    </div>
  );
}
