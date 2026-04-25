"use client";

import { useEffect, useState } from "react";
import { Loader2, Play, RotateCcw } from "lucide-react";
import { useUnfoldStore } from "@/lib/store";
import { buttonPrimary, buttonSecondary, eyebrow, helperText, sectionTitle } from "@/lib/ui";
import type { MovieStyle } from "@/lib/types";

const styles: { id: MovieStyle; label: string }[] = [
  { id: "whiteboard", label: "Whiteboard" },
  { id: "scenario", label: "Scenario" },
  { id: "exam_review", label: "Exam review" }
];

const DEFAULT_PROMPT = "Teach me about objective report writing in module 5.";

const MOVIE_DURATION_MS = 2_000;

const LOADING_STEPS = [
  { label: "Reading Module Five", at: 0 },
  { label: "Composing the script", at: 0.18 },
  { label: "Generating narration", at: 0.42 },
  { label: "Rendering frames", at: 0.7 },
  { label: "Polishing the cut", at: 0.92 }
];

export function MovieTab() {
  const movieStartedAt = useUnfoldStore((s) => s.movieStartedAt);
  const moviePrompt = useUnfoldStore((s) => s.moviePrompt);
  const startMovieGeneration = useUnfoldStore((s) => s.startMovieGeneration);
  const resetMovie = useUnfoldStore((s) => s.resetMovie);

  const [prompt, setPrompt] = useState(moviePrompt ?? DEFAULT_PROMPT);
  const [style, setStyle] = useState<MovieStyle>("scenario");
  const [now, setNow] = useState<number>(() => Date.now());
  const [videoFailed, setVideoFailed] = useState(false);

  // Sync the prompt input with whatever was last persisted (so coming back
  // shows the prompt that's actually being generated).
  useEffect(() => {
    if (moviePrompt) setPrompt(moviePrompt);
  }, [moviePrompt]);

  // Keep `now` ticking only while a generation is in progress.
  const elapsed = movieStartedAt ? Math.max(0, now - movieStartedAt) : 0;
  const loading = Boolean(movieStartedAt) && elapsed < MOVIE_DURATION_MS;
  const done = Boolean(movieStartedAt) && elapsed >= MOVIE_DURATION_MS;

  useEffect(() => {
    if (!loading) return;
    const id = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(id);
  }, [loading]);

  const videoPath = process.env.NEXT_PUBLIC_DEMO_VIDEO_PATH ?? "/videos/video.mp4";
  const status: "idle" | "loading" | "done" = loading ? "loading" : done ? "done" : "idle";

  function generateMovie() {
    setVideoFailed(false);
    startMovieGeneration(prompt);
    setNow(Date.now());
  }

  function regenerate() {
    setVideoFailed(false);
    resetMovie();
    startMovieGeneration(prompt);
    setNow(Date.now());
  }

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-3">
          <p className={eyebrow}>Movie</p>
          <h1 className={sectionTitle}>Source-grounded movie</h1>
          <p className={helperText}>
            Generate a short, narrated lesson from Module Five. Generation runs in the background —
            switch tabs and come back when it&apos;s ready.
          </p>
        </div>
        {loading && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-2.5 py-1 text-[11px] font-medium text-neutral-700">
            <Loader2 className="h-3 w-3 animate-spin" />
            Generating · {Math.max(1, Math.round((MOVIE_DURATION_MS - elapsed) / 1000))}s left
          </span>
        )}
        {done && (
          <button className={buttonSecondary} onClick={regenerate} type="button">
            <RotateCcw className="h-3.5 w-3.5" />
            Regenerate
          </button>
        )}
      </header>

      <section className="rounded-2xl border border-black/10 bg-white p-5">
        <label className="block">
          <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-400">
            What should the lesson cover?
          </span>
          <input
            className="mt-2 w-full rounded-lg border border-black/10 bg-white px-3 py-2.5 text-[14px] text-neutral-900 outline-none focus:border-black/30 disabled:opacity-60"
            disabled={loading}
            onChange={(event) => setPrompt(event.target.value)}
            value={prompt}
          />
        </label>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-0.5 rounded-full border border-black/10 bg-white p-0.5">
            {styles.map((item) => (
              <button
                key={item.id}
                className={`rounded-full px-3 py-1.5 text-[12px] font-medium transition ${
                  style === item.id
                    ? "bg-neutral-950 text-white"
                    : "text-neutral-500 hover:text-neutral-950"
                }`}
                disabled={loading}
                onClick={() => setStyle(item.id)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            className={buttonPrimary}
            disabled={loading || !prompt.trim()}
            onClick={generateMovie}
            type="button"
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
            {loading ? "Generating" : done ? "Generate again" : "Generate"}
          </button>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-black/10 bg-neutral-100">
        {status === "idle" && <Placeholder text="Your generated lesson appears here." />}
        {status === "loading" && <LoadingPanel elapsed={elapsed} />}
        {status === "done" &&
          (!videoFailed ? (
            <video
              className="aspect-video w-full bg-black"
              autoPlay
              controls
              onError={() => setVideoFailed(true)}
              src={videoPath}
            >
              Your browser does not support embedded video.
            </video>
          ) : (
            <Placeholder text="Demo video not available. Drop video.mp4 into public/videos/." />
          ))}
      </section>
    </div>
  );
}

function Placeholder({ text }: { text: string }) {
  return (
    <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-neutral-100 via-white to-neutral-100 text-center">
      <p className="max-w-xs px-6 text-[12.5px] leading-6 text-neutral-500">{text}</p>
    </div>
  );
}

function LoadingPanel({ elapsed }: { elapsed: number }) {
  const progress = Math.min(0.99, elapsed / MOVIE_DURATION_MS);
  const currentStep = LOADING_STEPS.reduce(
    (idx, step, i) => (progress >= step.at ? i : idx),
    0
  );

  return (
    <div className="relative aspect-video bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-800 text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 -top-20 h-72 w-72 animate-pulse rounded-full bg-white/[0.06] blur-3xl" />
        <div className="absolute -right-16 bottom-0 h-72 w-72 animate-pulse rounded-full bg-white/[0.05] blur-3xl [animation-delay:600ms]" />
      </div>

      <div className="relative flex h-full w-full flex-col items-center justify-center gap-7 px-10 text-center">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-white/10 ring-1 ring-white/15">
          <Loader2 className="h-5 w-5 animate-spin text-white/85" />
        </div>

        <div className="w-full max-w-xs space-y-2">
          <div className="flex items-center justify-between text-[11px] font-medium text-white/60">
            <span>{LOADING_STEPS[currentStep]?.label ?? "Finishing up"}</span>
            <span className="font-mono">{Math.round(progress * 100)}%</span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-white transition-[width] duration-700 ease-out"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>

        <ul className="grid w-full max-w-xs gap-1.5 text-left">
          {LOADING_STEPS.map((step, i) => {
            const done = i < currentStep;
            const current = i === currentStep;
            return (
              <li
                key={step.label}
                className={`flex items-center gap-2 rounded-md px-2 py-1 text-[11px] transition ${
                  current ? "text-white" : done ? "text-white/55 line-through" : "text-white/35"
                }`}
              >
                <span
                  className={`grid h-3.5 w-3.5 place-items-center rounded-full text-[8px] ${
                    done
                      ? "bg-white text-neutral-950"
                      : current
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

        <p className="text-[11px] text-white/40">
          Generation continues in the background. You can switch tabs and return.
        </p>
      </div>
    </div>
  );
}
