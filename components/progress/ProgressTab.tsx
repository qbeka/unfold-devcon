"use client";

import { ArrowRight } from "lucide-react";
import { ReadinessCard } from "@/components/progress/ReadinessCard";
import { WeakAreasList } from "@/components/progress/WeakAreasList";
import { useUnfoldStore } from "@/lib/store";
import { buttonPrimary, card, label } from "@/lib/ui";

export function ProgressTab() {
  const progress = useUnfoldStore((state) => state.progress);
  const setActiveTab = useUnfoldStore((state) => state.setActiveTab);

  return (
    <div className={`${card} p-6 lg:p-8`}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className={label}>Progress dashboard</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Module Five readiness
          </h2>
        </div>
        <button className={buttonPrimary} onClick={() => setActiveTab("exam")} type="button">
          Next best action
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[22rem_1fr]">
        <ReadinessCard score={progress.readinessScore} />
        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <h3 className="text-lg font-bold text-slate-950">Completed sections</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {progress.completedSections.map((section) => (
                <span
                  key={section}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700"
                >
                  {section}
                </span>
              ))}
            </div>
          </div>
          <WeakAreasList improvedAreas={progress.improvedAreas} weakAreas={progress.weakAreas} />
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
        <h3 className="text-lg font-bold text-slate-950">Recommendations</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {progress.recommendations.map((recommendation) => (
            <div key={recommendation} className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-700">
              {recommendation}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
