"use client";

import { ArrowRight } from "lucide-react";
import { DocumentViewer } from "@/components/read/DocumentViewer";
import { KeyTermsPanel } from "@/components/read/KeyTermsPanel";
import { LanguageToggle } from "@/components/read/LanguageToggle";
import { demoDocument, demoModule, demoSection } from "@/lib/data/demoDocument";
import { useUnfoldStore } from "@/lib/store";
import { buttonPrimary, card, label } from "@/lib/ui";

export function ReadTab() {
  const setActiveTab = useUnfoldStore((state) => state.setActiveTab);
  const setExamMode = useUnfoldStore((state) => state.setExamMode);
  const manifest = useUnfoldStore((state) => state.documentManifest);
  const selectedModuleId = useUnfoldStore((state) => state.selectedModuleId);
  const selectedModule = manifest?.modules.find((module) => module.id === selectedModuleId);
  const isModuleFive = selectedModuleId === "module-five";

  function startFocusedExam() {
    setExamMode("focused");
    setActiveTab("exam");
  }

  return (
    <div className={`${card} p-5 lg:p-6`}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className={label}>Processed document</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
            {manifest?.title ?? demoDocument.title}
          </h2>
          <p className="mt-2 text-base font-semibold text-slate-700">
            {selectedModule?.title ?? demoModule.title}
          </p>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
            {selectedModule?.description ?? demoSection.title}
          </p>
        </div>
        <button className={buttonPrimary} disabled={!isModuleFive} onClick={startFocusedExam} type="button">
          Start Focused Exam
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>

      {isModuleFive ? (
        <>
          <div className="mt-6">
            <LanguageToggle />
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_18rem]">
            <DocumentViewer section={demoSection} />
            <KeyTermsPanel section={demoSection} />
          </div>

          <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-950">
            Source reference: {demoSection.sourceReference}
          </div>
        </>
      ) : (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className={label}>Recognized activities</p>
            <div className="mt-3 space-y-2">
              {selectedModule?.activities.map((activity) => (
                <p key={activity} className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-700">
                  {activity}
                </p>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className={label}>Recognized concepts</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedModule?.concepts.map((concept) => (
                <span key={concept} className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">
                  {concept}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
