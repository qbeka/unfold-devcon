"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { AnswerFeedback } from "@/components/exam/AnswerFeedback";
import { ExamModeSelector } from "@/components/exam/ExamModeSelector";
import { OpenBookPanel } from "@/components/exam/OpenBookPanel";
import { QuestionCard } from "@/components/exam/QuestionCard";
import { getDemoExamQuestions } from "@/lib/exam";
import { useUnfoldStore } from "@/lib/store";
import { buttonPrimary, buttonSecondary, card, label } from "@/lib/ui";

export function ExamTab() {
  const examMode = useUnfoldStore((state) => state.examMode);
  const questionCount = useUnfoldStore((state) => state.questionCount);
  const currentQuestionIndex = useUnfoldStore((state) => state.currentQuestionIndex);
  const selectedAnswer = useUnfoldStore((state) => state.selectedAnswer);
  const attempts = useUnfoldStore((state) => state.attempts);
  const submitAnswer = useUnfoldStore((state) => state.submitAnswer);
  const setCurrentQuestionIndex = useUnfoldStore((state) => state.setCurrentQuestionIndex);

  const questions = getDemoExamQuestions(questionCount);
  const question = questions[currentQuestionIndex] ?? questions[0];
  const attempt = attempts.find((item) => item.questionId === question.id);

  const questionPanel = (
    <div className="space-y-4">
      <QuestionCard question={question} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            className={buttonSecondary}
            disabled={currentQuestionIndex === 0}
            onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
            type="button"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </button>
          <button
            className={buttonSecondary}
            disabled={currentQuestionIndex === questions.length - 1}
            onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
            type="button"
          >
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
        <button
          className={buttonPrimary}
          disabled={!selectedAnswer || Boolean(attempt)}
          onClick={submitAnswer}
          type="button"
        >
          Submit answer
        </button>
      </div>
      {attempt && <AnswerFeedback attempt={attempt} question={question} />}
    </div>
  );

  return (
    <div className={`${card} p-5 lg:p-6`}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className={label}>Module Five exam</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
            Focused certification practice
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <ExamModeSelector />
      </div>

      <div className={examMode === "open_book" ? "mt-5 grid gap-5 xl:grid-cols-[1fr_22rem]" : "mt-5"}>
        {questionPanel}
        {examMode === "open_book" && <OpenBookPanel />}
      </div>
    </div>
  );
}
