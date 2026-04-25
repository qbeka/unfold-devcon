"use client";

import { ArrowRight, Check, X } from "lucide-react";
import { useUnfoldStore } from "@/lib/store";
import { buttonPrimary } from "@/lib/ui";
import type { AnswerAttempt, ExamQuestion } from "@/lib/types";

export function AnswerFeedback({
  attempt,
  question
}: {
  attempt: AnswerAttempt;
  question: ExamQuestion;
}) {
  const openCorrectionScene = useUnfoldStore((state) => state.openCorrectionScene);

  return (
    <section className="space-y-4 rounded-[1.25rem] border border-slate-200 bg-white p-6">
      <div className="flex items-center gap-2.5">
        <span
          className={`grid h-7 w-7 place-items-center rounded-full ${
            attempt.correct ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-800"
          }`}
        >
          {attempt.correct ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </span>
        <p className="text-sm font-semibold text-slate-950">
          {attempt.correct ? "Correct" : "Review this concept"}
        </p>
      </div>

      <p className="text-[0.95rem] leading-7 text-slate-700">{question.explanation}</p>

      <dl className="grid gap-3 sm:grid-cols-3">
        <div>
          <dt className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-slate-400">
            Correct answer
          </dt>
          <dd className="mt-1.5 text-sm font-medium text-slate-900">{question.correctAnswer}</dd>
        </div>
        <div>
          <dt className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-slate-400">
            Tested concept
          </dt>
          <dd className="mt-1.5 text-sm font-medium text-slate-900">{question.testedConcept}</dd>
        </div>
        <div>
          <dt className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-slate-400">
            Common mistake
          </dt>
          <dd className="mt-1.5 text-sm font-medium text-slate-900">{question.commonMistake}</dd>
        </div>
      </dl>

      <p className="text-xs text-slate-500">Source: {question.sourceReference}</p>

      {!attempt.correct && question.sceneCandidate && (
        <div className="pt-1">
          <button className={buttonPrimary} onClick={openCorrectionScene} type="button">
            View 3D correction
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </section>
  );
}
