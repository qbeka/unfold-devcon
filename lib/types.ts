export type AppTab = "read" | "exam" | "corrections" | "discussion" | "movie" | "progress";

export type DocumentSection = {
  id: string;
  moduleId: string;
  title: string;
  type: "content" | "activity" | "discussion_activity" | "procedure" | "exam_concept";
  sourceReference: string;
  originalText: string;
  simplifiedText: string;
  keyTerms: string[];
  examConcepts: string[];
};

export type TrainingDocument = {
  id: string;
  title: string;
  description: string;
  modules: {
    id: string;
    title: string;
    sections: DocumentSection[];
  }[];
};

export type DocumentModuleSummary = {
  id: string;
  title: string;
  description: string;
  sourceRange: string;
  activities: string[];
  concepts: string[];
  pageStart?: number;
  pageEnd?: number;
};

export type DocumentManifest = {
  documentId: string;
  title: string;
  fileName: string;
  source: "aws" | "deterministic";
  summary: string;
  modules: DocumentModuleSummary[];
  processedAt: string;
};

export type DocumentProcessingStatus = "empty" | "uploading" | "extracting" | "parsing" | "ready" | "error";

export type ExamMode = "focused" | "open_book";

export type ExamQuestion = {
  id: string;
  moduleId: string;
  sectionId: string;
  type: "multiple_choice" | "true_false" | "scenario_judgment" | "procedure_ordering";
  difficulty: "easy" | "medium" | "hard";
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  sourceReference: string;
  testedConcept: string;
  commonMistake: string;
  sceneCandidate: boolean;
};

export type AnswerAttempt = {
  questionId: string;
  selectedAnswer: string;
  correct: boolean;
  weakConcept?: string;
};

export type CorrectionSceneData = {
  id: string;
  title: string;
  template: "report_comparison" | "decision_scenario" | "procedure_correction";
  wrongChoice: {
    label: string;
    text: string;
    tags: string[];
  };
  correctChoice: {
    label: string;
    text: string;
    tags: string[];
  };
  lesson: string;
  sourceReference: string;
};

export type PracticePrompt = {
  id: string;
  title: string;
  prompt: string;
  options: string[];
  correctAnswer: string;
  feedback: string;
  testedConcept: string;
};

export type ProgressState = {
  readinessScore: number;
  completedSections: string[];
  weakAreas: string[];
  improvedAreas: string[];
  recommendations: string[];
};

export type ExamConfig = {
  questionCount: number;
};

export type MovieStyle = "whiteboard" | "scenario" | "exam_review";

// ── Discussion Chat ──────────────────────────────────────────────────

export type ChatMessage = {
  role: "user" | "agent";
  agent?: string;
  content: string;
};

export type AgentKey = "riya" | "val" | "ben" | "dana";

export type DiscussionSummary = {
  covered: { topic: string; highlights: string[] }[];
  missed: { topic: string; detail: string; sectionId: string; sectionTitle: string }[];
};
