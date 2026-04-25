"use client";

import { useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";
import { SceneCanvas } from "@/components/corrections/SceneCanvas";
import { buttonPrimary, buttonSecondary } from "@/lib/ui";
import type { CorrectionSceneData } from "@/lib/types";

export function CorrectionScene({ scene }: { scene: CorrectionSceneData }) {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const narration = new SpeechSynthesisUtterance(
      `Compare the two outcomes. On the left, the officer keeps the report objective and writes: ${scene.correctChoice.text}. On the right, the officer used personal opinion and wrote: ${scene.wrongChoice.text}. The professional choice is always to record facts only.`
    );
    narration.rate = 0.95;
    narration.pitch = 0.95;
    narration.onend = () => setPlaying(false);
    window.speechSynthesis.speak(narration);
    return () => window.speechSynthesis.cancel();
  }, [playing, scene.correctChoice.text, scene.wrongChoice.text]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <p className="max-w-md text-sm leading-6 text-slate-500">
          Press play to hear the officer narrate both outcomes. Left side is the professional report.
          Right side is the wrong choice that was selected on the exam.
        </p>
        <button
          className={playing ? buttonSecondary : buttonPrimary}
          onClick={() => setPlaying((v) => !v)}
          type="button"
        >
          {playing ? <Pause className="mr-1.5 h-3.5 w-3.5" /> : <Play className="mr-1.5 h-3.5 w-3.5" />}
          {playing ? "Pause" : "Play scene"}
        </button>
      </div>

      <SceneCanvas playing={playing} scene={scene} />

      <div className="grid gap-3 sm:grid-cols-2">
        <ChoiceCard tone="correct" label={scene.correctChoice.label} text={scene.correctChoice.text} tags={scene.correctChoice.tags} />
        <ChoiceCard tone="wrong" label={scene.wrongChoice.label} text={scene.wrongChoice.text} tags={scene.wrongChoice.tags} />
      </div>
    </div>
  );
}

function ChoiceCard({
  tone,
  label,
  text,
  tags
}: {
  tone: "correct" | "wrong";
  label: string;
  text: string;
  tags: string[];
}) {
  const accent =
    tone === "correct"
      ? "border-emerald-200 bg-emerald-50/70 text-emerald-900"
      : "border-amber-200 bg-amber-50/70 text-amber-900";
  return (
    <div className={`rounded-2xl border p-4 ${accent}`}>
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] opacity-70">{label}</p>
      <p className="mt-2 text-sm font-medium leading-6">{text}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {tags.map((t) => (
          <span key={t} className="rounded-full bg-white/70 px-2 py-0.5 text-[0.65rem] font-medium">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
