import "server-only";
import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from "@/lib/api/client";
import { ApiContentStatus, ApiMockExam, MockExamUpsertInput } from "@/lib/api/types";

export function listMockExams(status?: ApiContentStatus) {
  const query = status ? `?status=${status}` : "";
  return apiGet<ApiMockExam[]>(`/api/v1/admin/mock-exams${query}`);
}

export function getMockExam(examId: string) {
  return apiGet<ApiMockExam>(`/api/v1/admin/mock-exams/${examId}`);
}

export function createMockExam(input: MockExamUpsertInput) {
  return apiPost<ApiMockExam>("/api/v1/admin/mock-exams", input);
}

export function updateMockExam(examId: string, input: MockExamUpsertInput) {
  return apiPut<ApiMockExam>(`/api/v1/admin/mock-exams/${examId}`, input);
}

export function setMockExamStatus(examId: string, status: ApiContentStatus) {
  return apiPatch<ApiMockExam>(`/api/v1/admin/mock-exams/${examId}/status`, { status });
}

export function deleteMockExam(examId: string) {
  return apiDelete<void>(`/api/v1/admin/mock-exams/${examId}`);
}
