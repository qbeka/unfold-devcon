"use client";

import { useState } from "react";
import { Clapperboard } from "lucide-react";
import { movieStoryboard } from "@/lib/data/movieStoryboard";
import { buttonPrimary, eyebrow, helperText, sectionTitle } from "@/lib/ui";
import type { MovieStyle } from "@/lib/types";

const styles: { id: MovieStyle; label: string }[] = [
  { id: "whiteboard", label: "Whiteboard" },
  { id: "scenario", label: "Scenario" },
  { id: "exam_review", label: "Exam review" }
];

export function MovieTab() {
  const [prompt, setPrompt] = useState("Teach me about objective report writing");
  const [style, setStyle] = useState<MovieStyle>("exam_review");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [videoFailed, setVideoFailed] = useState(false);
  const videoPath = process.env.NEXT_PUBLIC_DEMO_VIDEO_PATH ?? "/videos/demo-report-writing.mp4";

  function generateMovie() {
    setVideoFailed(false);
    setStatus("loading");
    window.setTimeout(() => setStatus("done"), 1300);
  }

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className={eyebrow}>Movie</p>
        <h1 className={sectionTitle}>Source-grounded movie generator</h1>
        <p className={helperText}>Generate a short lesson grounded in Module Five.</p>
      </header>

      <section className="space-y-4 rounded-xl border border-black/10 bg-white p-5">
        <label className="block">
          <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-400">Prompt</span>
          <input
            className="mt-2 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-[14px] text-neutral-900 outline-none focus:border-black/30"
            onChange={(event) => setPrompt(event.target.value)}
            value={prompt}
          />
        </label>

        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-400">Style</p>
          <div className="mt-2 inline-flex items-center gap-0.5 rounded-full border border-black/10 bg-white p-0.5">
            {styles.map((item) => (
              <button
                key={item.id}
                className={`rounded-full px-3 py-1.5 text-[12px] font-medium transition ${
                  style === item.id ? "bg-neutral-950 text-white" : "text-neutral-500 hover:text-neutral-950"
                }`}
                onClick={() => setStyle(item.id)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <button className={buttonPrimary} onClick={generateMovie} type="button">
            <Clapperboard className="h-3.5 w-3.5" />
            Generate
          </button>
        </div>
      </section>

      <section>
        <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-400">
          Generated from Module Five
        </p>

        {status === "loading" && (
          <div className="rounded-xl border border-black/10 bg-white p-5">
            <div className="h-1 overflow-hidden rounded-full bg-black/5">
              <div className="h-full w-2/3 animate-pulse rounded-full bg-neutral-950" />
            </div>
            <p className="mt-4 text-[13px] text-neutral-500">
              Preparing storyboard and narration with Bedrock and Polly…
            </p>
          </div>
        )}

        {status === "done" && (
          <div className="space-y-5">
            {!videoFailed && (
              <video
                className="w-full rounded-xl border border-black/10 bg-black"
                controls
                onError={() => setVideoFailed(true)}
                src={videoPath}
              >
                Your browser does not support embedded video.
              </video>
            )}
            <Storyboard />
          </div>
        )}

        {status === "idle" && <Storyboard />}
      </section>
    </div>
  );
}

function Storyboard() {
  return (
    <div className="grid gap-2.5 md:grid-cols-5">
      {movieStoryboard.map((frame, index) => (
        <div key={frame.title} className="rounded-xl border border-black/10 bg-white p-3.5">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-400">
            Frame {index + 1}
          </p>
          <h3 className="mt-1.5 text-[13px] font-semibold text-neutral-950">{frame.title}</h3>
          <p className="mt-1 text-[12px] leading-5 text-neutral-500">{frame.body}</p>
        </div>
      ))}
    </div>
  );
}
