"use client";

import { useUnfoldStore } from "@/lib/store";
import type { ExamQuestion } from "@/lib/types";

export function QuestionCard({ question }: { question: ExamQuestion }) {
  const selectedAnswer = useUnfoldStore((state) => state.selectedAnswer);
  const selectAnswer = useUnfoldStore((state) => state.selectAnswer);

  return (
    <div className="space-y-5">
      <p className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-slate-400">
        {question.difficulty} · {question.testedConcept}
      </p>
      <h2 className="text-[1.4rem] font-semibold tracking-[-0.02em] text-slate-950">
        {question.question}
      </h2>
      <div className="space-y-2">
        {question.options.map((option) => {
          const isSelected = selectedAnswer === option;
          return (
            <button
              key={option}
              className={`flex w-full items-center justify-between gap-4 rounded-2xl border px-4 py-3 text-left text-sm transition ${
                isSelected
                  ? "border-slate-950 bg-slate-950 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              }`}
              onClick={() => selectAnswer(option)}
              type="button"
            >
              <span className="font-medium">{option}</span>
              <span
                className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border ${
                  isSelected ? "border-white/40 bg-white" : "border-slate-300"
                }`}
              >
                {isSelected && <span className="block h-2 w-2 rounded-full bg-slate-950" />}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
