"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { CorrectionScene } from "@/components/corrections/CorrectionScene";
import { PracticeScene } from "@/components/corrections/PracticeScene";
import { useUnfoldStore } from "@/lib/store";
import { buttonPrimary, eyebrow, helperText, sectionTitle } from "@/lib/ui";

export function CorrectionsTab() {
  const [showPractice, setShowPractice] = useState(false);
  const activeCorrectionScene = useUnfoldStore((state) => state.activeCorrectionScene);
  const setActiveTab = useUnfoldStore((state) => state.setActiveTab);

  if (!activeCorrectionScene) {
    return (
      <div className="space-y-6">
        <header className="space-y-3">
          <p className={eyebrow}>Corrections</p>
          <h1 className={sectionTitle}>No correction yet</h1>
          <p className={helperText}>
            Answer a question incorrectly to generate the 3D correction scene. Module Five has one
            curated scene built around objective report writing.
          </p>
          <button className={buttonPrimary} onClick={() => setActiveTab("exam")} type="button">
            Go to exam
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </header>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className={eyebrow}>Correction · 3D scene</p>
        <h1 className={sectionTitle}>{activeCorrectionScene.title}</h1>
        <p className={helperText}>
          The officer witnessed an event. Two reports describe it. One is factual, one is opinion.
        </p>
      </header>

      <CorrectionScene scene={activeCorrectionScene} />

      <section className="rounded-xl border border-black/10 bg-white p-4">
        <p className="text-[14px] font-medium text-neutral-900">{activeCorrectionScene.lesson}</p>
        <p className="mt-1 text-[12px] text-neutral-500">Source: {activeCorrectionScene.sourceReference}</p>
      </section>

      {!showPractice ? (
        <div>
          <button className={buttonPrimary} onClick={() => setShowPractice(true)} type="button">
            Practice it
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <PracticeScene />
      )}
    </div>
  );
}
