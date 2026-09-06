import "server-only";
import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from "@/lib/api/client";
import { ApiContentStatus, ApiCourse, CourseUpsertInput } from "@/lib/api/types";

export function listCourses(status?: ApiContentStatus) {
  const query = status ? `?status=${status}` : "";
  return apiGet<ApiCourse[]>(`/api/v1/admin/courses${query}`);
}

export function getCourse(courseId: string) {
  return apiGet<ApiCourse>(`/api/v1/admin/courses/${courseId}`);
}

export function createCourse(input: CourseUpsertInput) {
  return apiPost<ApiCourse>("/api/v1/admin/courses", input);
}

export function updateCourse(courseId: string, input: CourseUpsertInput) {
  return apiPut<ApiCourse>(`/api/v1/admin/courses/${courseId}`, input);
}

export function setCourseStatus(courseId: string, status: ApiContentStatus) {
  return apiPatch<ApiCourse>(`/api/v1/admin/courses/${courseId}/status`, { status });
}

export function deleteCourse(courseId: string) {
  return apiDelete<void>(`/api/v1/admin/courses/${courseId}`);
}
