"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, FileText, Languages, Layout } from "lucide-react";
import { ModuleReader } from "@/components/read/ModuleReader";
import { PdfViewer } from "@/components/read/PdfViewer";
import { useUnfoldStore } from "@/lib/store";
import { moduleFiveContent, supportedLanguages, translateModuleTitle } from "@/lib/data/moduleFiveContent";
import { moduleSnippets } from "@/lib/data/moduleSnippets";
import type { ModuleSnippetBlock } from "@/lib/data/moduleSnippets";
import { getModuleOverview } from "@/lib/data/moduleTranslations";
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

  const title = useMemo(() => {
    if (isModuleFive) return translateModuleTitle(moduleFiveContent, language);
    if (language !== "en") {
      const overview = getModuleOverview(selectedModuleId, language);
      if (overview) return overview.title;
    }
    return selectedModule?.title ?? "";
  }, [isModuleFive, language, selectedModule, selectedModuleId]);

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
        <ExtractedReader
          snippet={snippet}
          languageName={langName}
          languageCode={language}
          moduleId={selectedModuleId}
          pageStart={pageStart}
          pageEnd={pageEnd}
        />
      ) : (
        <p className={helperText}>No content extracted for this module yet.</p>
      )}
    </div>
  );
}

function ExtractedReader({
  snippet,
  languageName,
  languageCode,
  moduleId,
  pageStart,
  pageEnd
}: {
  snippet: { sections: { heading: string; body: ModuleSnippetBlock[] }[] };
  languageName: string;
  languageCode: string;
  moduleId: string;
  pageStart: number;
  pageEnd: number;
}) {
  const [translating, setTranslating] = useState(false);
  useEffect(() => {
    setTranslating(true);
    const t = window.setTimeout(() => setTranslating(false), 600);
    return () => window.clearTimeout(t);
  }, [languageName, moduleId]);

  const overview = languageCode !== "en" ? getModuleOverview(moduleId, languageCode as any) : undefined;

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

      {overview && (
        <section className={`rounded-2xl border border-black/10 bg-white p-6 transition ${translating ? "opacity-50" : "opacity-100"}`}>
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-400">
            {languageName} overview
          </p>
          <h2 className="mt-2 text-[22px] font-semibold tracking-tighter2 text-neutral-950">
            {overview.title}
          </h2>
          <p className="mt-3 text-[15px] leading-7 text-neutral-700">{overview.intro}</p>
          <ul className="mt-4 space-y-1.5 pl-5 text-[14.5px] leading-7 text-neutral-700 marker:text-neutral-300">
            {overview.bullets.map((b) => (
              <li key={b} className="list-disc">
                {b}
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className={translating ? "opacity-60 transition" : "opacity-100 transition"}>
        <p className={`text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-400 ${overview ? "mt-2" : ""}`}>
          {overview ? "Original passages from the manual" : "Extracted content"}
        </p>
        <div className="mt-2 space-y-12">
          {snippet.sections.map((section, idx) => (
            <section key={idx} className="space-y-4">
              <header className="space-y-1">
                <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-400">
                  Section {idx + 1}
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
          ))}
        </div>
      </div>

      <p className="border-t border-black/5 pt-6 text-[12px] text-neutral-400">
        Module Five is the fully curated, translatable version used by the exam flow. Other modules
        show extracted content from the manual.
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
