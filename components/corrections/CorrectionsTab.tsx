"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Cuboid, Loader2 } from "lucide-react";
import { CorrectionScene } from "@/components/corrections/CorrectionScene";
import { PracticeScene } from "@/components/corrections/PracticeScene";
import { useUnfoldStore } from "@/lib/store";
import { buttonPrimary, eyebrow, helperText, sectionTitle } from "@/lib/ui";

const SCENE_DURATION_MS = 2_000;

export function CorrectionsTab() {
  const [showPractice, setShowPractice] = useState(false);
  const [now, setNow] = useState(Date.now());
  const activeCorrectionScene = useUnfoldStore((state) => state.activeCorrectionScene);
  const pendingCorrectionScene = useUnfoldStore((state) => state.pendingCorrectionScene);
  const sceneGenerationStartedAt = useUnfoldStore((state) => state.sceneGenerationStartedAt);
  const finishSceneGeneration = useUnfoldStore((state) => state.finishSceneGeneration);
  const setActiveTab = useUnfoldStore((state) => state.setActiveTab);

  const elapsed = sceneGenerationStartedAt ? now - sceneGenerationStartedAt : 0;
  const isGenerating = Boolean(pendingCorrectionScene && sceneGenerationStartedAt);

  useEffect(() => {
    if (!isGenerating) return;
    const id = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(id);
  }, [isGenerating]);

  useEffect(() => {
    if (!isGenerating) return;
    if (elapsed >= SCENE_DURATION_MS) {
      finishSceneGeneration();
    }
  }, [elapsed, finishSceneGeneration, isGenerating]);

  if (isGenerating) {
    return <SceneGenerationLoader elapsed={elapsed} />;
  }

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

const STEPS = [
  { label: "Reading the wrong answer", at: 0 },
  { label: "Selecting the scene template", at: 0.22 },
  { label: "Building the lobby layout", at: 0.48 },
  { label: "Adding characters and narration", at: 0.72 },
  { label: "Preparing practice mode", at: 0.9 }
];

function SceneGenerationLoader({ elapsed }: { elapsed: number }) {
  const progress = Math.min(0.99, elapsed / SCENE_DURATION_MS);
  const current = STEPS.reduce((idx, step, i) => (progress >= step.at ? i : idx), 0);

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <p className={eyebrow}>Corrections · generating scene</p>
        <h1 className={sectionTitle}>Building your 3D correction</h1>
        <p className={helperText}>
          Unfold is turning the missed concept into an interactive scene grounded in Module Five.
        </p>
      </header>

      <section className="relative overflow-hidden rounded-2xl border border-black/10 bg-neutral-950 p-8 text-white">
        <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 animate-pulse rounded-full bg-white/[0.06] blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 animate-pulse rounded-full bg-white/[0.05] blur-3xl [animation-delay:600ms]" />

        <div className="relative mx-auto flex max-w-md flex-col items-center gap-7 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/15">
            <Cuboid className="h-6 w-6 text-white/90" />
          </div>

          <div className="w-full space-y-2">
            <div className="flex items-center justify-between text-[11px] font-medium text-white/60">
              <span>{STEPS[current]?.label ?? "Finishing scene"}</span>
              <span className="font-mono">{Math.round(progress * 100)}%</span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-white transition-[width] duration-700 ease-out"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>

          <ul className="grid w-full gap-1.5 text-left">
            {STEPS.map((step, i) => {
              const done = i < current;
              const active = i === current;
              return (
                <li
                  key={step.label}
                  className={`flex items-center gap-2 rounded-md px-2 py-1 text-[11px] transition ${
                    active ? "text-white" : done ? "text-white/55 line-through" : "text-white/35"
                  }`}
                >
                  <span
                    className={`grid h-3.5 w-3.5 place-items-center rounded-full text-[8px] ${
                      done
                        ? "bg-white text-neutral-950"
                        : active
                        ? "border border-white/40 text-white"
                        : "border border-white/15 text-white/30"
                    }`}
                  >
                    {done ? "✓" : i + 1}
                  </span>
                  {step.label}
                </li>
              );
            })}
          </ul>

          <p className="flex items-center gap-2 text-[11px] text-white/45">
            <Loader2 className="h-3 w-3 animate-spin" />
            This usually takes a few seconds.
          </p>
        </div>
      </section>
    </div>
  );
}
