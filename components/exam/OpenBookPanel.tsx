import { demoSection } from "@/lib/data/demoDocument";

export function OpenBookPanel() {
  return (
    <aside className="rounded-3xl border border-slate-200 bg-white p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        Open-book source
      </p>
      <h3 className="mt-3 text-xl font-bold text-slate-950">{demoSection.title}</h3>
      <p className="mt-4 text-sm leading-7 text-slate-700">{demoSection.simplifiedText}</p>
      <p className="mt-5 rounded-2xl bg-blue-50 px-4 py-3 text-xs font-semibold text-blue-950">
        {demoSection.sourceReference}
      </p>
    </aside>
  );
}
