import type { ExamQuestion } from "@/lib/types";

export const demoQuestions: ExamQuestion[] = [
  {
    id: "q-objective-report-sentence",
    moduleId: "module-five",
    sectionId: "report-writing-guidelines",
    type: "multiple_choice",
    difficulty: "medium",
    question: "Which sentence should not appear in a professional incident report?",
    options: [
      "A. Mrs. Meredith reported her purse was stolen.",
      "B. Police arrived at 1151.",
      "C. The victim looked kooky and might cry.",
      "D. The incident occurred at Prairie Mall."
    ],
    correctAnswer: "C. The victim looked kooky and might cry.",
    explanation:
      "This sentence includes personal opinion and irrelevant detail. A professional incident report should include objective facts, not judgments about how someone looks or behaves.",
    sourceReference: "Module Five: Documentation and Evidence, Report Writing Guidelines.",
    testedConcept: "Objective report writing",
    commonMistake:
      "Thinking that extra personal description makes a report better, even when the detail is opinion-based or irrelevant.",
    sceneCandidate: true
  },
  {
    id: "q-report-detail",
    moduleId: "module-five",
    sectionId: "report-writing-guidelines",
    type: "multiple_choice",
    difficulty: "easy",
    question: "Which detail is most useful in an incident report?",
    options: [
      "A. The exact time the purse was reported stolen.",
      "B. The guard's opinion about the victim's mood.",
      "C. A guess about the suspect's personality.",
      "D. A comment about unrelated mall traffic."
    ],
    correctAnswer: "A. The exact time the purse was reported stolen.",
    explanation:
      "Specific times help readers understand what happened and when. Useful reports prioritize relevant facts.",
    sourceReference: "Module Five: Documentation and Evidence, Report Writing Guidelines.",
    testedConcept: "Using relevant details",
    commonMistake: "Adding extra description that does not help explain the incident.",
    sceneCandidate: false
  },
  {
    id: "q-chronological-order",
    moduleId: "module-five",
    sectionId: "report-writing-guidelines",
    type: "multiple_choice",
    difficulty: "easy",
    question: "How should events usually be organized in a report?",
    options: [
      "A. From most dramatic to least dramatic.",
      "B. In the order they occurred.",
      "C. By the writer's personal opinion.",
      "D. With the conclusion first and no timeline."
    ],
    correctAnswer: "B. In the order they occurred.",
    explanation:
      "Chronological order makes it easier for a reader to understand the sequence of events.",
    sourceReference: "Module Five: Documentation and Evidence, Report Writing Guidelines.",
    testedConcept: "Organizing events chronologically",
    commonMistake: "Writing the report as a reaction instead of a clear sequence.",
    sceneCandidate: false
  },
  {
    id: "q-notebook-source",
    moduleId: "module-five",
    sectionId: "report-writing-guidelines",
    type: "multiple_choice",
    difficulty: "medium",
    question: "Why should a security guard refer to a notebook when writing a report?",
    options: [
      "A. To add opinions that sound more detailed.",
      "B. To include relevant details accurately.",
      "C. To make the report longer.",
      "D. To avoid naming the source of information."
    ],
    correctAnswer: "B. To include relevant details accurately.",
    explanation:
      "A notebook helps confirm times, observations, and reported facts before the final report is written.",
    sourceReference: "Module Five: Documentation and Evidence, Report Writing Guidelines.",
    testedConcept: "Accurate report writing",
    commonMistake: "Relying on memory when written notes are available.",
    sceneCandidate: false
  },
  {
    id: "q-who-what-where",
    moduleId: "module-five",
    sectionId: "report-writing-guidelines",
    type: "multiple_choice",
    difficulty: "medium",
    question: "Which set of information best supports a complete incident report?",
    options: [
      "A. Who, what, where, when, why, and how.",
      "B. Rumours, opinions, guesses, and insults.",
      "C. Only the final outcome.",
      "D. Only the names of police officers."
    ],
    correctAnswer: "A. Who, what, where, when, why, and how.",
    explanation:
      "Complete reports include the essential facts a reader needs to understand the incident.",
    sourceReference: "Module Five: Documentation and Evidence, Report Writing Guidelines.",
    testedConcept: "Report completeness",
    commonMistake: "Leaving out important context because the writer assumes it is obvious.",
    sceneCandidate: false
  }
];

export const sceneQuestionId = "q-objective-report-sentence";
