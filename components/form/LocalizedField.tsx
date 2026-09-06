"use client";

import { ApiLocalized } from "@/lib/api/types";
import { inputClass } from "./Field";

type Props = {
  value: ApiLocalized;
  onChange: (value: ApiLocalized) => void;
  placeholderFr?: string;
  placeholderDarija?: string;
  rows?: number;
};

export function LocalizedInput({ value, onChange, placeholderFr = "Français", placeholderDarija = "Darija" }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <input
        className={inputClass}
        value={value.fr}
        placeholder={placeholderFr}
        onChange={(e) => onChange({ ...value, fr: e.target.value })}
      />
      <input
        className={inputClass}
        dir="rtl"
        value={value.darija}
        placeholder={placeholderDarija}
        onChange={(e) => onChange({ ...value, darija: e.target.value })}
      />
    </div>
  );
}

export function LocalizedTextarea({ value, onChange, placeholderFr = "Français", placeholderDarija = "Darija", rows = 2 }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <textarea
        className={inputClass}
        rows={rows}
        value={value.fr}
        placeholder={placeholderFr}
        onChange={(e) => onChange({ ...value, fr: e.target.value })}
      />
      <textarea
        className={inputClass}
        dir="rtl"
        rows={rows}
        value={value.darija}
        placeholder={placeholderDarija}
        onChange={(e) => onChange({ ...value, darija: e.target.value })}
      />
    </div>
  );
}
