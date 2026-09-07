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

// Deliberately not toLocaleDateString("fr-FR", ...) — its output depends on
// the ICU data available in whatever Node build renders this server-side,
// which silently differs from the browser's and causes a hydration
// mismatch (caught live: server rendered a different day than the client
// re-check expected). A fixed lookup is deterministic everywhere. Reads
// with the UTC accessors since these are plain LocalDate strings ("2026-08-09")
// with no time/zone component — JS parses those as UTC midnight, so local
// accessors could also shift the day depending on the machine's timezone.
const MONTH_ABBR_FR = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];

function formatDayLabel(iso: string) {
  const d = new Date(iso);
  return `${d.getUTCDate()} ${MONTH_ABBR_FR[d.getUTCMonth()]}`;
}

// SVG coordinates from repeating-decimal division (e.g. 700/30) can print
// with a different number of trailing digits depending on the JS engine's
// float-to-string conversion — rounding first keeps the server- and
// client-rendered attribute strings byte-identical.
function round2(n: number) {
  return Math.round(n * 100) / 100;
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
        const barHeight = round2(Math.max(2, (p.amount / max) * (height - 20)));
        const x = round2(i * (barWidth + barGap));
        const y = round2(height - barHeight);
        return (
          <rect key={p.date} x={x} y={y} width={round2(barWidth)} height={barHeight} rx={2} className="fill-primary">
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
        const barHeight = round2(Math.max(2, (p.count / max) * (height - 10)));
        const x = round2(i * (barWidth + barGap));
        const y = round2(height - barHeight);
        return (
          <rect key={p.date} x={x} y={y} width={round2(barWidth)} height={barHeight} rx={2} className="fill-success">
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
