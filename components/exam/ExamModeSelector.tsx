"use client";

import { useUnfoldStore } from "@/lib/store";
import type { ExamMode } from "@/lib/types";

const modes: { id: ExamMode; label: string }[] = [
  { id: "focused", label: "Focused" },
  { id: "open_book", label: "Open-book" }
];

export function ExamModeSelector() {
  const examMode = useUnfoldStore((state) => state.examMode);
  const setExamMode = useUnfoldStore((state) => state.setExamMode);
  const questionCount = useUnfoldStore((state) => state.questionCount);
  const setQuestionCount = useUnfoldStore((state) => state.setQuestionCount);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="inline-flex items-center gap-0.5 rounded-full border border-slate-200 bg-white p-0.5">
        {modes.map((mode) => (
          <button
            key={mode.id}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              examMode === mode.id ? "bg-slate-950 text-white" : "text-slate-500 hover:text-slate-950"
            }`}
            onClick={() => setExamMode(mode.id)}
            type="button"
          >
            {mode.label}
          </button>
        ))}
      </div>

      <div className="inline-flex items-center gap-0.5 rounded-full border border-slate-200 bg-white p-0.5">
        {[3, 5].map((count) => (
          <button
            key={count}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              questionCount === count
                ? "bg-slate-950 text-white"
                : "text-slate-500 hover:text-slate-950"
            }`}
            onClick={() => setQuestionCount(count)}
            type="button"
          >
            {count} questions
          </button>
        ))}
      </div>
    </div>
  );
}
