"use client";

import { useUnfoldStore } from "@/lib/store";
import type { ExamQuestion } from "@/lib/types";

export function QuestionCard({ question }: { question: ExamQuestion }) {
  const selectedAnswer = useUnfoldStore((state) => state.selectedAnswer);
  const selectAnswer = useUnfoldStore((state) => state.selectAnswer);

  return (
    <div className="space-y-5">
      <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-400">
        {question.difficulty} · {question.testedConcept}
      </p>
      <h2 className="text-[22px] font-semibold tracking-tighter2 text-neutral-950">
        {question.question}
      </h2>
      <div className="space-y-2">
        {question.options.map((option) => {
          const isSelected = selectedAnswer === option;
          return (
            <button
              key={option}
              className={`group flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-[14px] transition ${
                isSelected
                  ? "border-neutral-950 bg-neutral-950 text-white"
                  : "border-black/10 bg-white text-neutral-700 hover:border-black/20"
              }`}
              onClick={() => selectAnswer(option)}
              type="button"
            >
              <span
                className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border ${
                  isSelected ? "border-white/40" : "border-neutral-300"
                }`}
              >
                {isSelected && <span className="block h-1.5 w-1.5 rounded-full bg-white" />}
              </span>
              <span className="font-medium">{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
