"use client";

import { useUnfoldStore } from "@/lib/store";
import type { DocumentSection } from "@/lib/types";

export function DocumentViewer({ section }: { section: DocumentSection }) {
  const languageMode = useUnfoldStore((state) => state.languageMode);

  if (languageMode === "side_by_side") {
    return (
      <div className="grid gap-4 lg:grid-cols-2">
        <TextPanel label="Original English" text={section.originalText} />
        <TextPanel label="Spanish" text={section.translatedText} />
      </div>
    );
  }

  const content = {
    original: section.originalText,
    simple: section.simplifiedText,
    spanish: section.translatedText
  }[languageMode];

  return <TextPanel label={languageLabels[languageMode]} text={content} />;
}

const languageLabels = {
  original: "Original English",
  simple: "Simplified English",
  spanish: "Spanish",
  side_by_side: "Side by side"
};

function TextPanel({ label, text }: { label: string; text: string }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-4 text-base leading-7 text-slate-800">{text}</p>
    </article>
  );
}
