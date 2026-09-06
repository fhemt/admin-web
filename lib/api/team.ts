import "server-only";
import { apiDelete, apiGet, apiPost } from "@/lib/api/client";
import { ApiRole, ApiTeamInvite, ApiTeamMember } from "@/lib/api/types";

export function listTeamMembers() {
  return apiGet<ApiTeamMember[]>("/api/v1/admin/team/members");
}

export function listPendingInvites() {
  return apiGet<ApiTeamInvite[]>("/api/v1/admin/team/invites");
}

export function inviteTeamMember(input: { email: string; firstName: string; lastName: string; role: ApiRole }) {
  return apiPost<ApiTeamInvite>("/api/v1/admin/team/invites", input);
}

export function revokeInvite(token: string) {
  return apiDelete<void>(`/api/v1/admin/team/invites/${token}`);
}

export function lookupInvite(token: string) {
  return apiGet<ApiTeamInvite>(`/api/v1/admin/team/invites/lookup?token=${encodeURIComponent(token)}`, { auth: false });
}

export function acceptInvite(token: string, password: string) {
  return apiPost<void>("/api/v1/admin/team/accept-invite", { token, password }, { auth: false });
}
