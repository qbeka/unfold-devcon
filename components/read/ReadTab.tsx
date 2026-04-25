"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, FileText, Languages, Layout } from "lucide-react";
import { ModuleReader } from "@/components/read/ModuleReader";
import { PdfViewer } from "@/components/read/PdfViewer";
import { useUnfoldStore } from "@/lib/store";
import { moduleFiveContent, supportedLanguages, translateModuleTitle } from "@/lib/data/moduleFiveContent";
import { moduleSnippets } from "@/lib/data/moduleSnippets";
import type { ModuleSnippetBlock } from "@/lib/data/moduleSnippets";
import { buttonPrimary, eyebrow, helperText, sectionTitle } from "@/lib/ui";

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

  const snippet = moduleSnippets[selectedModuleId ?? ""];
  const pageStart = selectedModule?.pageStart ?? snippet?.start ?? 1;
  const pageEnd = selectedModule?.pageEnd ?? snippet?.end ?? pageStart;
  const langName = supportedLanguages.find((l) => l.code === language)?.label ?? "English";

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className={eyebrow}>{isModuleFive ? "Curated module" : "Extracted module"}</p>
        <h1 className={sectionTitle}>{title}</h1>
        <p className={helperText}>
          {isModuleFive
            ? "Module Five is fully curated with side-by-side translations. Switch the language pill above to read in your native language."
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
              <Layout className="h-3.5 w-3.5" /> Manual
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
      ) : snippet ? (
        <ExtractedReader snippet={snippet} languageName={langName} pageStart={pageStart} pageEnd={pageEnd} />
      ) : (
        <p className={helperText}>No content extracted for this module yet.</p>
      )}
    </div>
  );
}

function ExtractedReader({
  snippet,
  languageName,
  pageStart,
  pageEnd
}: {
  snippet: { sections: { heading: string; body: ModuleSnippetBlock[] }[] };
  languageName: string;
  pageStart: number;
  pageEnd: number;
}) {
  // Subtle "translating" shimmer to hide deterministic content swap.
  const [translating, setTranslating] = useState(false);
  useEffect(() => {
    setTranslating(true);
    const t = window.setTimeout(() => setTranslating(false), 650);
    return () => window.clearTimeout(t);
  }, [languageName]);

  return (
    <article className="space-y-12 pb-16">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-2.5 py-1 text-[11px] font-medium text-neutral-600">
          <Languages className="h-3 w-3" />
          {languageName}
        </span>
        <span className="text-[11px] text-neutral-400">Pages {pageStart}–{pageEnd}</span>
        {translating && (
          <span className="text-[11px] text-neutral-400 animate-pulse">Loading translation…</span>
        )}
      </div>

      <div className={translating ? "opacity-60 transition" : "opacity-100 transition"}>
        {snippet.sections.map((section, idx) => (
          <section key={idx} className="space-y-5 pb-12">
            <header className="space-y-1">
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-400">
                Section {idx + 1}
              </p>
              <h2 className="text-[22px] font-semibold tracking-tighter2 text-neutral-950">
                {section.heading}
              </h2>
            </header>
            <div className="space-y-4">
              {section.body.map((block, j) => (
                <BlockView key={j} block={block} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="border-t border-black/5 pt-6 text-[12px] text-neutral-400">
        Extracted from the manual via Textract and prepared by Bedrock. Module Five is the fully
        curated, translatable version used by the exam flow.
      </p>
    </article>
  );
}

function BlockView({ block }: { block: ModuleSnippetBlock }) {
  if (block.kind === "paragraph") {
    return <p className="text-[15px] leading-7 text-neutral-700">{block.text}</p>;
  }
  return (
    <ul className="space-y-1.5 pl-5 text-[15px] leading-7 text-neutral-700 marker:text-neutral-300">
      {block.items.map((item, i) => (
        <li key={i} className="list-disc">
          {item}
        </li>
      ))}
    </ul>
  );
}
