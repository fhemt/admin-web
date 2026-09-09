"use client";

import { ApiLocalized } from "@/lib/api/types";
import { inputClass } from "./Field";

const EMPTY_LOCALIZED: ApiLocalized = { fr: "", darija: "" };

type Props = {
  value: ApiLocalized | null | undefined;
  onChange: (value: ApiLocalized) => void;
  placeholderFr?: string;
  placeholderDarija?: string;
  rows?: number;
};

export function LocalizedInput({ value, onChange, placeholderFr = "Français", placeholderDarija = "Darija" }: Props) {
  // Some older seeded content has a null title/body where the admin UI's
  // own "add block" flow always writes {fr: "", darija: ""} — reading
  // .fr/.darija straight off `value` crashed the whole lesson editor on
  // any block seeded that way, with no way to open it and fix the data.
  const safeValue = value ?? EMPTY_LOCALIZED;
  return (
    <div className="grid grid-cols-2 gap-2">
      <input
        className={inputClass}
        value={safeValue.fr}
        placeholder={placeholderFr}
        onChange={(e) => onChange({ ...safeValue, fr: e.target.value })}
      />
      <input
        className={inputClass}
        dir="rtl"
        value={safeValue.darija}
        placeholder={placeholderDarija}
        onChange={(e) => onChange({ ...safeValue, darija: e.target.value })}
      />
    </div>
  );
}

export function LocalizedTextarea({ value, onChange, placeholderFr = "Français", placeholderDarija = "Darija", rows = 2 }: Props) {
  const safeValue = value ?? EMPTY_LOCALIZED;
  return (
    <div className="grid grid-cols-2 gap-2">
      <textarea
        className={inputClass}
        rows={rows}
        value={safeValue.fr}
        placeholder={placeholderFr}
        onChange={(e) => onChange({ ...safeValue, fr: e.target.value })}
      />
      <textarea
        className={inputClass}
        dir="rtl"
        rows={rows}
        value={safeValue.darija}
        placeholder={placeholderDarija}
        onChange={(e) => onChange({ ...safeValue, darija: e.target.value })}
      />
    </div>
  );
}
