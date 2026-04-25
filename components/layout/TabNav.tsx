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
    <nav className="flex items-center gap-0.5 overflow-x-auto">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative whitespace-nowrap rounded-full px-3 py-1.5 text-[12px] font-medium transition ${
              isActive ? "text-neutral-950" : "text-neutral-500 hover:text-neutral-900"
            }`}
            type="button"
          >
            {tab.label}
            {isActive && (
              <span className="absolute inset-x-3 -bottom-2 h-px bg-neutral-950" aria-hidden />
            )}
          </button>
        );
      })}
    </nav>
  );
}
