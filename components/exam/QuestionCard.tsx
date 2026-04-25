"use client";

import { CheckCircle2 } from "lucide-react";
import { useUnfoldStore } from "@/lib/store";
import type { ExamQuestion } from "@/lib/types";

export function QuestionCard({ question }: { question: ExamQuestion }) {
  const selectedAnswer = useUnfoldStore((state) => state.selectedAnswer);
  const selectAnswer = useUnfoldStore((state) => state.selectAnswer);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {question.difficulty} · {question.type.replace("_", " ")}
      </p>
      <h3 className="mt-3 text-xl font-semibold tracking-[-0.02em] text-slate-950">
        {question.question}
      </h3>

      <div className="mt-5 space-y-2.5">
        {question.options.map((option) => {
          const isSelected = selectedAnswer === option;

          return (
            <button
              key={option}
              className={`flex w-full items-start justify-between gap-4 rounded-2xl border p-3.5 text-left text-sm font-semibold ${
                isSelected
                  ? "border-slate-950 bg-slate-950 text-white"
                  : "border-slate-200 bg-slate-50 text-slate-800 hover:border-slate-300 hover:bg-white"
              }`}
              onClick={() => selectAnswer(option)}
              type="button"
            >
              <span>{option}</span>
              {isSelected && <CheckCircle2 className="h-5 w-5 shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
