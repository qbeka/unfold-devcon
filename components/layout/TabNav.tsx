"use client";

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

export function TabNav() {
  const activeTab = useUnfoldStore((state) => state.activeTab);
  const setActiveTab = useUnfoldStore((state) => state.setActiveTab);

  return (
    <nav className="flex items-center gap-1 overflow-x-auto">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
              isActive ? "text-slate-950" : "text-slate-500 hover:text-slate-900"
            }`}
            type="button"
          >
            {tab.label}
            {isActive && (
              <span className="absolute inset-x-3 -bottom-2 h-px bg-slate-950" aria-hidden />
            )}
          </button>
        );
      })}
    </nav>
  );
}
