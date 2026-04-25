"use client";

import { useUnfoldStore } from "@/lib/store";
import { moduleFiveContent, translateBlock } from "@/lib/data/moduleFiveContent";

export function OpenBookPanel() {
  const language = useUnfoldStore((state) => state.language);
  const reportSection = moduleFiveContent.sections.find((s) => s.id === "reports");
  if (!reportSection) return null;

  return (
    <aside className="rounded-[1.25rem] border border-slate-200 bg-white p-6">
      <p className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-slate-400">
        Open-book source
      </p>
      <h3 className="mt-2 text-base font-semibold text-slate-950">{reportSection.heading}</h3>
      <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
        {reportSection.blocks.slice(0, 3).map((block, idx) => {
          const translated = translateBlock(block, language);
          if (translated.kind === "paragraph") return <p key={idx}>{translated.text}</p>;
          if (translated.kind === "list")
            return (
              <ul key={idx} className="list-disc pl-5">
                {translated.items.map((i, j) => (
                  <li key={j}>{i}</li>
                ))}
              </ul>
            );
          return null;
        })}
      </div>
    </aside>
  );
}
