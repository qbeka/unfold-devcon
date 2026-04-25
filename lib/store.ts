"use client";

import { create } from "zustand";
import { defaultProgress } from "@/lib/data/demoProgress";
import { demoQuestions, sceneQuestionId } from "@/lib/data/demoQuestions";
import { demoCorrectionScene } from "@/lib/data/demoScene";
import { gradeAnswer } from "@/lib/exam";
import { addWeakArea, completePracticeProgress } from "@/lib/progress";
import { demoManifest } from "@/lib/data/demoManifest";
import type { LanguageCode } from "@/lib/data/moduleFiveContent";
import type {
  AnswerAttempt,
  AppTab,
  CorrectionSceneData,
  DocumentManifest,
  DocumentProcessingStatus,
  ExamMode,
  ExamQuestion,
  ProgressState
} from "@/lib/types";

type UnfoldStore = {
  activeTab: AppTab;
  documentStatus: DocumentProcessingStatus;
  documentManifest?: DocumentManifest;
  processingError?: string;
  selectedModuleId: string;
  selectedSectionId: string;
  language: LanguageCode;
  needsLanguageChoice: boolean;
  examMode: ExamMode;
  questionCount: number;
  examQuestions: ExamQuestion[];
  currentQuestionIndex: number;
  selectedAnswer?: string;
  submittedQuestionIds: string[];
  attempts: AnswerAttempt[];
  latestWrongQuestionId?: string;
  activeCorrectionScene?: CorrectionSceneData;
  progress: ProgressState;
  setDocumentStatus: (documentStatus: DocumentProcessingStatus) => void;
  setDocumentReady: (documentManifest: DocumentManifest) => void;
  setProcessingError: (processingError: string) => void;
  setActiveTab: (tab: AppTab) => void;
  setSelectedModuleId: (moduleId: string) => void;
  setLanguage: (language: LanguageCode) => void;
  confirmLanguage: () => void;
  setExamMode: (examMode: ExamMode) => void;
  setQuestionCount: (questionCount: number) => void;
  setCurrentQuestionIndex: (index: number) => void;
  selectAnswer: (selectedAnswer: string) => void;
  submitAnswer: () => void;
  openCorrectionScene: () => void;
  completePractice: (testedConcept: string) => void;
  resetDemo: () => void;
};

const skipUpload = process.env.NEXT_PUBLIC_SKIP_UPLOAD === "true";

function shuffleQuestions(count: number): ExamQuestion[] {
  const sceneQuestion = demoQuestions.find((q) => q.id === sceneQuestionId);
  const others = demoQuestions.filter((q) => q.id !== sceneQuestionId);
  const shuffled = [...others].sort(() => Math.random() - 0.5);
  const slot = sceneQuestion ? Math.max(1, count - 1) : count;
  const picked = shuffled.slice(0, slot);
  if (sceneQuestion) {
    const insertAt = Math.floor(Math.random() * (picked.length + 1));
    picked.splice(insertAt, 0, sceneQuestion);
  }
  return picked.slice(0, count);
}

const initialQuestionCount = 5;

const initialState = {
  activeTab: "read" as AppTab,
  documentStatus: (skipUpload ? "ready" : "empty") as DocumentProcessingStatus,
  documentManifest: skipUpload ? demoManifest : undefined,
  processingError: undefined,
  selectedModuleId: "module-five",
  selectedSectionId: "report-writing-guidelines",
  language: "en" as LanguageCode,
  needsLanguageChoice: false,
  examMode: "focused" as ExamMode,
  questionCount: initialQuestionCount,
  examQuestions: shuffleQuestions(initialQuestionCount),
  currentQuestionIndex: 0,
  selectedAnswer: undefined,
  submittedQuestionIds: [],
  attempts: [],
  latestWrongQuestionId: undefined,
  activeCorrectionScene: undefined,
  progress: defaultProgress
};

export const useUnfoldStore = create<UnfoldStore>((set, get) => ({
  ...initialState,
  setDocumentStatus: (documentStatus) => set({ documentStatus, processingError: undefined }),
  setDocumentReady: (documentManifest) =>
    set({
      documentManifest,
      documentStatus: "ready",
      selectedModuleId: documentManifest.modules[0]?.id ?? "module-five",
      activeTab: "read",
      processingError: undefined,
      needsLanguageChoice: true
    }),
  setProcessingError: (processingError) => set({ processingError, documentStatus: "error" }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setSelectedModuleId: (selectedModuleId) =>
    set({
      selectedModuleId,
      selectedSectionId:
        selectedModuleId === "module-five" ? "report-writing-guidelines" : "module-overview",
      activeTab: "read"
    }),
  setLanguage: (language) => set({ language }),
  confirmLanguage: () => set({ needsLanguageChoice: false }),
  setExamMode: (examMode) => set({ examMode }),
  setQuestionCount: (questionCount) =>
    set({
      questionCount,
      examQuestions: shuffleQuestions(questionCount),
      currentQuestionIndex: 0,
      selectedAnswer: undefined,
      submittedQuestionIds: [],
      attempts: []
    }),
  setCurrentQuestionIndex: (currentQuestionIndex) =>
    set({ currentQuestionIndex, selectedAnswer: undefined }),
  selectAnswer: (selectedAnswer) => set({ selectedAnswer }),
  submitAnswer: () => {
    const state = get();
    const question = state.examQuestions[state.currentQuestionIndex];

    if (!question || !state.selectedAnswer) return;

    const correct = gradeAnswer(question, state.selectedAnswer);
    const attempt: AnswerAttempt = {
      questionId: question.id,
      selectedAnswer: state.selectedAnswer,
      correct,
      weakConcept: correct ? undefined : question.testedConcept
    };

    set({
      attempts: [...state.attempts, attempt],
      submittedQuestionIds: Array.from(new Set([...state.submittedQuestionIds, question.id])),
      latestWrongQuestionId: correct ? state.latestWrongQuestionId : question.id,
      activeCorrectionScene:
        !correct && question.id === sceneQuestionId ? demoCorrectionScene : state.activeCorrectionScene,
      progress: correct
        ? {
            ...state.progress,
            readinessScore: Math.min(100, state.progress.readinessScore + 1)
          }
        : addWeakArea(state.progress, question.testedConcept)
    });
  },
  openCorrectionScene: () => {
    const state = get();
    if (state.latestWrongQuestionId === sceneQuestionId) {
      set({ activeCorrectionScene: demoCorrectionScene, activeTab: "corrections" });
      return;
    }
    set({ activeTab: "corrections" });
  },
  completePractice: (testedConcept) =>
    set((state) => ({
      progress: completePracticeProgress(state.progress, testedConcept),
      activeTab: "progress"
    })),
  resetDemo: () =>
    set({
      ...initialState,
      examQuestions: shuffleQuestions(initialQuestionCount),
      documentManifest: skipUpload ? demoManifest : undefined,
      documentStatus: skipUpload ? "ready" : "empty",
      needsLanguageChoice: false,
      progress: { ...defaultProgress }
    })
}));
