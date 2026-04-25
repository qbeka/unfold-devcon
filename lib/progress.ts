import type { AnswerAttempt, ExamQuestion, ProgressState } from "@/lib/types";

export function recomputeReadiness(
  progress: ProgressState,
  attempts: AnswerAttempt[],
  totalQuestions: number
): ProgressState {
  if (attempts.length === 0) {
    return { ...progress, readinessScore: 0 };
  }
  const correct = attempts.filter((a) => a.correct).length;
  const denominator = Math.max(totalQuestions, attempts.length);
  const ratio = correct / denominator;
  const score = Math.round(ratio * 100);
  return { ...progress, readinessScore: score };
}

export function computeWeakAreas(
  attempts: AnswerAttempt[],
  questions: ExamQuestion[]
): { weakAreas: string[]; improvedAreas: string[] } {
  const wrongConcepts = new Set<string>();
  const correctConcepts = new Set<string>();
  for (const attempt of attempts) {
    const q = questions.find((x) => x.id === attempt.questionId);
    if (!q) continue;
    if (attempt.correct) correctConcepts.add(q.testedConcept);
    else wrongConcepts.add(q.testedConcept);
  }
  const weakAreas = Array.from(wrongConcepts);
  // A concept is "improved" if it was previously wrong and the latest attempt is correct.
  // Since attempts.length grows, we walk attempts and keep latest per question.
  const latest: Record<string, AnswerAttempt> = {};
  for (const a of attempts) latest[a.questionId] = a;
  const improvedConcepts = new Set<string>();
  for (const q of questions) {
    const a = latest[q.id];
    if (!a) continue;
    if (a.correct) {
      // Check if there was an earlier wrong attempt for the same question.
      const earlierWrong = attempts.some((x) => x.questionId === q.id && !x.correct);
      if (earlierWrong) improvedConcepts.add(q.testedConcept);
    }
  }
  return {
    weakAreas: weakAreas.filter((c) => !improvedConcepts.has(c)),
    improvedAreas: Array.from(improvedConcepts)
  };
}

export function recommendationsFor(progress: ProgressState, attempts: AnswerAttempt[]): string[] {
  if (attempts.length === 0) {
    return [
      "Read Module Five: report-writing guidelines.",
      "Take the focused exam.",
      "Open any 3D correction that unlocks."
    ];
  }
  const correct = attempts.filter((a) => a.correct).length;
  if (correct === attempts.length) {
    return [
      "Excellent. Re-read Module Five to lock in the language.",
      "Take a longer focused exam to build streaks.",
      "Try open-book mode to compare wording side-by-side."
    ];
  }
  return [
    "Re-read the Module Five report-writing guidelines.",
    "Retake the questions you missed.",
    "Practice each opinion-vs-fact correction in 3D."
  ];
}

export function applyExamUpdate(
  progress: ProgressState,
  attempts: AnswerAttempt[],
  questions: ExamQuestion[]
): ProgressState {
  const { weakAreas, improvedAreas } = computeWeakAreas(attempts, questions);
  const next = recomputeReadiness(progress, attempts, questions.length);
  return {
    ...next,
    weakAreas,
    improvedAreas,
    recommendations: recommendationsFor(next, attempts)
  };
}
