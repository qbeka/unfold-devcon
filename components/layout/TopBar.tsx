"use client";

import { RotateCcw } from "lucide-react";
import { useUnfoldStore } from "@/lib/store";
import { buttonSecondary } from "@/lib/ui";

export function TopBar() {
  const resetDemo = useUnfoldStore((state) => state.resetDemo);
  const progress = useUnfoldStore((state) => state.progress);
  const manifest = useUnfoldStore((state) => state.documentManifest);

  return (
    <header className="flex flex-col gap-3 rounded-[1.5rem] border border-slate-200 bg-white/90 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
          {manifest?.source === "aws" ? "AWS processed manual" : "AWS pipeline with deterministic fallback"}
        </p>
        <h1 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-slate-950 md:text-2xl">
          {manifest?.title ?? "Source-grounded exam coaching"}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-right">
          <p className="text-xs font-medium text-slate-500">Readiness</p>
          <p className="text-base font-semibold text-slate-950">{progress.readinessScore}%</p>
        </div>
        <button className={buttonSecondary} onClick={resetDemo} type="button">
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </button>
      </div>
    </header>
  );
}
