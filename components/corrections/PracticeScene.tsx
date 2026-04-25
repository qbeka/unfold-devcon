"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { demoPracticePrompt } from "@/lib/data/demoScene";
import { useUnfoldStore } from "@/lib/store";
import { buttonPrimary } from "@/lib/ui";

export function PracticeScene() {
  const [selectedAnswer, setSelectedAnswer] = useState<string>();
  const [submitted, setSubmitted] = useState(false);
  const completePractice = useUnfoldStore((state) => state.completePractice);
  const correct = selectedAnswer === demoPracticePrompt.correctAnswer;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        Interactive practice
      </p>
      <h3 className="mt-3 text-2xl font-bold text-slate-950">{demoPracticePrompt.title}</h3>
      <p className="mt-2 text-slate-600">{demoPracticePrompt.prompt}</p>

      <div className="mt-5 space-y-3">
        {demoPracticePrompt.options.map((option) => (
          <button
            key={option}
            className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left text-sm font-semibold ${
              selectedAnswer === option
                ? "border-slate-950 bg-slate-950 text-white"
                : "border-slate-200 bg-slate-50 text-slate-800 hover:bg-white"
            }`}
            onClick={() => setSelectedAnswer(option)}
            type="button"
          >
            {option}
            {selectedAnswer === option && <CheckCircle2 className="h-5 w-5" />}
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          className={buttonPrimary}
          disabled={!selectedAnswer}
          onClick={() => setSubmitted(true)}
          type="button"
        >
          Check practice answer
        </button>
        {submitted && correct && (
          <button
            className={buttonPrimary}
            onClick={() => completePractice(demoPracticePrompt.testedConcept)}
            type="button"
          >
            Complete practice
          </button>
        )}
      </div>

      {submitted && (
        <p
          className={`mt-5 rounded-2xl px-4 py-3 text-sm font-semibold ${
            correct ? "bg-emerald-50 text-emerald-900" : "bg-amber-50 text-amber-900"
          }`}
        >
          {correct
            ? demoPracticePrompt.feedback
            : "Not yet. Choose the sentence that reports a fact and includes a specific time."}
        </p>
      )}
    </div>
  );
}
