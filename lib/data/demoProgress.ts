import type { ProgressState } from "@/lib/types";

export const defaultProgress: ProgressState = {
  readinessScore: 0,
  completedSections: [],
  weakAreas: [],
  improvedAreas: [],
  recommendations: [
    "Read Module Five: report-writing guidelines.",
    "Take the focused exam.",
    "Open any 3D correction that unlocks."
  ]
};
