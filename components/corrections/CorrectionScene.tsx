"use client";

import { useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";
import { SceneCanvas } from "@/components/corrections/SceneCanvas";
import { buttonPrimary, buttonSecondary } from "@/lib/ui";
import type { CorrectionSceneData } from "@/lib/types";

export function CorrectionScene({ scene }: { scene: CorrectionSceneData }) {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing || typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();
    const narration = new SpeechSynthesisUtterance(
      `Correct outcome. The officer explains that the report must use facts, include the source, and include the time. Better sentence: ${scene.correctChoice.text}. Wrong outcome. The sentence ${scene.wrongChoice.text} uses personal opinion and unprofessional wording, so it weakens the report.`
    );
    narration.rate = 0.92;
    narration.pitch = 0.95;
    narration.onend = () => setPlaying(false);
    window.speechSynthesis.speak(narration);

    return () => window.speechSynthesis.cancel();
  }, [playing, scene.correctChoice.text, scene.wrongChoice.text]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-700">
            Press play to hear the correction and watch the two outcomes.
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Left side shows the professional outcome. Right side shows the user&apos;s wrong choice.
          </p>
        </div>
        <button
          className={playing ? buttonSecondary : buttonPrimary}
          onClick={() => setPlaying((value) => !value)}
          type="button"
        >
          {playing ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
          {playing ? "Pause Scene" : "Play Scene"}
        </button>
      </div>

      <SceneCanvas playing={playing} scene={scene} />
      <div className="grid gap-4 lg:grid-cols-2">
        <ChoicePanel
          label={scene.correctChoice.label}
          tone="correct"
          text={scene.correctChoice.text}
          tags={scene.correctChoice.tags}
        />
        <ChoicePanel
          label={scene.wrongChoice.label}
          tone="wrong"
          text={scene.wrongChoice.text}
          tags={scene.wrongChoice.tags}
        />
      </div>
    </div>
  );
}

function ChoicePanel({
  label,
  tags,
  text,
  tone
}: {
  label: string;
  tags: string[];
  text: string;
  tone: "wrong" | "correct";
}) {
  const styles =
    tone === "wrong"
      ? "border-red-200 bg-red-50 text-red-950"
      : "border-emerald-200 bg-emerald-50 text-emerald-950";

  return (
    <div className={`rounded-3xl border p-4 ${styles}`}>
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] opacity-70">{label}</p>
      <p className="mt-2 text-base font-semibold leading-6">{text}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
