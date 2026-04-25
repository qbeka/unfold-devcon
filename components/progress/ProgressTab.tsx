"use client";

import { ArrowRight } from "lucide-react";
import { ReadinessCard } from "@/components/progress/ReadinessCard";
import { WeakAreasList } from "@/components/progress/WeakAreasList";
import { useUnfoldStore } from "@/lib/store";
import { buttonPrimary, eyebrow, helperText, sectionTitle } from "@/lib/ui";

export function ProgressTab() {
  const progress = useUnfoldStore((state) => state.progress);
  const setActiveTab = useUnfoldStore((state) => state.setActiveTab);

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-3">
          <p className={eyebrow}>Progress</p>
          <h1 className={sectionTitle}>Module Five readiness</h1>
          <p className={helperText}>Tracked across the session.</p>
        </div>
        <button className={buttonPrimary} onClick={() => setActiveTab("exam")} type="button">
          Next best action
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </header>

      <div className="grid gap-5 lg:grid-cols-[18rem_1fr]">
        <ReadinessCard score={progress.readinessScore} />
        <div className="space-y-5">
          <section className="rounded-xl border border-black/10 bg-white p-5">
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-400">
              Completed sections
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {progress.completedSections.map((section) => (
                <span
                  key={section}
                  className="rounded-full border border-black/10 bg-white px-2.5 py-1 text-[11px] font-medium text-neutral-700"
                >
                  {section}
                </span>
              ))}
            </div>
          </section>
          <WeakAreasList improvedAreas={progress.improvedAreas} weakAreas={progress.weakAreas} />
        </div>
      </div>

      <section className="rounded-xl border border-black/10 bg-white p-5">
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-400">
          Recommendations
        </p>
        <ul className="mt-2 space-y-1 text-[13px] leading-6 text-neutral-700">
          {progress.recommendations.map((r) => (
            <li key={r}>· {r}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
