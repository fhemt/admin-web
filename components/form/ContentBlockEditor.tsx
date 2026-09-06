"use client";

import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { ApiContentBlock, ApiContentBlockType, ApiLocalized, ApiQuizChoice } from "@/lib/api/types";
import { Field, inputClass } from "./Field";
import { LocalizedInput, LocalizedTextarea } from "./LocalizedField";
import { LocalizedListEditor } from "./LocalizedListEditor";

const EMPTY: ApiLocalized = { fr: "", darija: "" };

const BLOCK_TYPE_LABEL: Record<ApiContentBlockType, string> = {
  explanation: "Explication",
  example: "Exemple",
  question: "Question rapide",
  formula: "Formule",
  image: "Illustration",
  diagram: "Diagramme",
  table: "Tableau",
  tip: "Astuce",
  warning: "Avertissement",
  summary: "Résumé",
};

const ILLUSTRATION_OPTIONS = ["counting", "number-line", "shopping", "parentheses", "distributivity", "division-sharing"];

function newChoice(): ApiQuizChoice {
  return { id: crypto.randomUUID(), label: { ...EMPTY } };
}

function newBlock(type: ApiContentBlockType, position: number): ApiContentBlock {
  const id = crypto.randomUUID();
  switch (type) {
    case "explanation":
      return { id, position, type, title: { ...EMPTY }, body: { ...EMPTY } };
    case "example":
      return { id, position, type, title: { ...EMPTY }, body: { ...EMPTY }, stackedOperation: null };
    case "question": {
      const choices = [newChoice(), newChoice()];
      return { id, position, type, prompt: { ...EMPTY }, choices, correctChoiceId: choices[0].id, explanation: { ...EMPTY } };
    }
    case "formula":
      return { id, position, type, caption: null, expression: "" };
    case "image":
      return { id, position, type, caption: null, illustration: ILLUSTRATION_OPTIONS[0] };
    case "diagram":
      return { id, position, type, caption: null, kind: "", values: [] };
    case "table":
      return { id, position, type, caption: null, headers: [{ ...EMPTY }], rows: [] };
    case "tip":
      return { id, position, type, body: { ...EMPTY } };
    case "warning":
      return { id, position, type, body: { ...EMPTY } };
    case "summary":
      return { id, position, type, bullets: [] };
  }
}

