import type { CorrectionSceneData, PracticePrompt } from "@/lib/types";

export const demoCorrectionScene: CorrectionSceneData = {
  id: "objective-vs-opinion-reporting",
  title: "Objective vs Opinion-Based Reporting",
  template: "report_comparison",
  wrongChoice: {
    label: "Your choice",
    text: "The victim looked kooky and might cry.",
    tags: ["Personal opinion", "Irrelevant detail", "Unprofessional wording"]
  },
  correctChoice: {
    label: "Better report sentence",
    text: "Mrs. Meredith reported her purse was stolen at 1116.",
    tags: ["Objective fact", "Relevant detail", "Time included"]
  },
  lesson: "Professional reports should include facts, not personal opinions or guesses.",
  sourceReference: "Module Five: Documentation and Evidence, Report Writing Guidelines."
};

export const demoPracticePrompt: PracticePrompt = {
  id: "practice-professional-report-sentence",
  title: "Practice: Choose the professional report sentence",
  prompt: "You are writing an incident report. Which sentence should you include?",
  options: [
    "A. The woman looked strange and seemed upset.",
    "B. Mrs. Meredith reported that her purse was stolen at 1116.",
    "C. The police took too long to arrive.",
    "D. The suspect probably drove a GM truck because those are common."
  ],
  correctAnswer: "B. Mrs. Meredith reported that her purse was stolen at 1116.",
  feedback: "Correct. This sentence is objective, relevant, and includes a specific time.",
  testedConcept: "Objective report writing"
};
