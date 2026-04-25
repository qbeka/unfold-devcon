"use client";

import {
  BookOpen,
  ChartNoAxesColumnIncreasing,
  Clapperboard,
  MessageSquareText,
  Rotate3D,
  ScrollText
} from "lucide-react";
import { useUnfoldStore } from "@/lib/store";
import type { AppTab } from "@/lib/types";

const tabs: { id: AppTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "read", label: "Read", icon: BookOpen },
  { id: "exam", label: "Exam", icon: ScrollText },
  { id: "corrections", label: "Corrections", icon: Rotate3D },
  { id: "discussion", label: "Discussion", icon: MessageSquareText },
  { id: "movie", label: "Movie", icon: Clapperboard },
  { id: "progress", label: "Progress", icon: ChartNoAxesColumnIncreasing }
];

export function TabNav() {
  const activeTab = useUnfoldStore((state) => state.activeTab);
  const setActiveTab = useUnfoldStore((state) => state.setActiveTab);

  return (
    <nav className="grid grid-cols-2 gap-1.5 lg:grid-cols-1">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2.5 rounded-2xl px-3 py-2.5 text-left text-sm font-semibold ${
              isActive
                ? "bg-slate-950 text-white shadow-sm"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-950"
            }`}
            type="button"
          >
            <Icon className="h-4 w-4" />
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
