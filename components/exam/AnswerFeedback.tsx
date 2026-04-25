"use client";

import { AlertTriangle, CheckCircle2, Cuboid } from "lucide-react";
import { useUnfoldStore } from "@/lib/store";
import { buttonPrimary, buttonSecondary } from "@/lib/ui";
import type { AnswerAttempt, ExamQuestion } from "@/lib/types";

export function AnswerFeedback({
  question,
  attempt
}: {
  question: ExamQuestion;
  attempt: AnswerAttempt;
}) {
  const openCorrectionScene = useUnfoldStore((state) => state.openCorrectionScene);

  return (
    <div
      className={`rounded-3xl border p-6 ${
        attempt.correct ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"
      }`}
    >
      <div className="flex items-start gap-3">
        {attempt.correct ? (
          <CheckCircle2 className="mt-1 h-5 w-5 text-emerald-700" />
        ) : (
          <AlertTriangle className="mt-1 h-5 w-5 text-amber-700" />
        )}
        <div>
          <h3 className="text-lg font-bold text-slate-950">
            {attempt.correct ? "Correct" : "Review this concept"}
          </h3>
          <p className="mt-2 leading-7 text-slate-700">{question.explanation}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <Info label="Correct answer" value={question.correctAnswer} />
        <Info label="Tested concept" value={question.testedConcept} />
        <Info label="Common mistake" value={question.commonMistake} />
      </div>

      <p className="mt-5 rounded-2xl bg-white/70 px-4 py-3 text-sm font-medium text-slate-700">
        Source reference: {question.sourceReference}
      </p>

      {!attempt.correct && question.sceneCandidate && (
        <div className="mt-5 flex flex-wrap gap-3">
          <button className={buttonPrimary} onClick={openCorrectionScene} type="button">
            <Cuboid className="mr-2 h-4 w-4" />
            View 3D Correction
          </button>
          <button className={buttonSecondary} onClick={openCorrectionScene} type="button">
            Open Practice Activity
          </button>
        </div>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/70 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-semibold leading-6 text-slate-900">{value}</p>
    </div>
  );
}
