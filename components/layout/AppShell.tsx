"use client";

import { CorrectionsTab } from "@/components/corrections/CorrectionsTab";
import { DiscussionTab } from "@/components/discussion/DiscussionTab";
import { ExamTab } from "@/components/exam/ExamTab";
import { MovieTab } from "@/components/movie/MovieTab";
import { ProgressTab } from "@/components/progress/ProgressTab";
import { ReadTab } from "@/components/read/ReadTab";
import { TopBar } from "@/components/layout/TopBar";
import { UploadScreen } from "@/components/layout/UploadScreen";
import { useUnfoldStore } from "@/lib/store";

export function AppShell() {
  const activeTab = useUnfoldStore((state) => state.activeTab);
  const documentStatus = useUnfoldStore((state) => state.documentStatus);
  const needsLanguageChoice = useUnfoldStore((state) => state.needsLanguageChoice);

  if (documentStatus !== "ready" || needsLanguageChoice) {
    return <UploadScreen />;
  }

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-950">
      <TopBar />
      <main className="mx-auto w-full max-w-5xl px-6 pb-16 pt-6">
        {activeTab === "read" && <ReadTab />}
        {activeTab === "exam" && <ExamTab />}
        {activeTab === "corrections" && <CorrectionsTab />}
        {activeTab === "discussion" && <DiscussionTab />}
        {activeTab === "movie" && <MovieTab />}
        {activeTab === "progress" && <ProgressTab />}
      </main>
    </div>
  );
}
