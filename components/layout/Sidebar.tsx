"use client";

import { TabNav } from "@/components/layout/TabNav";
import { useUnfoldStore } from "@/lib/store";

export function Sidebar() {
  const manifest = useUnfoldStore((state) => state.documentManifest);
  const selectedModuleId = useUnfoldStore((state) => state.selectedModuleId);
  const setSelectedModuleId = useUnfoldStore((state) => state.setSelectedModuleId);

  return (
    <aside className="rounded-[1.5rem] border border-slate-200 bg-white/90 p-3 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur lg:sticky lg:top-5 lg:h-[calc(100vh-2.5rem)] lg:overflow-auto">
      <div className="mb-5 px-2 pt-2">
        <div className="text-xl font-semibold tracking-tight text-slate-950">Unfold</div>
        <p className="mt-2 text-xs leading-5 text-slate-500">
          Upload the manual. Learn in your language. Pass the exam.
        </p>
      </div>

      <TabNav />

      <div className="mt-5 rounded-[1.25rem] border border-slate-200 bg-slate-50 p-3">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Processed PDF
        </p>
        <p className="mt-2 text-sm font-semibold leading-5 text-slate-900">
          {manifest?.title ?? "Alberta Basic Security Training"}
        </p>
      </div>

      <div className="mt-4">
        <p className="px-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Modules
        </p>
        <div className="mt-2 space-y-1">
          {manifest?.modules.map((module) => (
            <button
              key={module.id}
              className={`w-full rounded-2xl px-3 py-2 text-left text-xs font-semibold leading-5 ${
                selectedModuleId === module.id
                  ? "bg-slate-950 text-white"
                  : "text-slate-600 hover:bg-white hover:text-slate-950"
              }`}
              onClick={() => setSelectedModuleId(module.id)}
              type="button"
            >
              {module.title.replace(/^Module\s/i, "")}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
