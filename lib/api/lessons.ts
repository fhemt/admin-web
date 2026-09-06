import "server-only";
import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from "@/lib/api/client";
import { ApiContentStatus, ApiLesson, LessonUpsertInput } from "@/lib/api/types";

export function listLessons(courseId: string) {
  return apiGet<ApiLesson[]>(`/api/v1/admin/courses/${courseId}/lessons`);
}

export function getLesson(courseId: string, lessonId: string) {
  return apiGet<ApiLesson>(`/api/v1/admin/courses/${courseId}/lessons/${lessonId}`);
}

export function createLesson(courseId: string, input: LessonUpsertInput) {
  return apiPost<ApiLesson>(`/api/v1/admin/courses/${courseId}/lessons`, input);
}

export function updateLesson(courseId: string, lessonId: string, input: LessonUpsertInput) {
  return apiPut<ApiLesson>(`/api/v1/admin/courses/${courseId}/lessons/${lessonId}`, input);
}

export function setLessonStatus(courseId: string, lessonId: string, status: ApiContentStatus) {
  return apiPatch<ApiLesson>(`/api/v1/admin/courses/${courseId}/lessons/${lessonId}/status`, { status });
}

export function deleteLesson(courseId: string, lessonId: string) {
  return apiDelete<void>(`/api/v1/admin/courses/${courseId}/lessons/${lessonId}`);
}