function BlockFields({ block, onChange }: { block: ApiContentBlock; onChange: (block: ApiContentBlock) => void }) {
  switch (block.type) {
    case "explanation":
    case "tip":
    case "warning":
      return (
        <div className="flex flex-col gap-3">
          {"title" in block && (
            <Field label="Titre">
              <LocalizedInput value={block.title} onChange={(title) => onChange({ ...block, title })} />
            </Field>
          )}
          <Field label="Texte">
            <LocalizedTextarea value={block.body} onChange={(body) => onChange({ ...block, body })} rows={3} />
          </Field>
        </div>
      );
    case "example":
      return (
        <div className="flex flex-col gap-3">
          <Field label="Titre">
            <LocalizedInput value={block.title} onChange={(title) => onChange({ ...block, title })} />
          </Field>
          <Field label="Texte">
            <LocalizedTextarea value={block.body} onChange={(body) => onChange({ ...block, body })} rows={3} />
          </Field>
        </div>
      );
    case "question": {
      const updateChoice = (choiceId: string, label: ApiLocalized) =>
        onChange({ ...block, choices: block.choices.map((c) => (c.id === choiceId ? { ...c, label } : c)) });
      return (
        <div className="flex flex-col gap-3">
          <Field label="Question">
            <LocalizedInput value={block.prompt} onChange={(prompt) => onChange({ ...block, prompt })} />
          </Field>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-foreground-secondary">Choix — coche la bonne réponse</span>
            {block.choices.map((c) => (
              <div key={c.id} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`correct-${block.id}`}
                  checked={block.correctChoiceId === c.id}
                  onChange={() => onChange({ ...block, correctChoiceId: c.id })}
                  className="size-4 accent-[var(--primary)]"
                />
                <div className="flex-1">
                  <LocalizedInput value={c.label} onChange={(label) => updateChoice(c.id, label)} />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const choices = block.choices.filter((cc) => cc.id !== c.id);
                    onChange({ ...block, choices, correctChoiceId: block.correctChoiceId === c.id ? (choices[0]?.id ?? "") : block.correctChoiceId });
                  }}
                  className="rounded-lg p-2 text-foreground-tertiary transition hover:bg-danger-light hover:text-danger"
                >
                  <Trash2 size={14} strokeWidth={1.75} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => onChange({ ...block, choices: [...block.choices, newChoice()] })}
              className="flex items-center gap-1.5 self-start rounded-lg border border-dashed border-border px-3 py-1.5 text-xs font-medium text-foreground-secondary transition hover:border-primary hover:text-primary"
            >
              <Plus size={14} strokeWidth={2} />
              Ajouter un choix
            </button>
          </div>
          <Field label="Explication">
            <LocalizedInput value={block.explanation} onChange={(explanation) => onChange({ ...block, explanation })} />
          </Field>
        </div>
      );
    }
    case "formula":
      return (
        <div className="flex flex-col gap-3">
          <Field label="Légende (optionnelle)">
            <LocalizedInput value={block.caption ?? { ...EMPTY }} onChange={(caption) => onChange({ ...block, caption })} />
          </Field>
          <Field label="Expression">
            <input className={inputClass} value={block.expression} onChange={(e) => onChange({ ...block, expression: e.target.value })} />
          </Field>
        </div>
      );
    case "image":
      return (
        <div className="flex flex-col gap-3">
          <Field label="Légende (optionnelle)">
            <LocalizedInput value={block.caption ?? { ...EMPTY }} onChange={(caption) => onChange({ ...block, caption })} />
          </Field>
          <Field label="Illustration">
            <select className={inputClass} value={block.illustration} onChange={(e) => onChange({ ...block, illustration: e.target.value })}>
              {ILLUSTRATION_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </Field>
        </div>
      );
    case "diagram":
      return (
        <div className="flex flex-col gap-3">
          <Field label="Légende (optionnelle)">
            <LocalizedInput value={block.caption ?? { ...EMPTY }} onChange={(caption) => onChange({ ...block, caption })} />
          </Field>
          <Field label="Type de diagramme">
            <input className={inputClass} value={block.kind} onChange={(e) => onChange({ ...block, kind: e.target.value })} />
          </Field>
          <Field label="Valeurs (séparées par une virgule)">
            <input
              className={inputClass}
              value={(block.values ?? []).join(", ")}
              onChange={(e) =>
                onChange({
                  ...block,
                  values: e.target.value
                    .split(",")
                    .map((v) => Number(v.trim()))
                    .filter((v) => !Number.isNaN(v)),
                })
              }
            />
          </Field>
        </div>
      );
    case "summary":
      return (
        <Field label="Points clés">
          <LocalizedListEditor items={block.bullets} onChange={(bullets) => onChange({ ...block, bullets })} addLabel="Ajouter un point" />
        </Field>
      );
    case "table": {
      const setHeader = (i: number, value: ApiLocalized) =>
        onChange({ ...block, headers: block.headers.map((h, idx) => (idx === i ? value : h)) });
      const addColumn = () =>
        onChange({
          ...block,
          headers: [...block.headers, { ...EMPTY }],
          rows: block.rows.map((row) => [...row, { ...EMPTY }]),
        });
      const removeColumn = (i: number) =>
        onChange({
          ...block,
          headers: block.headers.filter((_, idx) => idx !== i),
          rows: block.rows.map((row) => row.filter((_, idx) => idx !== i)),
        });
      const addRow = () => onChange({ ...block, rows: [...block.rows, block.headers.map(() => ({ ...EMPTY }))] });
      const removeRow = (i: number) => onChange({ ...block, rows: block.rows.filter((_, idx) => idx !== i) });
      const setCell = (r: number, c: number, value: ApiLocalized) =>
        onChange({ ...block, rows: block.rows.map((row, ri) => (ri === r ? row.map((cell, ci) => (ci === c ? value : cell)) : row)) });

      return (
        <div className="flex flex-col gap-3">
          <Field label="Légende (optionnelle)">
            <LocalizedInput value={block.caption ?? { ...EMPTY }} onChange={(caption) => onChange({ ...block, caption })} />
          </Field>
          <div className="flex flex-col gap-2 overflow-x-auto">
            <span className="text-sm font-medium text-foreground-secondary">Colonnes</span>
            {block.headers.map((h, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="flex-1">
                  <LocalizedInput value={h} onChange={(v) => setHeader(i, v)} placeholderFr={`Colonne ${i + 1}`} />
                </div>
                <button
                  type="button"
                  onClick={() => removeColumn(i)}
                  className="mt-1 rounded-lg p-2 text-foreground-tertiary transition hover:bg-danger-light hover:text-danger"
                >
                  <Trash2 size={14} strokeWidth={1.75} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addColumn}
              className="flex items-center gap-1.5 self-start rounded-lg border border-dashed border-border px-3 py-1.5 text-xs font-medium text-foreground-secondary transition hover:border-primary hover:text-primary"
            >
              <Plus size={14} strokeWidth={2} />
              Ajouter une colonne
            </button>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-sm font-medium text-foreground-secondary">Lignes</span>
            {block.rows.map((row, r) => (
              <div key={r} className="rounded-xl border border-border-light p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-foreground-tertiary">Ligne {r + 1}</span>
                  <button type="button" onClick={() => removeRow(r)} className="rounded-lg p-1.5 text-foreground-tertiary transition hover:bg-danger-light hover:text-danger">
                    <Trash2 size={14} strokeWidth={1.75} />
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {row.map((cell, c) => (
                    <LocalizedInput key={c} value={cell} onChange={(v) => setCell(r, c, v)} placeholderFr={block.headers[c]?.fr || `Colonne ${c + 1}`} />
                  ))}
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addRow}
              className="flex items-center gap-1.5 self-start rounded-lg border border-dashed border-border px-3 py-1.5 text-xs font-medium text-foreground-secondary transition hover:border-primary hover:text-primary"
            >
              <Plus size={14} strokeWidth={2} />
              Ajouter une ligne
            </button>
          </div>
        </div>
      );
    }
  }
}

export function ContentBlockEditor({ blocks, onChange }: { blocks: ApiContentBlock[]; onChange: (blocks: ApiContentBlock[]) => void }) {
  const renumber = (list: ApiContentBlock[]) => list.map((b, i) => ({ ...b, position: i }));
  const updateBlock = (i: number, block: ApiContentBlock) => onChange(blocks.map((b, idx) => (idx === i ? block : b)));
  const removeBlock = (i: number) => onChange(renumber(blocks.filter((_, idx) => idx !== i)));
  const moveBlock = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= blocks.length) return;
    const next = [...blocks];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(renumber(next));
  };
  const addBlock = (type: ApiContentBlockType) => onChange([...blocks, newBlock(type, blocks.length)]);

  return (
    <div className="flex flex-col gap-4">
      {blocks.map((block, i) => (
        <div key={block.id} className="rounded-2xl border border-border-light bg-surface-warm p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-foreground-tertiary">
              Bloc {i + 1} — {BLOCK_TYPE_LABEL[block.type]}
            </span>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => moveBlock(i, -1)} disabled={i === 0} className="rounded-lg p-1.5 text-foreground-tertiary transition hover:bg-surface-secondary disabled:opacity-30">
                <ChevronUp size={15} strokeWidth={1.75} />
              </button>
              <button
                type="button"
                onClick={() => moveBlock(i, 1)}
                disabled={i === blocks.length - 1}
                className="rounded-lg p-1.5 text-foreground-tertiary transition hover:bg-surface-secondary disabled:opacity-30"
              >
                <ChevronDown size={15} strokeWidth={1.75} />
              </button>
              <button type="button" onClick={() => removeBlock(i)} className="rounded-lg p-1.5 text-foreground-tertiary transition hover:bg-danger-light hover:text-danger">
                <Trash2 size={15} strokeWidth={1.75} />
              </button>
            </div>
          </div>
          <BlockFields block={block} onChange={(b) => updateBlock(i, b)} />
        </div>
      ))}

      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-dashed border-border p-3">
        <span className="text-xs font-medium text-foreground-tertiary">Ajouter un bloc :</span>
        {(Object.keys(BLOCK_TYPE_LABEL) as ApiContentBlockType[]).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => addBlock(type)}
            className="rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-medium text-foreground-secondary transition hover:border-primary hover:text-primary"
          >
            {BLOCK_TYPE_LABEL[type]}
          </button>
        ))}
      </div>
    </div>
  );
}
