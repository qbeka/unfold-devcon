"use client";

import { create } from "zustand";
import { defaultProgress } from "@/lib/data/demoProgress";
import { demoQuestions, sceneQuestionId } from "@/lib/data/demoQuestions";
import { demoCorrectionScene } from "@/lib/data/demoScene";
import { gradeAnswer } from "@/lib/exam";
import { addWeakArea, completePracticeProgress } from "@/lib/progress";
import type {
  AnswerAttempt,
  AppTab,
  CorrectionSceneData,
  DocumentManifest,
  DocumentProcessingStatus,
  ExamMode,
  LanguageMode,
  ProgressState
} from "@/lib/types";
import { demoManifest } from "@/lib/data/demoManifest";

type UnfoldStore = {
  activeTab: AppTab;
  documentStatus: DocumentProcessingStatus;
  documentManifest?: DocumentManifest;
  processingError?: string;
  selectedModuleId: string;
  selectedSectionId: string;
  languageMode: LanguageMode;
  examMode: ExamMode;
  questionCount: number;
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
  setLanguageMode: (languageMode: LanguageMode) => void;
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

const initialState = {
  activeTab: "read" as AppTab,
  documentStatus: (skipUpload ? "ready" : "empty") as DocumentProcessingStatus,
  documentManifest: skipUpload ? demoManifest : undefined,
  processingError: undefined,
  selectedModuleId: "module-five",
  selectedSectionId: "report-writing-guidelines",
  languageMode: "original" as LanguageMode,
  examMode: "focused" as ExamMode,
  questionCount: 5,
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
      processingError: undefined
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
  setLanguageMode: (languageMode) => set({ languageMode }),
  setExamMode: (examMode) => set({ examMode }),
  setQuestionCount: (questionCount) =>
    set({
      questionCount,
      currentQuestionIndex: 0,
      selectedAnswer: undefined,
      submittedQuestionIds: [],
      attempts: [],
      latestWrongQuestionId: undefined,
      activeCorrectionScene: undefined
    }),
  setCurrentQuestionIndex: (currentQuestionIndex) =>
    set({ currentQuestionIndex, selectedAnswer: undefined }),
  selectAnswer: (selectedAnswer) => set({ selectedAnswer }),
  submitAnswer: () => {
    const state = get();
    const question = demoQuestions[state.currentQuestionIndex];

    if (!question || !state.selectedAnswer) {
      return;
    }

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
      documentManifest: process.env.NEXT_PUBLIC_SKIP_UPLOAD === "true" ? demoManifest : undefined,
      documentStatus: process.env.NEXT_PUBLIC_SKIP_UPLOAD === "true" ? "ready" : "empty",
      progress: { ...defaultProgress }
    })
}));
