export const inputClass =
  "w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-[14px] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-light";

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground-secondary">{label}</label>
      {children}
    </div>
  );
}
