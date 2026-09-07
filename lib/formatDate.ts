const MONTH_ABBR_FR = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];

/**
 * Deliberately not `new Date(iso).toLocaleDateString("fr-FR", ...)`:
 * - toLocaleDateString's output depends on the ICU data available in
 *   whichever Node build renders it, which can silently differ from the
 *   browser's.
 * - These are backend LocalDateTime/LocalDate strings with no timezone
 *   suffix — `new Date()` parses a bare date ("2026-09-07") as UTC but a
 *   bare date-time ("2026-09-07T18:55:38") as LOCAL time, per the ES spec,
 *   so the same string can resolve to a different calendar day depending
 *   on the runtime's timezone.
 * Either can cause a hydration mismatch on any Client Component that
 * formats a date during render — caught live twice now (the Analytics
 * chart, then the Transactions ledger). A pure Server Component never
 * re-executes client-side so it never surfaces there, but every other
 * Client Component doing this the old way carries the same latent bug,
 * just not yet caught. Slicing the Y-M-D straight out of the string
 * sidesteps both failure modes: no Date parsing, no locale/ICU
 * dependency, byte-identical wherever it runs.
 */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const [year, month, day] = iso.slice(0, 10).split("-");
  return `${parseInt(day, 10)} ${MONTH_ABBR_FR[parseInt(month, 10) - 1]} ${year}`;
}
