import "server-only";
import { apiGet } from "@/lib/api/client";
import { ApiAnalyticsOverview } from "@/lib/api/types";

export function getAnalyticsOverview() {
  return apiGet<ApiAnalyticsOverview>("/api/v1/admin/analytics/overview");
}
