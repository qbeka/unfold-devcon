"use client";

import { useMemo, useState } from "react";
import { ArrowRight, FileText, Layout } from "lucide-react";
import { ModuleReader } from "@/components/read/ModuleReader";
import { PdfViewer } from "@/components/read/PdfViewer";
import { useUnfoldStore } from "@/lib/store";
import { moduleSnippets } from "@/lib/data/moduleSnippets";
import type { ModuleSnippet, ModuleSnippetBlock } from "@/lib/data/moduleSnippets";
import { buttonPrimary, eyebrow, helperText, sectionTitle } from "@/lib/ui";

type ReaderView = "manual" | "pdf";

export function ReadTab() {
  const setActiveTab = useUnfoldStore((state) => state.setActiveTab);
  const setExamMode = useUnfoldStore((state) => state.setExamMode);
  const manifest = useUnfoldStore((state) => state.documentManifest);
  const selectedModuleId = useUnfoldStore((state) => state.selectedModuleId);
  const selectedModule = manifest?.modules.find((m) => m.id === selectedModuleId);
  const isModuleFive = selectedModuleId === "module-five";
  const [view, setView] = useState<ReaderView>("manual");

  const englishSnippet = moduleSnippets[selectedModuleId ?? ""] as ModuleSnippet | undefined;

  const title = useMemo(() => {
    if (isModuleFive) return "Module Five: Documentation and Evidence";
    return selectedModule?.title ?? "";
  }, [isModuleFive, selectedModule]);

  function startFocusedExam() {
    setExamMode("focused");
    setActiveTab("exam");
  }

  const pageStart = selectedModule?.pageStart ?? englishSnippet?.start ?? 1;
  const pageEnd = selectedModule?.pageEnd ?? englishSnippet?.end ?? pageStart;

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className={eyebrow}>{isModuleFive ? "Curated module" : "Extracted module"}</p>
        <h1 className={sectionTitle}>{title}</h1>
        <p className={helperText}>
          {isModuleFive
            ? "Module Five is curated for the demo path with source-grounded examples, activities, and report-writing guidance."
            : selectedModule?.description}
        </p>
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {isModuleFive && (
            <button className={buttonPrimary} onClick={startFocusedExam} type="button">
              Start focused exam
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
          <div className="inline-flex items-center gap-0.5 rounded-full border border-black/10 bg-white p-0.5">
            <button
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium ${
                view === "manual" ? "bg-neutral-950 text-white" : "text-neutral-500 hover:text-neutral-950"
              }`}
              onClick={() => setView("manual")}
              type="button"
            >
              <Layout className="h-3.5 w-3.5" /> Simplified
            </button>
            <button
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium ${
                view === "pdf" ? "bg-neutral-950 text-white" : "text-neutral-500 hover:text-neutral-950"
              }`}
              onClick={() => setView("pdf")}
              type="button"
            >
              <FileText className="h-3.5 w-3.5" /> Original PDF
            </button>
          </div>
        </div>
      </header>

      {view === "pdf" ? (
        <PdfViewer startPage={pageStart} endPage={pageEnd} />
      ) : isModuleFive ? (
        <ModuleReader />
      ) : englishSnippet ? (
        <ExtractedReader english={englishSnippet} pageStart={pageStart} pageEnd={pageEnd} />
      ) : (
        <p className={helperText}>No content extracted for this module yet.</p>
      )}
    </div>
  );
}

function ExtractedReader({
  english,
  pageStart,
  pageEnd
}: {
  english: ModuleSnippet;
  pageStart: number;
  pageEnd: number;
}) {
  return (
    <article className="space-y-12 pb-16">
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-neutral-400">Pages {pageStart}–{pageEnd}</span>
      </div>

      <div className="space-y-12">
        {english.sections.map((section, idx) => (
          <SectionView key={idx} index={idx} section={section} />
        ))}
      </div>

      <p className="border-t border-black/5 pt-6 text-[12px] text-neutral-400">
        Module Five is the fully curated version used by the exam flow. Other modules show extracted
        source text from the manual.
      </p>
    </article>
  );
}

function SectionView({
  index,
  section
}: {
  index: number;
  section: ModuleSnippet["sections"][number];
}) {
  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-400">
          Section {index + 1}
        </p>
        <h3 className="text-[20px] font-semibold tracking-tighter2 text-neutral-950">
          {section.heading}
        </h3>
      </header>
      <div className="space-y-4">
        {section.body.map((block, j) => (
          <BlockView key={j} block={block} />
        ))}
      </div>
    </section>
  );
}

function BlockView({ block, subdued = false }: { block: ModuleSnippetBlock; subdued?: boolean }) {
  const colour = subdued ? "text-neutral-500" : "text-neutral-700";
  if (block.kind === "paragraph") {
    return <p className={`text-[14.5px] leading-7 ${colour}`}>{block.text}</p>;
  }
  return (
    <ul className={`space-y-1.5 pl-5 text-[14.5px] leading-7 ${colour} marker:text-neutral-300`}>
      {block.items.map((item, i) => (
        <li key={i} className="list-disc">
          {item}
        </li>
      ))}
    </ul>
  );
}
