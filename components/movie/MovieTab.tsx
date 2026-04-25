"use client";

import { useState } from "react";
import { Clapperboard } from "lucide-react";
import { movieStoryboard } from "@/lib/data/movieStoryboard";
import { buttonPrimary, card, label } from "@/lib/ui";
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
    window.setTimeout(() => setStatus("done"), 1100);
  }

  return (
    <div className={`${card} p-6 lg:p-8`}>
      <p className={label}>Source-grounded movie</p>
      <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
        Movie Generator
      </h2>
      <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-600">
        Generate a short lesson from Module Five: Documentation and Evidence. The demo
        uses a deterministic generated output for reliability.
      </p>

      <div className="mt-6 grid gap-4 rounded-3xl border border-slate-200 bg-white p-5">
        <label className="text-sm font-bold text-slate-950">
          Prompt
          <input
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-950"
            onChange={(event) => setPrompt(event.target.value)}
            value={prompt}
          />
        </label>

        <div>
          <p className="text-sm font-bold text-slate-950">Style</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {styles.map((item) => (
              <button
                key={item.id}
                className={`rounded-2xl px-4 py-2 text-sm font-semibold ${
                  style === item.id
                    ? "bg-slate-950 text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:text-slate-950"
                }`}
                onClick={() => setStyle(item.id)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <button className={buttonPrimary} onClick={generateMovie} type="button">
          <Clapperboard className="mr-2 h-4 w-4" />
          Generate source-grounded movie
        </button>
      </div>

      <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
        <p className="text-sm font-semibold text-slate-600">
          Generated from Module Five: Documentation and Evidence.
        </p>

        {status === "loading" && (
          <div className="mt-5 rounded-3xl bg-white p-6">
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-2/3 animate-pulse rounded-full bg-slate-950" />
            </div>
            <p className="mt-4 text-sm font-semibold text-slate-600">
              Preparing cached AWS storyboard and narration assets...
            </p>
          </div>
        )}

        {status === "done" && (
          <div className="mt-5 space-y-5">
            {!videoFailed && (
              <video
                className="w-full rounded-3xl border border-slate-200 bg-black"
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
      </div>
    </div>
  );
}

function Storyboard() {
  return (
    <div className="mt-5 grid gap-3 md:grid-cols-5">
      {movieStoryboard.map((card, index) => (
        <div key={card.title} className="rounded-3xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
            Frame {index + 1}
          </p>
          <h3 className="mt-3 font-bold text-slate-950">{card.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{card.body}</p>
        </div>
      ))}
    </div>
  );
}
