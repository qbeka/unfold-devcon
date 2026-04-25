"use client";

import { useEffect, useState } from "react";
import { Loader2, Pause, Play } from "lucide-react";
import { SceneCanvas } from "@/components/corrections/SceneCanvas";
import { buttonPrimary, buttonSecondary } from "@/lib/ui";
import { cancelSpeech, speak } from "@/lib/speech";
import type { CorrectionSceneData } from "@/lib/types";

export function CorrectionScene({ scene }: { scene: CorrectionSceneData }) {
  const [playState, setPlayState] = useState<"idle" | "loading" | "playing">("idle");
  const [highlight, setHighlight] = useState<"correct" | "wrong" | null>(null);
  const isPlaying = playState === "playing";
  const isLoading = playState === "loading";

  useEffect(() => {
    if (!isLoading) return;

    let cancelled = false;

    async function prepareNarration() {
      setHighlight(null);
      const narration = await speak({
        text: `Same incident. The officer observes a woman slip on a wet area in the lobby at fourteen thirty. The factual report says: ${scene.correctChoice.text} The opinion-based report says: ${scene.wrongChoice.text} The professional choice is always the factual one.`,
        rate: 0.88,
        pitch: 0.96,
        onEnd: () => setPlayState("idle")
      });

      if (cancelled) {
        cancelSpeech();
        return;
      }

      setPlayState(narration ? "playing" : "idle");
    }

    void prepareNarration();

    return () => {
      cancelled = true;
    };
  }, [isLoading, scene.correctChoice.text, scene.wrongChoice.text]);

  useEffect(() => {
    if (!isPlaying) {
      setHighlight(null);
      return;
    }

    const t1 = window.setTimeout(() => setHighlight("correct"), 800);
    const t2 = window.setTimeout(() => setHighlight("wrong"), 6500);
    const t3 = window.setTimeout(() => setHighlight(null), 12000);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [isPlaying]);

  useEffect(() => () => cancelSpeech(), []);

  function togglePlayback() {
    if (isLoading || isPlaying) {
      cancelSpeech();
      setPlayState("idle");
      return;
    }

    setPlayState("loading");
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <p className="max-w-md text-[14px] leading-6 text-neutral-500">
          The officer observes a hotel-lobby slip at 14:30. Two reports describe the same event —
          one is factual, one is opinion. Press play to hear which is correct.
        </p>
        <button
          className={isLoading || isPlaying ? buttonSecondary : buttonPrimary}
          onClick={togglePlayback}
          type="button"
        >
          {isLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : isPlaying ? (
            <Pause className="h-3.5 w-3.5" />
          ) : (
            <Play className="h-3.5 w-3.5" />
          )}
          {isLoading ? "Preparing voice" : isPlaying ? "Pause" : "Play scene"}
        </button>
      </div>

      <SceneCanvas playing={isPlaying} scene={scene} highlightSide={highlight} height={520} />

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
  const accent = tone === "correct" ? "text-emerald-700" : "text-amber-700";
  const dot = tone === "correct" ? "bg-emerald-500" : "bg-amber-500";
  return (
    <div className="rounded-xl border border-black/10 bg-white p-4">
      <p className={`flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.18em] ${accent}`}>
        <span className={`inline-block h-1.5 w-1.5 rounded-full ${dot}`} />
        {label}
      </p>
      <p className="mt-2 text-[14px] font-medium leading-6 text-neutral-800">“{text}”</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {tags.map((t) => (
          <span key={t} className="rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-medium text-neutral-600">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
