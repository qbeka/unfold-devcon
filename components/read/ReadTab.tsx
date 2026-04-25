"use client";

import { useMemo, useState } from "react";
import { ArrowRight, FileText, Layout } from "lucide-react";
import { ModuleReader } from "@/components/read/ModuleReader";
import { PdfViewer } from "@/components/read/PdfViewer";
import { useUnfoldStore } from "@/lib/store";
import { moduleFiveContent, translateModuleTitle } from "@/lib/data/moduleFiveContent";
import { buttonPrimary, buttonGhost, label, sectionHeading, helperText } from "@/lib/ui";

type ReaderView = "manual" | "pdf";

export function ReadTab() {
  const setActiveTab = useUnfoldStore((state) => state.setActiveTab);
  const setExamMode = useUnfoldStore((state) => state.setExamMode);
  const manifest = useUnfoldStore((state) => state.documentManifest);
  const selectedModuleId = useUnfoldStore((state) => state.selectedModuleId);
  const language = useUnfoldStore((state) => state.language);
  const selectedModule = manifest?.modules.find((m) => m.id === selectedModuleId);
  const isModuleFive = selectedModuleId === "module-five";
  const [view, setView] = useState<ReaderView>("manual");

  const title = useMemo(
    () => (isModuleFive ? translateModuleTitle(moduleFiveContent, language) : selectedModule?.title ?? ""),
    [isModuleFive, language, selectedModule]
  );

  function startFocusedExam() {
    setExamMode("focused");
    setActiveTab("exam");
  }

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <p className={label}>Reading</p>
        <h1 className={sectionHeading}>{title}</h1>
        <p className={helperText}>
          {isModuleFive
            ? "The full Module Five content is rendered here in your selected language. Highlight any sentence to mark it for later study."
            : selectedModule?.description ?? ""}
        </p>
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button className={buttonPrimary} disabled={!isModuleFive} onClick={startFocusedExam} type="button">
            Start focused exam
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </button>
          {isModuleFive && (
            <div className="ml-1 flex items-center gap-1 rounded-full border border-slate-200 bg-white p-0.5">
              <button
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${
                  view === "manual" ? "bg-slate-950 text-white" : "text-slate-500 hover:text-slate-950"
                }`}
                onClick={() => setView("manual")}
                type="button"
              >
                <Layout className="h-3.5 w-3.5" /> Manual
              </button>
              <button
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${
                  view === "pdf" ? "bg-slate-950 text-white" : "text-slate-500 hover:text-slate-950"
                }`}
                onClick={() => setView("pdf")}
                type="button"
              >
                <FileText className="h-3.5 w-3.5" /> Original PDF
              </button>
            </div>
          )}
        </div>
      </header>

      {isModuleFive ? (
        view === "manual" ? (
          <ModuleReader />
        ) : (
          <PdfViewer
            startPage={moduleFiveContent.pageRange.start}
            endPage={moduleFiveContent.pageRange.end}
          />
        )
      ) : (
        <section className="rounded-[1.25rem] border border-slate-200 bg-white p-8">
          <p className={label}>Recognized in this module</p>
          <h2 className="mt-3 text-lg font-semibold text-slate-950">Activities</h2>
          <ul className="mt-3 space-y-1.5">
            {selectedModule?.activities.map((a) => (
              <li key={a} className="text-sm text-slate-600">
                · {a}
              </li>
            ))}
          </ul>
          <h2 className="mt-6 text-lg font-semibold text-slate-950">Concepts</h2>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {selectedModule?.concepts.map((c) => (
              <span
                key={c}
                className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[0.7rem] font-medium text-slate-600"
              >
                {c}
              </span>
            ))}
          </div>
          <p className="mt-6 text-xs text-slate-400">
            <button className={buttonGhost} onClick={() => useUnfoldStore.getState().setSelectedModuleId("module-five")} type="button">
              Open Module Five for the full curated experience
            </button>
          </p>
        </section>
      )}
    </div>
  );
}
