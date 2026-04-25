"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { AnswerFeedback } from "@/components/exam/AnswerFeedback";
import { ExamModeSelector } from "@/components/exam/ExamModeSelector";
import { OpenBookPanel } from "@/components/exam/OpenBookPanel";
import { QuestionCard } from "@/components/exam/QuestionCard";
import { useUnfoldStore } from "@/lib/store";
import { buttonPrimary, buttonGhost, label, sectionHeading, helperText } from "@/lib/ui";

export function ExamTab() {
  const examMode = useUnfoldStore((state) => state.examMode);
  const examQuestions = useUnfoldStore((state) => state.examQuestions);
  const currentQuestionIndex = useUnfoldStore((state) => state.currentQuestionIndex);
  const selectedAnswer = useUnfoldStore((state) => state.selectedAnswer);
  const attempts = useUnfoldStore((state) => state.attempts);
  const submitAnswer = useUnfoldStore((state) => state.submitAnswer);
  const setCurrentQuestionIndex = useUnfoldStore((state) => state.setCurrentQuestionIndex);

  const question = examQuestions[currentQuestionIndex] ?? examQuestions[0];
  const attempt = attempts.find((item) => item.questionId === question?.id);

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
            <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Previous
          </button>
          <button
            className={buttonGhost}
            disabled={currentQuestionIndex === examQuestions.length - 1}
            onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
            type="button"
          >
            Next <ArrowRight className="ml-1 h-3.5 w-3.5" />
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
    <div className="space-y-8">
      <header className="space-y-3">
        <p className={label}>Exam</p>
        <h1 className={sectionHeading}>Module Five practice</h1>
        <p className={helperText}>
          Question {currentQuestionIndex + 1} of {examQuestions.length}. Choose an answer, then
          submit. Wrong answers route through a 3D correction.
        </p>
        <ExamModeSelector />
      </header>

      <div className={examMode === "open_book" ? "grid gap-6 lg:grid-cols-[1fr_22rem]" : ""}>
        {questionPanel}
        {examMode === "open_book" && <OpenBookPanel />}
      </div>
    </div>
  );
}
