"use client";

import { ArrowRight, RotateCcw } from "lucide-react";
import { ReadinessCard } from "@/components/progress/ReadinessCard";
import { WeakAreasList } from "@/components/progress/WeakAreasList";
import { useUnfoldStore } from "@/lib/store";
import { buttonPrimary, buttonSecondary, eyebrow, helperText, sectionTitle } from "@/lib/ui";

export function ProgressTab() {
  const progress = useUnfoldStore((state) => state.progress);
  const attempts = useUnfoldStore((state) => state.attempts);
  const examQuestions = useUnfoldStore((state) => state.examQuestions);
  const latestWrongQuestionId = useUnfoldStore((state) => state.latestWrongQuestionId);
  const goToTriggerQuestion = useUnfoldStore((state) => state.goToTriggerQuestion);
  const setActiveTab = useUnfoldStore((state) => state.setActiveTab);
  const retakeExam = useUnfoldStore((state) => state.retakeExam);

  const totalQuestions = examQuestions.length;
  const correct = attempts.filter((a) => a.correct).length;
  const wrongQuestion = examQuestions.find((q) => q.id === latestWrongQuestionId);
  const hasUnfinishedRetry = Boolean(wrongQuestion);

  const nextAction = hasUnfinishedRetry
    ? { label: "Retry the question you missed", onClick: goToTriggerQuestion }
    : attempts.length === 0
    ? { label: "Take the focused exam", onClick: () => setActiveTab("exam") }
    : { label: "Retake the exam", onClick: retakeExam };

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-3">
          <p className={eyebrow}>Progress</p>
          <h1 className={sectionTitle}>Module Five readiness</h1>
          <p className={helperText}>
            {attempts.length === 0
              ? "Take the focused exam to start tracking your readiness."
              : `You have answered ${attempts.length} of ${totalQuestions} questions. ${correct} correct so far.`}
          </p>
        </div>
        <button className={buttonPrimary} onClick={nextAction.onClick} type="button">
          {nextAction.label}
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </header>

      <div className="grid gap-5 lg:grid-cols-[18rem_1fr]">
        <ReadinessCard score={progress.readinessScore} />
        <div className="space-y-5">
          <section className="rounded-xl border border-black/10 bg-white p-5">
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-400">
              Exam stats
            </p>
            <dl className="mt-3 grid grid-cols-3 gap-3 text-center">
              <Stat label="Answered" value={`${attempts.length}/${totalQuestions}`} />
              <Stat label="Correct" value={`${correct}`} valueClass="text-emerald-700" />
              <Stat label="Missed" value={`${attempts.length - correct}`} valueClass="text-amber-700" />
            </dl>
          </section>
          <WeakAreasList improvedAreas={progress.improvedAreas} weakAreas={progress.weakAreas} />
        </div>
      </div>

      {progress.completedSections.length > 0 && (
        <section className="rounded-xl border border-black/10 bg-white p-5">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-400">
            Completed sections
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {progress.completedSections.map((section) => (
              <span
                key={section}
                className="rounded-full border border-black/10 bg-white px-2.5 py-1 text-[11px] font-medium text-neutral-700"
              >
                {section}
              </span>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-xl border border-black/10 bg-white p-5">
        <div className="flex items-end justify-between gap-3">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-400">
            Recommendations
          </p>
          <button className={buttonSecondary} onClick={retakeExam} type="button">
            <RotateCcw className="h-3.5 w-3.5" />
            Reset exam
          </button>
        </div>
        <ul className="mt-3 space-y-1.5 text-[13px] leading-6 text-neutral-700">
          {progress.recommendations.map((r) => (
            <li key={r}>· {r}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Stat({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <div>
      <p className={`text-[24px] font-semibold tracking-tighter2 text-neutral-950 ${valueClass ?? ""}`}>
        {value}
      </p>
      <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-400">
        {label}
      </p>
    </div>
  );
}
