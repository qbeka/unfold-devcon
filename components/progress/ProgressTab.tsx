"use client";

import { ArrowRight } from "lucide-react";
import { ReadinessCard } from "@/components/progress/ReadinessCard";
import { WeakAreasList } from "@/components/progress/WeakAreasList";
import { useUnfoldStore } from "@/lib/store";
import { buttonPrimary, helperText, label, sectionHeading } from "@/lib/ui";

export function ProgressTab() {
  const progress = useUnfoldStore((state) => state.progress);
  const setActiveTab = useUnfoldStore((state) => state.setActiveTab);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-3">
          <p className={label}>Progress</p>
          <h1 className={sectionHeading}>Module Five readiness</h1>
          <p className={helperText}>
            Readiness, weak areas, and your next best step are tracked across the session.
          </p>
        </div>
        <button className={buttonPrimary} onClick={() => setActiveTab("exam")} type="button">
          Next best action
          <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
        </button>
      </header>

      <div className="grid gap-5 lg:grid-cols-[18rem_1fr]">
        <ReadinessCard score={progress.readinessScore} />
        <div className="space-y-5">
          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-slate-400">
              Completed sections
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {progress.completedSections.map((section) => (
                <span
                  key={section}
                  className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700"
                >
                  {section}
                </span>
              ))}
            </div>
          </section>
          <WeakAreasList improvedAreas={progress.improvedAreas} weakAreas={progress.weakAreas} />
        </div>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <p className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-slate-400">
          Recommendations
        </p>
        <ul className="mt-3 space-y-1.5 text-sm leading-6 text-slate-600">
          {progress.recommendations.map((r) => (
            <li key={r}>· {r}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
