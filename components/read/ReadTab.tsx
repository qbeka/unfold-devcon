"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, FileText, Languages, Layout } from "lucide-react";
import { ModuleReader } from "@/components/read/ModuleReader";
import { PdfViewer } from "@/components/read/PdfViewer";
import { useUnfoldStore } from "@/lib/store";
import { moduleFiveContent, supportedLanguages, translateModuleTitle } from "@/lib/data/moduleFiveContent";
import { moduleSnippets } from "@/lib/data/moduleSnippets";
import type { ModuleSnippet, ModuleSnippetBlock } from "@/lib/data/moduleSnippets";
import { moduleSnippetsTranslated } from "@/lib/data/moduleSnippetsTranslated";
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

  const englishSnippet = moduleSnippets[selectedModuleId ?? ""] as ModuleSnippet | undefined;
  const translatedSnippet =
    language !== "en"
      ? (moduleSnippetsTranslated[language]?.[selectedModuleId ?? ""] as ModuleSnippet | undefined)
      : undefined;

  const title = useMemo(() => {
    if (isModuleFive) return translateModuleTitle(moduleFiveContent, language);
    if (translatedSnippet) return translatedSnippet.title;
    return selectedModule?.title ?? "";
  }, [isModuleFive, language, selectedModule, translatedSnippet]);

  function startFocusedExam() {
    setExamMode("focused");
    setActiveTab("exam");
  }

  const pageStart = selectedModule?.pageStart ?? englishSnippet?.start ?? 1;
  const pageEnd = selectedModule?.pageEnd ?? englishSnippet?.end ?? pageStart;
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
      ) : englishSnippet ? (
        <ExtractedReader
          english={englishSnippet}
          translated={translatedSnippet}
          languageName={langName}
          languageCode={language}
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
  english,
  translated,
  languageName,
  languageCode,
  pageStart,
  pageEnd
}: {
  english: ModuleSnippet;
  translated?: ModuleSnippet;
  languageName: string;
  languageCode: string;
  pageStart: number;
  pageEnd: number;
}) {
  const [translating, setTranslating] = useState(false);
  useEffect(() => {
    if (languageCode === "en") return;
    setTranslating(true);
    const t = window.setTimeout(() => setTranslating(false), 600);
    return () => window.clearTimeout(t);
  }, [languageCode, english.title]);

  // Pair sections by index. If translated has fewer sections, fall back to English.
  const sections = english.sections.map((sec, idx) => ({
    en: sec,
    de: translated?.sections[idx]
  }));

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
        <div className="space-y-12">
          {sections.map(({ en, de }, idx) => (
            <SectionView key={idx} index={idx} en={en} de={de} languageCode={languageCode} />
          ))}
        </div>
      </div>

      <p className="border-t border-black/5 pt-6 text-[12px] text-neutral-400">
        Module Five is the fully curated, translatable version used by the exam flow. Other modules
        show extracted content from the manual translated to your selected language.
      </p>
    </article>
  );
}

function SectionView({
  index,
  en,
  de,
  languageCode
}: {
  index: number;
  en: ModuleSnippet["sections"][number];
  de?: ModuleSnippet["sections"][number];
  languageCode: string;
}) {
  const showSideBySide = languageCode !== "en" && de;

  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-400">
          Section {index + 1}
        </p>
        <h3 className="text-[20px] font-semibold tracking-tighter2 text-neutral-950">
          {showSideBySide ? de!.heading : en.heading}
        </h3>
        {showSideBySide && (
          <p className="text-[11px] text-neutral-400">Original: {en.heading}</p>
        )}
      </header>
      <div className="space-y-4">
        {en.body.map((block, j) => {
          const deBlock = de?.body[j];
          if (!showSideBySide || !deBlock || deBlock.kind !== block.kind) {
            return <BlockView key={j} block={block} />;
          }
          return (
            <div key={j} className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-black/10 bg-white px-4 py-3">
                <p className="mb-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-400">
                  English
                </p>
                <BlockView block={block} subdued />
              </div>
              <div className="rounded-xl border border-black/10 bg-neutral-50 px-4 py-3">
                <p className="mb-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-400">
                  Translation
                </p>
                <BlockView block={deBlock} />
              </div>
            </div>
          );
        })}
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
