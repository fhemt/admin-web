import { ApiContentStatus } from "@/lib/api/types";
import { STATUS_LABEL, STATUS_TOKENS } from "./status";

export function StatusBadge({ status }: { status: ApiContentStatus }) {
  const tint = STATUS_TOKENS[status];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tint.bg} ${tint.fg}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}
