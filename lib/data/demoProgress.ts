import type { ProgressState } from "@/lib/types";

export const defaultProgress: ProgressState = {
  readinessScore: 68,
  completedSections: ["Report Writing Guidelines"],
  weakAreas: [
    "Objective report writing",
    "Removing personal opinion from reports",
    "Identifying relevant details"
  ],
  improvedAreas: [],
  recommendations: [
    "Review Module Five report-writing guidelines.",
    "Take a focused exam on objective reporting.",
    "Practice the 3D correction scene."
  ]
};
