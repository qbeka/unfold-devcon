"use client";

import { useMemo } from "react";
import { useUnfoldStore } from "@/lib/store";
import {
  moduleFiveContent,
  translateBlock,
  translateSection
} from "@/lib/data/moduleFiveContent";
import type { ContentBlock } from "@/lib/data/moduleFiveContent";

export function ModuleReader() {
  const language = useUnfoldStore((state) => state.language);

  const sections = useMemo(
    () => moduleFiveContent.sections.map((section) => translateSection(section, language)),
    [language]
  );

  return (
    <article className="space-y-12 pb-12">
      {sections.map((section) => (
        <section key={section.id} className="space-y-5">
          <header className="space-y-1.5">
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-slate-400">
              Page {section.page}
            </p>
            <h2 className="text-[1.6rem] font-semibold tracking-[-0.02em] text-slate-950">
              {section.heading}
            </h2>
            {section.subheading && (
              <p className="text-sm leading-7 text-slate-500">{section.subheading}</p>
            )}
          </header>
          <div className="space-y-5">
            {section.blocks.map((block, index) => (
              <BlockRenderer key={`${section.id}-${index}`} block={block} />
            ))}
          </div>
        </section>
      ))}
      <p className="border-t border-slate-100 pt-6 text-xs text-slate-400">
        Source: Alberta Basic Security Training Participant Manual, pages{" "}
        {moduleFiveContent.pageRange.start}–{moduleFiveContent.pageRange.end}.
      </p>
    </article>
  );
}

function BlockRenderer({ block }: { block: ContentBlock }) {
  if (block.kind === "paragraph") {
    return (
      <p className="text-[0.95rem] leading-7 text-slate-700">
        {block.text}
      </p>
    );
  }

  if (block.kind === "list") {
    if (block.style === "ordered") {
      return (
        <ol className="space-y-2 pl-5 text-[0.95rem] leading-7 text-slate-700 [counter-reset:items]">
          {block.items.map((item, idx) => (
            <li key={idx} className="list-decimal">
              {item}
            </li>
          ))}
        </ol>
      );
    }
    return (
      <ul className="space-y-2 pl-5 text-[0.95rem] leading-7 text-slate-700">
        {block.items.map((item, idx) => (
          <li key={idx} className="list-disc">
            {item}
          </li>
        ))}
      </ul>
    );
  }

  if (block.kind === "callout") {
    return (
      <aside className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
          {block.label}
        </p>
        <p className="mt-2 text-[0.95rem] leading-7 text-slate-700">{block.text}</p>
      </aside>
    );
  }

  if (block.kind === "report") {
    return (
      <figure className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <figcaption className="border-b border-slate-100 bg-slate-50 px-5 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
          {block.title}
        </figcaption>
        <div className="space-y-1 px-5 py-4 font-mono text-[0.85rem] leading-6 text-slate-700">
          {block.lines.map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </div>
      </figure>
    );
  }

  return null;
}

// Re-exported helpers so consumers can compute translated content elsewhere if needed.
export { translateBlock };
