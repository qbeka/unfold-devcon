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

  if (documentStatus !== "ready") {
    return <UploadScreen />;
  }

  return (
    <div className="min-h-screen text-neutral-950">
      <TopBar />
      <main className="mx-auto w-full max-w-5xl px-6 pb-24 pt-8">
        <div key={activeTab} className="unfold-fade">
          {activeTab === "read" && <ReadTab />}
          {activeTab === "exam" && <ExamTab />}
          {activeTab === "corrections" && <CorrectionsTab />}
          {activeTab === "discussion" && <DiscussionTab />}
          {activeTab === "movie" && <MovieTab />}
          {activeTab === "progress" && <ProgressTab />}
        </div>
      </main>
    </div>
  );
}
