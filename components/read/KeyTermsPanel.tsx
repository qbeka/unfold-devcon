import type { DocumentSection } from "@/lib/types";

export function KeyTermsPanel({ section }: { section: DocumentSection }) {
  return (
    <aside className="space-y-4">
      <Panel title="Key Exam Terms" items={section.keyTerms} />
      <Panel title="Exam Concepts" items={section.examConcepts} />
    </aside>
  );
}

function Panel({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <h3 className="text-sm font-bold text-slate-950">{title}</h3>
      <div className="mt-4 flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
