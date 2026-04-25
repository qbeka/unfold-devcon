"use client";

import { useState } from "react";
import { Clapperboard } from "lucide-react";
import { movieStoryboard } from "@/lib/data/movieStoryboard";
import { buttonPrimary, helperText, label, sectionHeading } from "@/lib/ui";
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
    <div className="space-y-8">
      <header className="space-y-3">
        <p className={label}>Movie</p>
        <h1 className={sectionHeading}>Source-grounded movie generator</h1>
        <p className={helperText}>
          Generate a short lesson from Module Five. The output is grounded in the manual.
        </p>
      </header>

      <section className="space-y-4 rounded-[1.25rem] border border-slate-200 bg-white p-5">
        <label className="block">
          <span className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-slate-400">
            Prompt
          </span>
          <input
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400"
            onChange={(event) => setPrompt(event.target.value)}
            value={prompt}
          />
        </label>

        <div>
          <p className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-slate-400">Style</p>
          <div className="mt-2 inline-flex items-center gap-0.5 rounded-full border border-slate-200 bg-white p-0.5">
            {styles.map((item) => (
              <button
                key={item.id}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  style === item.id
                    ? "bg-slate-950 text-white"
                    : "text-slate-500 hover:text-slate-950"
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
          <Clapperboard className="mr-1.5 h-3.5 w-3.5" />
          Generate
        </button>
      </section>

      <section>
        <p className="mb-3 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-slate-400">
          Generated from Module Five
        </p>

        {status === "loading" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-2/3 animate-pulse rounded-full bg-slate-950" />
            </div>
            <p className="mt-4 text-sm text-slate-600">
              Preparing storyboard and narration with Bedrock and Polly…
            </p>
          </div>
        )}

        {status === "done" && (
          <div className="space-y-5">
            {!videoFailed && (
              <video
                className="w-full rounded-2xl border border-slate-200 bg-black"
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
    <div className="grid gap-3 md:grid-cols-5">
      {movieStoryboard.map((frame, index) => (
        <div key={frame.title} className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-slate-400">
            Frame {index + 1}
          </p>
          <h3 className="mt-2 text-sm font-semibold text-slate-950">{frame.title}</h3>
          <p className="mt-1.5 text-xs leading-5 text-slate-500">{frame.body}</p>
        </div>
      ))}
    </div>
  );
}
