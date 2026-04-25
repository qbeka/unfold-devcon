"use client";

import { useUnfoldStore } from "@/lib/store";
import type { ExamQuestion } from "@/lib/types";

export function QuestionCard({ question }: { question: ExamQuestion }) {
  const selection = useUnfoldStore((state) => state.selections[question.id]);
  const attempt = useUnfoldStore((state) => state.attempts.find((a) => a.questionId === question.id));
  const selectAnswerFor = useUnfoldStore((state) => state.selectAnswerFor);

  const locked = Boolean(attempt);
  const currentValue = attempt?.selectedAnswer ?? selection;

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
          const isSelected = currentValue === option;
          const isCorrectAnswer = locked && option === question.correctAnswer;
          const isWrongPick = locked && attempt?.selectedAnswer === option && !attempt.correct;

          let className =
            "group flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-[14px] transition";
          if (isCorrectAnswer) {
            className += " border-emerald-300 bg-emerald-50 text-emerald-950";
          } else if (isWrongPick) {
            className += " border-amber-300 bg-amber-50 text-amber-950";
          } else if (isSelected) {
            className += " border-neutral-950 bg-neutral-950 text-white";
          } else {
            className += " border-black/10 bg-white text-neutral-700 hover:border-black/20";
          }
          if (locked) className += " cursor-default";

          return (
            <button
              key={option}
              className={className}
              onClick={() => !locked && selectAnswerFor(question.id, option)}
              type="button"
              disabled={locked}
            >
              <span
                className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border ${
                  isSelected && !locked ? "border-white/40" : "border-neutral-300"
                }`}
              >
                {(isSelected || isCorrectAnswer) && (
                  <span className="block h-1.5 w-1.5 rounded-full bg-current" />
                )}
              </span>
              <span className="font-medium leading-5">{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
