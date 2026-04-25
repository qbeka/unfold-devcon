import type { CorrectionSceneData, PracticePrompt } from "@/lib/types";

// Both the correction scene and the practice scene tell the same story:
// a woman in a blue jacket slips on an unmarked wet patch in a hotel lobby
// at 14:30 and reports pain in her right ankle. The exam concept being
// taught is objective vs opinion-based incident reporting.

export const incidentTime = "14:30";
export const incidentLocation = "Prairie Suites Hotel — main lobby, near the front desk";

export const factualReport =
  "At 14:30, an adult woman wearing a blue jacket slipped on an unmarked wet area on the marble floor near the front desk and stated that her right ankle hurt.";

export const opinionReport =
  "Some clumsy lady fell in the lobby. She was probably trying to get attention so she would not have to pay her bill.";

export const demoCorrectionScene: CorrectionSceneData = {
  id: "objective-vs-opinion-slip",
  title: "Objective vs Opinion-Based Reporting",
  template: "report_comparison",
  wrongChoice: {
    label: "Your choice · opinion",
    text: opinionReport,
    tags: ["Personal opinion", "Irrelevant detail", "No time", "Unprofessional"]
  },
  correctChoice: {
    label: "Better report sentence",
    text: factualReport,
    tags: ["Time", "Location", "Description", "Stated injury"]
  },
  lesson: "Professional reports should record observed facts only — time, location, description, and what the person said.",
  sourceReference: "Module Five: Documentation and Evidence, Report Writing Guidelines."
};

export const demoPracticePrompt: PracticePrompt = {
  id: "practice-slip-report",
  title: "Practice: write the slip report",
  prompt:
    "You are patrolling the main lobby of the Prairie Suites Hotel at 14:30. A woman wearing a blue jacket walks across the marble floor near the front desk, slips on a wet area where housekeeping has not yet placed a sign, and falls onto her right side. She tells you her ankle hurts. Speak the sentence you would write in your incident report.",
  options: [factualReport, opinionReport],
  correctAnswer: factualReport,
  feedback: "Correct. Objective, time-stamped, and grounded in what you observed.",
  testedConcept: "Objective report writing"
};
