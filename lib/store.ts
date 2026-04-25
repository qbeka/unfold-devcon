"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { defaultProgress } from "@/lib/data/demoProgress";
import { demoQuestions, sceneQuestionId } from "@/lib/data/demoQuestions";
import { demoCorrectionScene } from "@/lib/data/demoScene";
import { gradeAnswer } from "@/lib/exam";
import { applyExamUpdate, computeWeakAreas } from "@/lib/progress";
import { demoManifest } from "@/lib/data/demoManifest";
import type { LanguageCode } from "@/lib/data/moduleFiveContent";
import type {
  AnswerAttempt,
  AppTab,
  ChatMessage,
  CorrectionSceneData,
  DiscussionSummary,
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
  // Per-question UI selection (before submit). Cleared when the question is
  // submitted (the attempt becomes the source of truth) and on retry.
  selections: Record<string, string>;
  attempts: AnswerAttempt[];
  latestWrongQuestionId?: string;
  activeCorrectionScene?: CorrectionSceneData;
  sceneGenerationStartedAt?: number;
  pendingCorrectionScene?: CorrectionSceneData;
  progress: ProgressState;
  // Movie generation state — persisted so it survives tab switches.
  movieStartedAt?: number;
  moviePrompt?: string;
  // Discussion chat state
  chatMessages: ChatMessage[];
  chatLoading: boolean;
  chatSummary?: DiscussionSummary;
  chatSubmitting: boolean;
  sendChatMessage: (message: string, chapterContext: string, activityPrompt: string) => void;
  appendChatMessage: (msg: ChatMessage) => void;
  setChatLoading: (loading: boolean) => void;
  endActivity: (activityPrompt: string) => void;
  clearChat: () => void;
  setDocumentStatus: (documentStatus: DocumentProcessingStatus) => void;
  setDocumentReady: (documentManifest: DocumentManifest) => void;
  setProcessingError: (processingError: string) => void;
  setActiveTab: (tab: AppTab) => void;
  setSelectedModuleId: (moduleId: string) => void;
  setLanguage: (language: LanguageCode) => void;
  confirmLanguage: () => void;
  returnToUpload: () => void;
  setExamMode: (examMode: ExamMode) => void;
  setQuestionCount: (questionCount: number) => void;
  setCurrentQuestionIndex: (index: number) => void;
  selectAnswerFor: (questionId: string, answer: string) => void;
  submitAnswer: () => void;
  retryQuestion: (questionId: string) => void;
  retakeExam: () => void;
  goToTriggerQuestion: () => void;
  openCorrectionScene: () => void;
  finishSceneGeneration: () => void;
  completePractice: () => void;
  startMovieGeneration: (prompt: string) => void;
  resetMovie: () => void;
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
  selections: {} as Record<string, string>,
  attempts: [] as AnswerAttempt[],
  latestWrongQuestionId: undefined,
  activeCorrectionScene: undefined,
  sceneGenerationStartedAt: undefined,
  pendingCorrectionScene: undefined,
  progress: defaultProgress,
  movieStartedAt: undefined,
  moviePrompt: undefined,
  chatMessages: [] as ChatMessage[],
  chatLoading: false,
  chatSummary: undefined,
  chatSubmitting: false
};

