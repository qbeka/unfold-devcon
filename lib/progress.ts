import type { ProgressState } from "@/lib/types";

export function addWeakArea(progress: ProgressState, weakArea: string): ProgressState {
  if (progress.weakAreas.includes(weakArea)) {
    return {
      ...progress,
      readinessScore: Math.max(60, progress.readinessScore - 2)
    };
  }

  return {
    ...progress,
    readinessScore: Math.max(60, progress.readinessScore - 2),
    weakAreas: [...progress.weakAreas, weakArea]
  };
}

export function completePracticeProgress(
  progress: ProgressState,
  testedConcept: string
): ProgressState {
  const improvedAreas = progress.improvedAreas.includes(testedConcept)
    ? progress.improvedAreas
    : [...progress.improvedAreas, testedConcept];

  const recommendations = progress.recommendations.includes(
    "Continue with report completeness questions."
  )
    ? progress.recommendations
    : [...progress.recommendations, "Continue with report completeness questions."];

  return {
    ...progress,
    readinessScore: Math.max(78, progress.readinessScore + 10),
    weakAreas: progress.weakAreas.filter((area) => area !== testedConcept),
    improvedAreas,
    recommendations
  };
}
