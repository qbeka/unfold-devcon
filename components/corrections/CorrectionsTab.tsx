"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { CorrectionScene } from "@/components/corrections/CorrectionScene";
import { PracticeScene } from "@/components/corrections/PracticeScene";
import { useUnfoldStore } from "@/lib/store";
import { buttonPrimary, label, sectionHeading, helperText } from "@/lib/ui";

export function CorrectionsTab() {
  const [showPractice, setShowPractice] = useState(false);
  const activeCorrectionScene = useUnfoldStore((state) => state.activeCorrectionScene);
  const setActiveTab = useUnfoldStore((state) => state.setActiveTab);

  if (!activeCorrectionScene) {
    return (
      <div className="space-y-6">
        <header className="space-y-3">
          <p className={label}>Corrections</p>
          <h1 className={sectionHeading}>No correction yet</h1>
          <p className={helperText}>
            Answer a question incorrectly to generate the 3D correction scene. Module Five has one
            curated scene built around objective report writing.
          </p>
          <button className={buttonPrimary} onClick={() => setActiveTab("exam")} type="button">
            Go to exam
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </button>
        </header>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <p className={label}>Corrections · 3D scene</p>
        <h1 className={sectionHeading}>{activeCorrectionScene.title}</h1>
        <p className={helperText}>
          Two side-by-side dioramas. The professional outcome is on the left. The wrong choice you
          selected on the exam is on the right.
        </p>
      </header>

      <CorrectionScene scene={activeCorrectionScene} />

      <section className="rounded-[1.25rem] border border-slate-200 bg-white p-5">
        <p className="text-sm font-semibold text-slate-950">{activeCorrectionScene.lesson}</p>
        <p className="mt-1 text-xs text-slate-500">Source: {activeCorrectionScene.sourceReference}</p>
      </section>

      {!showPractice ? (
        <div>
          <button className={buttonPrimary} onClick={() => setShowPractice(true)} type="button">
            Practice it
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <PracticeScene />
      )}
    </div>
  );
}
