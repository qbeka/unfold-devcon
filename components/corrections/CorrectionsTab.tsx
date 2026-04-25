"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { CorrectionScene } from "@/components/corrections/CorrectionScene";
import { PracticeScene } from "@/components/corrections/PracticeScene";
import { useUnfoldStore } from "@/lib/store";
import { buttonPrimary, card, label } from "@/lib/ui";

export function CorrectionsTab() {
  const [showPractice, setShowPractice] = useState(false);
  const activeCorrectionScene = useUnfoldStore((state) => state.activeCorrectionScene);
  const setActiveTab = useUnfoldStore((state) => state.setActiveTab);

  if (!activeCorrectionScene) {
    return (
      <div className={`${card} p-6`}>
        <p className={label}>Correction scene</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
          Answer a question incorrectly first to generate a correction scene.
        </h2>
        <p className="mt-3 max-w-2xl leading-7 text-slate-600">
          The demo has one polished correction path for objective report writing. Start the
          focused exam and choose the opinion-based sentence to unlock it.
        </p>
        <button className={`${buttonPrimary} mt-6`} onClick={() => setActiveTab("exam")} type="button">
          Go to Exam
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className={`${card} space-y-5 p-5 lg:p-6`}>
      <div>
        <p className={label}>3D correction</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
          {activeCorrectionScene.title}
        </h2>
      </div>

      <CorrectionScene scene={activeCorrectionScene} />

      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-base font-semibold text-slate-950">{activeCorrectionScene.lesson}</p>
        <p className="mt-2 text-sm font-medium text-slate-600">
          Source reference: {activeCorrectionScene.sourceReference}
        </p>
      </div>

      {!showPractice ? (
        <button className={buttonPrimary} onClick={() => setShowPractice(true)} type="button">
          Practice It
        </button>
      ) : (
        <PracticeScene />
      )}
    </div>
  );
}
