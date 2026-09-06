import "server-only";
import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from "@/lib/api/client";
import { ApiContentStatus, ApiExercise, ExerciseUpsertInput } from "@/lib/api/types";

export function listExercises(courseId: string) {
  return apiGet<ApiExercise[]>(`/api/v1/admin/courses/${courseId}/exercises`);
}

export function getExercise(courseId: string, exerciseId: string) {
  return apiGet<ApiExercise>(`/api/v1/admin/courses/${courseId}/exercises/${exerciseId}`);
}

export function createExercise(courseId: string, input: ExerciseUpsertInput) {
  return apiPost<ApiExercise>(`/api/v1/admin/courses/${courseId}/exercises`, input);
}

export function updateExercise(courseId: string, exerciseId: string, input: ExerciseUpsertInput) {
  return apiPut<ApiExercise>(`/api/v1/admin/courses/${courseId}/exercises/${exerciseId}`, input);
}

export function setExerciseStatus(courseId: string, exerciseId: string, status: ApiContentStatus) {
  return apiPatch<ApiExercise>(`/api/v1/admin/courses/${courseId}/exercises/${exerciseId}/status`, { status });
}

export function deleteExercise(courseId: string, exerciseId: string) {
  return apiDelete<void>(`/api/v1/admin/courses/${courseId}/exercises/${exerciseId}`);
}
