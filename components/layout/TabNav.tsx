"use client";

import { useEffect, useState } from "react";
import { useUnfoldStore } from "@/lib/store";
import type { AppTab } from "@/lib/types";

const tabs: { id: AppTab; label: string }[] = [
  { id: "read", label: "Read" },
  { id: "exam", label: "Exam" },
  { id: "corrections", label: "Corrections" },
  { id: "discussion", label: "Discussion" },
  { id: "movie", label: "Movie" },
  { id: "progress", label: "Progress" }
];

const MOVIE_DURATION_MS = 50_000;

export function TabNav() {
  const activeTab = useUnfoldStore((state) => state.activeTab);
  const setActiveTab = useUnfoldStore((state) => state.setActiveTab);
  const movieStartedAt = useUnfoldStore((state) => state.movieStartedAt);
  const [now, setNow] = useState<number>(() => Date.now());

  // Tick while a movie is generating so the dot transitions reactively.
  useEffect(() => {
    if (!movieStartedAt) return;
    const elapsed = Date.now() - movieStartedAt;
    if (elapsed >= MOVIE_DURATION_MS) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [movieStartedAt]);

  const movieElapsed = movieStartedAt ? now - movieStartedAt : 0;
  const movieGenerating = Boolean(movieStartedAt) && movieElapsed < MOVIE_DURATION_MS;
  const movieReady = Boolean(movieStartedAt) && movieElapsed >= MOVIE_DURATION_MS;

  return (
    <nav className="flex items-center gap-0.5">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const showDot =
          tab.id === "movie" && (movieGenerating || (movieReady && activeTab !== "movie"));
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative whitespace-nowrap rounded-full px-3 py-1.5 text-[12px] font-medium transition ${
              isActive
                ? "bg-neutral-950 text-white"
                : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
            }`}
            type="button"
          >
            <span className="inline-flex items-center gap-1.5">
              {tab.label}
              {showDot && (
                <span
                  className={`inline-block h-1.5 w-1.5 rounded-full ${
                    movieGenerating ? "animate-pulse bg-amber-400" : "bg-emerald-500"
                  }`}
                />
              )}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
