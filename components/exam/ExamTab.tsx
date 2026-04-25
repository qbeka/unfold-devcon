"use client";

import { ArrowLeft, ArrowRight, Check, RotateCcw, X } from "lucide-react";
import { AnswerFeedback } from "@/components/exam/AnswerFeedback";
import { ExamModeSelector } from "@/components/exam/ExamModeSelector";
import { OpenBookPanel } from "@/components/exam/OpenBookPanel";
import { QuestionCard } from "@/components/exam/QuestionCard";
import { useUnfoldStore } from "@/lib/store";
import { buttonPrimary, buttonGhost, buttonSecondary, eyebrow, helperText, sectionTitle } from "@/lib/ui";

export function ExamTab() {
  const examMode = useUnfoldStore((state) => state.examMode);
  const examQuestions = useUnfoldStore((state) => state.examQuestions);
  const currentQuestionIndex = useUnfoldStore((state) => state.currentQuestionIndex);
  const selections = useUnfoldStore((state) => state.selections);
  const attempts = useUnfoldStore((state) => state.attempts);
  const submitAnswer = useUnfoldStore((state) => state.submitAnswer);
  const setCurrentQuestionIndex = useUnfoldStore((state) => state.setCurrentQuestionIndex);
  const retryQuestion = useUnfoldStore((state) => state.retryQuestion);
  const retakeExam = useUnfoldStore((state) => state.retakeExam);

  const question = examQuestions[currentQuestionIndex] ?? examQuestions[0];
  const attempt = attempts.find((item) => item.questionId === question?.id);
  const examFinished = attempts.length === examQuestions.length;
  const selectedAnswer = attempt?.selectedAnswer ?? selections[question?.id ?? ""];

  if (!question) {
    return <p className={helperText}>No questions ready.</p>;
  }

  const questionPanel = (
    <div className="space-y-5">
      <QuestionCard question={question} />
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1">
          <button
            className={buttonGhost}
            disabled={currentQuestionIndex === 0}
            onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
            type="button"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Previous
          </button>
          <button
            className={buttonGhost}
            disabled={currentQuestionIndex === examQuestions.length - 1}
            onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
            type="button"
          >
            Next <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
        {attempt ? (
          <button
            className={buttonSecondary}
            onClick={() => retryQuestion(question.id)}
            type="button"
            title="Clear this answer and try again"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Retry question
          </button>
        ) : (
          <button
            className={buttonPrimary}
            disabled={!selectedAnswer}
            onClick={submitAnswer}
            type="button"
          >
            Submit answer
          </button>
        )}
      </div>
      {attempt && <AnswerFeedback attempt={attempt} question={question} />}
    </div>
  );

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <p className={eyebrow}>Exam</p>
        <h1 className={sectionTitle}>Module Five practice</h1>
        <p className={helperText}>
          Answer all {examQuestions.length} questions. Submitting locks the answer until you retry
          or retake the exam.
        </p>
        <ExamModeSelector />
        <ProgressDots count={examQuestions.length} attempts={attempts} currentIndex={currentQuestionIndex} onJump={setCurrentQuestionIndex} />
      </header>

      {examFinished ? (
        <ResultsScreen
          questions={examQuestions}
          attempts={attempts}
          onRetake={retakeExam}
          onJumpTo={(idx) => {
            setCurrentQuestionIndex(idx);
          }}
          onRetry={(id) => retryQuestion(id)}
        />
      ) : examMode === "open_book" ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          {questionPanel}
          <OpenBookPanel />
        </div>
      ) : (
        questionPanel
      )}
    </div>
  );
}

function ProgressDots({
  count,
  attempts,
  currentIndex,
  onJump
}: {
  count: number;
  attempts: { questionId: string; correct: boolean }[];
  currentIndex: number;
  onJump: (idx: number) => void;
}) {
  const examQuestions = useUnfoldStore.getState().examQuestions;
  return (
    <div className="flex items-center gap-1.5 pt-1">
      {Array.from({ length: count }).map((_, i) => {
        const q = examQuestions[i];
        const a = attempts.find((x) => x.questionId === q?.id);
        const isCurrent = i === currentIndex;
        const cls = a
          ? a.correct
            ? "bg-emerald-500"
            : "bg-amber-500"
          : isCurrent
          ? "bg-neutral-950"
          : "bg-neutral-300";
        return (
          <button
            key={i}
            type="button"
            onClick={() => onJump(i)}
            aria-label={`Go to question ${i + 1}`}
            className={`h-1.5 w-7 rounded-full ${cls} transition`}
          />
        );
      })}
    </div>
  );
}

function ResultsScreen({
  questions,
  attempts,
  onRetake,
  onJumpTo,
  onRetry
}: {
  questions: { id: string; question: string; correctAnswer: string; explanation: string; testedConcept: string }[];
  attempts: { questionId: string; selectedAnswer: string; correct: boolean }[];
  onRetake: () => void;
  onJumpTo: (idx: number) => void;
  onRetry: (id: string) => void;
}) {
  const correct = attempts.filter((a) => a.correct).length;
  const total = questions.length;
  const ratio = Math.round((correct / total) * 100);
  const wrongs = attempts.filter((a) => !a.correct);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-black/10 bg-white p-6">
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-400">Results</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[44px] font-semibold leading-none tracking-tighter2 text-neutral-950">
              {correct}<span className="text-neutral-300">/{total}</span>
            </p>
            <p className="mt-2 text-[13px] text-neutral-500">{ratio}% correct on this exam</p>
          </div>
          <button className={buttonPrimary} onClick={onRetake} type="button">
            <RotateCcw className="h-3.5 w-3.5" />
            Retake exam
          </button>
        </div>
      </section>

      {wrongs.length > 0 ? (
        <section className="space-y-2">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-400">
            Review what you missed
          </p>
          {wrongs.map((a) => {
            const q = questions.find((qq) => qq.id === a.questionId)!;
            const idx = questions.findIndex((qq) => qq.id === a.questionId);
            return (
              <article key={q.id} className="rounded-xl border border-black/10 bg-white p-4">
                <p className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-amber-700">
                  <X className="h-3 w-3" /> Question {idx + 1} · {q.testedConcept}
                </p>
                <h3 className="mt-2 text-[15px] font-semibold text-neutral-950">{q.question}</h3>
                <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div>
                    <dt className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-400">
                      Your answer
                    </dt>
                    <dd className="mt-1 text-[13px] text-amber-900">{a.selectedAnswer}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-400">
                      Correct
                    </dt>
                    <dd className="mt-1 text-[13px] text-emerald-900">{q.correctAnswer}</dd>
                  </div>
                </dl>
                <p className="mt-3 text-[13px] leading-6 text-neutral-600">{q.explanation}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button className={buttonSecondary} onClick={() => onRetry(q.id)} type="button">
                    <RotateCcw className="h-3.5 w-3.5" />
                    Retry this question
                  </button>
                  <button className={buttonGhost} onClick={() => onJumpTo(idx)} type="button">
                    Jump to question <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      ) : (
        <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="flex items-center gap-2 text-[13px] font-medium text-emerald-900">
            <Check className="h-4 w-4" />
            Perfect run. Try a longer exam or open-book mode next.
          </p>
        </section>
      )}
    </div>
  );
}
