import { ApiCountByLabel, ApiDailyRevenuePoint, ApiDailySignupPoint } from "@/lib/api/types";

export function StatCard({ label, value, sublabel }: { label: string; value: string; sublabel?: string }) {
  return (
    <div className="rounded-2xl border border-border-light bg-surface p-4">
      <div className="text-xs text-foreground-tertiary">{label}</div>
      <div className="font-display text-xl font-bold text-foreground">{value}</div>
      {sublabel && <div className="mt-0.5 text-xs text-foreground-tertiary">{sublabel}</div>}
    </div>
  );
}

export function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-3">
      <h2 className="font-display text-lg font-bold text-foreground">{title}</h2>
      {subtitle && <p className="text-xs text-foreground-tertiary">{subtitle}</p>}
    </div>
  );
}

function formatDayLabel(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

/** A plain SVG bar chart, server-rendered (no interactivity beyond native
 * <title> hover tooltips) — deliberately not a charting library, this app
 * has almost no dependencies and 30 daily bars doesn't need one. */
export function RevenueTrendChart({ points }: { points: ApiDailyRevenuePoint[] }) {
  const max = Math.max(1, ...points.map((p) => p.amount));
  const width = 700;
  const height = 140;
  const barGap = 3;
  const barWidth = (width - barGap * (points.length - 1)) / points.length;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-[140px] w-full" preserveAspectRatio="none">
      {points.map((p, i) => {
        const barHeight = Math.max(2, (p.amount / max) * (height - 20));
        const x = i * (barWidth + barGap);
        const y = height - barHeight;
        return (
          <rect key={p.date} x={x} y={y} width={barWidth} height={barHeight} rx={2} className="fill-primary">
            <title>
              {formatDayLabel(p.date)} — {p.amount} MAD ({p.count} vente{p.count !== 1 ? "s" : ""})
            </title>
          </rect>
        );
      })}
    </svg>
  );
}

export function SignupsTrendChart({ points }: { points: ApiDailySignupPoint[] }) {
  const max = Math.max(1, ...points.map((p) => p.count));
  const width = 700;
  const height = 100;
  const barGap = 3;
  const barWidth = (width - barGap * (points.length - 1)) / points.length;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-[100px] w-full" preserveAspectRatio="none">
      {points.map((p, i) => {
        const barHeight = Math.max(2, (p.count / max) * (height - 10));
        const x = i * (barWidth + barGap);
        const y = height - barHeight;
        return (
          <rect key={p.date} x={x} y={y} width={barWidth} height={barHeight} rx={2} className="fill-success">
            <title>
              {formatDayLabel(p.date)} — {p.count} inscription{p.count !== 1 ? "s" : ""}
            </title>
          </rect>
        );
      })}
    </svg>
  );
}

export function BarList({ items, formatValue }: { items: { label: string; value: number }[]; formatValue?: (v: number) => string }) {
  const max = Math.max(1, ...items.map((i) => i.value));
  if (items.length === 0) {
    return <p className="text-sm text-foreground-tertiary">Aucune donnée.</p>;
  }
  return (
    <div className="flex flex-col gap-2.5">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-3">
          <div className="w-28 shrink-0 truncate text-xs text-foreground-secondary">{item.label}</div>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-warm">
            <div className="h-full rounded-full bg-primary" style={{ width: `${(item.value / max) * 100}%` }} />
          </div>
          <div className="w-16 shrink-0 text-right text-xs font-semibold text-foreground">
            {formatValue ? formatValue(item.value) : item.value}
          </div>
        </div>
      ))}
    </div>
  );
}

const ACADEMIC_LEVEL_LABEL: Record<string, string> = { COLLEGE: "Collège", LYCEE: "Lycée" };

export function toBarListFromCountByLabel(entries: ApiCountByLabel[], labelMap?: Record<string, string>) {
  return entries.map((e) => ({ label: labelMap?.[e.label] ?? e.label, value: e.count }));
}

export { ACADEMIC_LEVEL_LABEL };

export function FunnelBar({ label, value, of, percentOfTotal }: { label: string; value: number; of: number; percentOfTotal: number }) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between text-xs">
        <span className="text-foreground-secondary">{label}</span>
        <span className="font-semibold text-foreground">
          {value} <span className="font-normal text-foreground-tertiary">({percentOfTotal}%)</span>
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-surface-warm">
        <div className="h-full rounded-full bg-primary" style={{ width: `${of === 0 ? 0 : (value / of) * 100}%` }} />
      </div>
    </div>
  );
}
