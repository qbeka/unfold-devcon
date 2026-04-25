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
    <section className="space-y-4 rounded-xl border border-black/10 bg-white p-5">
      <div className="flex items-center gap-2">
        <span
          className={`grid h-6 w-6 place-items-center rounded-full ${
            attempt.correct ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-800"
          }`}
        >
          {attempt.correct ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
        </span>
        <p className="text-[13px] font-medium text-neutral-950">
          {attempt.correct ? "Correct" : "Review this concept"}
        </p>
      </div>

      <p className="text-[14px] leading-7 text-neutral-700">{question.explanation}</p>

      <dl className="grid gap-3 sm:grid-cols-3">
        <Cell label="Correct answer" value={question.correctAnswer} />
        <Cell label="Tested concept" value={question.testedConcept} />
        <Cell label="Common mistake" value={question.commonMistake} />
      </dl>

      <p className="text-[12px] text-neutral-500">Source: {question.sourceReference}</p>

      {!attempt.correct && question.sceneCandidate && (
        <div>
          <button className={buttonPrimary} onClick={openCorrectionScene} type="button">
            View 3D correction
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </section>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-400">{label}</dt>
      <dd className="mt-1.5 text-[13px] font-medium leading-5 text-neutral-900">{value}</dd>
    </div>
  );
}