export const useUnfoldStore = create<UnfoldStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      setDocumentStatus: (documentStatus) => set({ documentStatus, processingError: undefined }),
      setDocumentReady: (documentManifest) =>
        set((state) => ({
          documentManifest,
          documentStatus: "ready",
          selectedModuleId: documentManifest.modules[0]?.id ?? "module-five",
          activeTab: "read",
          processingError: undefined,
          // Always require language confirmation after a fresh upload.
          needsLanguageChoice:
            state.documentManifest?.documentId !== documentManifest.documentId
              ? true
              : state.needsLanguageChoice
        })),
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
      returnToUpload: () =>
        set({
          documentStatus: "empty",
          documentManifest: undefined,
          processingError: undefined,
          needsLanguageChoice: false,
          activeTab: "read"
        }),
      setExamMode: (examMode) => set({ examMode }),
      setQuestionCount: (questionCount) =>
        set({
          questionCount,
          examQuestions: shuffleQuestions(questionCount),
          currentQuestionIndex: 0,
          selections: {},
          attempts: [],
          latestWrongQuestionId: undefined,
          activeCorrectionScene: undefined,
          sceneGenerationStartedAt: undefined,
          pendingCorrectionScene: undefined,
          progress: { ...defaultProgress }
        }),
      setCurrentQuestionIndex: (currentQuestionIndex) => set({ currentQuestionIndex }),
      selectAnswerFor: (questionId, answer) => {
        const state = get();
        // If already submitted, ignore.
        if (state.attempts.some((a) => a.questionId === questionId)) return;
        set({ selections: { ...state.selections, [questionId]: answer } });
      },
      submitAnswer: () => {
        const state = get();
        const question = state.examQuestions[state.currentQuestionIndex];
        if (!question) return;
        if (state.attempts.some((a) => a.questionId === question.id)) return;
        const selected = state.selections[question.id];
        if (!selected) return;

        const correct = gradeAnswer(question, selected);
        const attempt: AnswerAttempt = {
          questionId: question.id,
          selectedAnswer: selected,
          correct,
          weakConcept: correct ? undefined : question.testedConcept
        };
        const nextAttempts = [...state.attempts, attempt];

        set({
          attempts: nextAttempts,
          latestWrongQuestionId: !correct ? question.id : state.latestWrongQuestionId,
          activeCorrectionScene:
            !correct && question.id === sceneQuestionId
              ? demoCorrectionScene
              : state.activeCorrectionScene,
          progress: applyExamUpdate(state.progress, nextAttempts, state.examQuestions)
        });
      },
      retryQuestion: (questionId) => {
        const state = get();
        const filtered = state.attempts.filter((a) => a.questionId !== questionId);
        const nextSelections = { ...state.selections };
        delete nextSelections[questionId];
        const idx = state.examQuestions.findIndex((q) => q.id === questionId);
        const updates = computeWeakAreas(filtered, state.examQuestions);
        set({
          attempts: filtered,
          selections: nextSelections,
          currentQuestionIndex: idx >= 0 ? idx : state.currentQuestionIndex,
          activeTab: "exam",
          progress: {
            ...applyExamUpdate(state.progress, filtered, state.examQuestions),
            weakAreas: updates.weakAreas,
            improvedAreas: updates.improvedAreas
          }
        });
      },
      retakeExam: () =>
        set({
          examQuestions: shuffleQuestions(get().questionCount),
          currentQuestionIndex: 0,
          selections: {},
          attempts: [],
          latestWrongQuestionId: undefined,
          activeCorrectionScene: undefined,
          sceneGenerationStartedAt: undefined,
          pendingCorrectionScene: undefined,
          activeTab: "exam",
          progress: { ...defaultProgress }
        }),
      goToTriggerQuestion: () => {
        const state = get();
        const id = state.latestWrongQuestionId ?? sceneQuestionId;
        const idx = state.examQuestions.findIndex((q) => q.id === id);
        if (idx < 0) {
          set({ activeTab: "exam" });
          return;
        }
        // Clear that attempt so they can re-answer it.
        const filtered = state.attempts.filter((a) => a.questionId !== id);
        const nextSelections = { ...state.selections };
        delete nextSelections[id];
        set({
          attempts: filtered,
          selections: nextSelections,
          currentQuestionIndex: idx,
          activeTab: "exam",
          progress: applyExamUpdate(state.progress, filtered, state.examQuestions)
        });
      },
      openCorrectionScene: () => {
        const state = get();
        if (state.latestWrongQuestionId === sceneQuestionId) {
          set({
            activeTab: "corrections",
            pendingCorrectionScene: demoCorrectionScene,
            sceneGenerationStartedAt: Date.now()
          });
          return;
        }
        set({ activeTab: "corrections" });
      },
      finishSceneGeneration: () => {
        const state = get();
        if (!state.pendingCorrectionScene) return;
        set({
          activeCorrectionScene: state.pendingCorrectionScene,
          pendingCorrectionScene: undefined,
          sceneGenerationStartedAt: undefined
        });
      },
      completePractice: () => {
        // Just navigates to Progress. The user retries the original question from there.
        set({ activeTab: "progress" });
      },
      startMovieGeneration: (prompt) =>
        set({ movieStartedAt: Date.now(), moviePrompt: prompt }),
      resetMovie: () => set({ movieStartedAt: undefined, moviePrompt: undefined }),
      appendChatMessage: (msg) =>
        set((state) => ({ chatMessages: [...state.chatMessages, msg] })),
      setChatLoading: (chatLoading) => set({ chatLoading }),
      clearChat: () => set({ chatMessages: [], chatLoading: false, chatSummary: undefined, chatSubmitting: false }),
      endActivity: async (activityPrompt) => {
        const { chatMessages } = get();
        if (chatMessages.length === 0) return;
        set({ chatSubmitting: true });
        try {
          const res = await fetch("/api/end-activity", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: chatMessages, activityPrompt }),
          });
          if (!res.ok) throw new Error("End activity request failed");
          const data = await res.json();
          set({ chatSummary: data.summary });
        } catch (err) {
          console.error("End activity error:", err);
        } finally {
          set({ chatSubmitting: false });
        }
      },
      sendChatMessage: async (message, chapterContext, activityPrompt) => {
        const { appendChatMessage, setChatLoading, chatMessages } = get();
        const userMsg: ChatMessage = { role: "user", content: message };
        appendChatMessage(userMsg);
        setChatLoading(true);

        try {
          const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message,
              history: chatMessages,
              chapterContext,
              activityPrompt,
            }),
          });

          if (!res.ok || !res.body) throw new Error("Chat request failed");

          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          let buffer = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });

            // Process complete SSE events from the buffer
            const lines = buffer.split("\n\n");
            buffer = lines.pop() ?? "";

            for (const line of lines) {
              const data = line.replace(/^data: /, "").trim();
              if (!data || data === "[DONE]") continue;
              try {
                const parsed = JSON.parse(data);
                appendChatMessage({
                  role: "agent",
                  agent: parsed.agent,
                  content: parsed.message,
                });
              } catch {
                // skip malformed events
              }
            }
          }
        } catch (err) {
          console.error("Chat error:", err);
        } finally {
          setChatLoading(false);
        }
      },
      resetDemo: () =>
        set({
          ...initialState,
          examQuestions: shuffleQuestions(initialQuestionCount),
          documentManifest: skipUpload ? demoManifest : undefined,
          documentStatus: skipUpload ? "ready" : "empty",
          needsLanguageChoice: false,
          activeCorrectionScene: undefined,
          sceneGenerationStartedAt: undefined,
          pendingCorrectionScene: undefined,
          progress: { ...defaultProgress }
        })
    }),
    {
      name: "unfold-state-v2",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? window.localStorage : ({} as Storage)
      ),
      partialize: (state) => ({
        documentStatus: state.documentStatus,
        documentManifest: state.documentManifest,
        selectedModuleId: state.selectedModuleId,
        selectedSectionId: state.selectedSectionId,
        language: state.language,
        needsLanguageChoice: state.needsLanguageChoice,
        progress: state.progress,
        attempts: state.attempts,
        latestWrongQuestionId: state.latestWrongQuestionId,
        examQuestions: state.examQuestions,
        questionCount: state.questionCount,
        examMode: state.examMode,
        currentQuestionIndex: state.currentQuestionIndex,
        selections: state.selections,
        sceneGenerationStartedAt: state.sceneGenerationStartedAt,
        pendingCorrectionScene: state.pendingCorrectionScene,
        movieStartedAt: state.movieStartedAt,
        moviePrompt: state.moviePrompt
      })
    }
  )
);
