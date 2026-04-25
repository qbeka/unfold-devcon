"use client";

import { moduleFiveContent } from "@/lib/data/moduleFiveContent";
import type { ContentBlock } from "@/lib/data/moduleFiveContent";

export function ModuleReader() {
  return (
    <article className="space-y-14 pb-16">
      {moduleFiveContent.sections.map((section) => (
        <section key={section.id} className="space-y-5">
          <header className="space-y-1">
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-400">
              Page {section.page}
            </p>
            <h2 className="text-[22px] font-semibold tracking-tighter2 text-neutral-950">
              {section.heading}
            </h2>
            {section.subheading && (
              <p className="text-[14px] leading-7 text-neutral-500">{section.subheading}</p>
            )}
          </header>
          <div className="space-y-5">
            {section.blocks.map((block, index) => (
              <BlockRenderer key={`${section.id}-${index}`} block={block} />
            ))}
          </div>
        </section>
      ))}
      <p className="border-t border-black/5 pt-6 text-[12px] text-neutral-400">
        Source: Alberta Basic Security Training Participant Manual, pages{" "}
        {moduleFiveContent.pageRange.start}–{moduleFiveContent.pageRange.end}.
      </p>
    </article>
  );
}

function BlockRenderer({ block }: { block: ContentBlock }) {
  if (block.kind === "paragraph") {
    return <p className="text-[15px] leading-7 text-neutral-700">{block.text}</p>;
  }

  if (block.kind === "list") {
    if (block.style === "ordered") {
      return (
        <ol className="space-y-1.5 pl-5 text-[15px] leading-7 text-neutral-700">
          {block.items.map((item, idx) => (
            <li key={idx} className="list-decimal">
              {item}
            </li>
          ))}
        </ol>
      );
    }
    return (
      <ul className="space-y-1.5 pl-5 text-[15px] leading-7 text-neutral-700 marker:text-neutral-300">
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
      <aside className="rounded-xl border border-black/10 bg-neutral-50 px-5 py-4">
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">
          {block.label}
        </p>
        <p className="mt-1.5 text-[14.5px] leading-7 text-neutral-700">{block.text}</p>
      </aside>
    );
  }

  if (block.kind === "report") {
    return (
      <figure className="overflow-hidden rounded-xl border border-black/10 bg-white">
        <figcaption className="border-b border-black/5 bg-neutral-50/80 px-5 py-2.5 text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">
          {block.title}
        </figcaption>
        <div className="space-y-1 px-5 py-4 font-mono text-[13px] leading-6 text-neutral-700">
          {block.lines.map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </div>
      </figure>
    );
  }

  return null;
}
