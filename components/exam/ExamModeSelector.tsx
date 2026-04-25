"use client";

import { useUnfoldStore } from "@/lib/store";
import type { ExamMode } from "@/lib/types";

const modes: { id: ExamMode; label: string }[] = [
  { id: "focused", label: "Focused Exam" },
  { id: "open_book", label: "Open-Book Exam" }
];

export function ExamModeSelector() {
  const examMode = useUnfoldStore((state) => state.examMode);
  const setExamMode = useUnfoldStore((state) => state.setExamMode);
  const questionCount = useUnfoldStore((state) => state.questionCount);
  const setQuestionCount = useUnfoldStore((state) => state.setQuestionCount);

  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-3 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap gap-2">
        {modes.map((mode) => (
          <button
            key={mode.id}
            className={`rounded-2xl px-4 py-2 text-sm font-semibold ${
              examMode === mode.id
                ? "bg-slate-950 text-white"
                : "bg-white text-slate-600 hover:text-slate-950"
            }`}
            onClick={() => setExamMode(mode.id)}
            type="button"
          >
            {mode.label}
          </button>
        ))}
      </div>

      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        Question count
        <select
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950"
          onChange={(event) => setQuestionCount(Number(event.target.value))}
          value={questionCount}
        >
          <option value={3}>3</option>
          <option value={5}>5</option>
        </select>
      </label>
    </div>
  );
}
