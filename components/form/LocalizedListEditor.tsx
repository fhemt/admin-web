"use client";

import { Plus, Trash2 } from "lucide-react";
import { ApiLocalized } from "@/lib/api/types";
import { LocalizedInput } from "./LocalizedField";

type Props = {
  items: ApiLocalized[];
  onChange: (items: ApiLocalized[]) => void;
  addLabel?: string;
};

export function LocalizedListEditor({ items, onChange, addLabel = "Ajouter une ligne" }: Props) {
  return (
    <div className="flex flex-col gap-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-2">
          <div className="flex-1">
            <LocalizedInput value={item} onChange={(v) => onChange(items.map((it, idx) => (idx === i ? v : it)))} />
          </div>
          <button
            type="button"
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            className="mt-1 rounded-lg p-2 text-foreground-tertiary transition hover:bg-danger-light hover:text-danger"
          >
            <Trash2 size={15} strokeWidth={1.75} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, { fr: "", darija: "" }])}
        className="flex items-center gap-1.5 self-start rounded-lg border border-dashed border-border px-3 py-1.5 text-xs font-medium text-foreground-secondary transition hover:border-primary hover:text-primary"
      >
        <Plus size={14} strokeWidth={2} />
        {addLabel}
      </button>
    </div>
  );
}
