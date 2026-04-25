"use client";

import { CorrectionsTab } from "@/components/corrections/CorrectionsTab";
import { DiscussionTab } from "@/components/discussion/DiscussionTab";
import { ExamTab } from "@/components/exam/ExamTab";
import { MovieTab } from "@/components/movie/MovieTab";
import { ProgressTab } from "@/components/progress/ProgressTab";
import { ReadTab } from "@/components/read/ReadTab";
import { Sidebar } from "@/components/layout/Sidebar";
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
    <main className="mx-auto grid min-h-screen max-w-7xl gap-4 px-4 py-4 lg:grid-cols-[16rem_1fr] lg:px-6 lg:py-5">
      <Sidebar />
      <section className="min-w-0 space-y-4">
        <TopBar />
        {activeTab === "read" && <ReadTab />}
        {activeTab === "exam" && <ExamTab />}
        {activeTab === "corrections" && <CorrectionsTab />}
        {activeTab === "discussion" && <DiscussionTab />}
        {activeTab === "movie" && <MovieTab />}
        {activeTab === "progress" && <ProgressTab />}
      </section>
    </main>
  );
}
