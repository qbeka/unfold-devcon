import { demoQuestions } from "@/lib/data/demoQuestions";
import type { ExamQuestion } from "@/lib/types";

export function getDemoExamQuestions(questionCount = 5): ExamQuestion[] {
  return demoQuestions.slice(0, Math.max(1, Math.min(questionCount, demoQuestions.length)));
}

export function gradeAnswer(question: ExamQuestion, selectedAnswer: string) {
  return selectedAnswer === question.correctAnswer;
}
