"use client";

import { useUnfoldStore } from "@/lib/store";
import type { LanguageMode } from "@/lib/types";

const modes: { id: LanguageMode; label: string }[] = [
  { id: "original", label: "Original English" },
  { id: "simple", label: "Simplified English" },
  { id: "spanish", label: "Spanish" },
  { id: "side_by_side", label: "Side by side" }
];

export function LanguageToggle() {
  const languageMode = useUnfoldStore((state) => state.languageMode);
  const setLanguageMode = useUnfoldStore((state) => state.setLanguageMode);

  return (
    <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1">
      {modes.map((mode) => (
        <button
          key={mode.id}
          className={`rounded-xl px-3 py-2 text-sm font-semibold ${
            languageMode === mode.id
              ? "bg-white text-slate-950 shadow-sm"
              : "text-slate-500 hover:text-slate-950"
          }`}
          onClick={() => setLanguageMode(mode.id)}
          type="button"
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}
