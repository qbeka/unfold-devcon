"use client";

import { useState } from "react";
import { ChevronDown, RotateCcw } from "lucide-react";
import { TabNav } from "@/components/layout/TabNav";
import { useUnfoldStore } from "@/lib/store";
import { supportedLanguages } from "@/lib/data/moduleFiveContent";
import type { LanguageCode } from "@/lib/data/moduleFiveContent";

export function TopBar() {
  const resetDemo = useUnfoldStore((state) => state.resetDemo);
  const manifest = useUnfoldStore((state) => state.documentManifest);
  const language = useUnfoldStore((state) => state.language);
  const setLanguage = useUnfoldStore((state) => state.setLanguage);
  const selectedModuleId = useUnfoldStore((state) => state.selectedModuleId);
  const setSelectedModuleId = useUnfoldStore((state) => state.setSelectedModuleId);
  const [moduleOpen, setModuleOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const currentModule = manifest?.modules.find((m) => m.id === selectedModuleId) ?? manifest?.modules[0];
  const currentLanguage = supportedLanguages.find((l) => l.code === language) ?? supportedLanguages[0];

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-6 py-3">
        <div className="flex items-center gap-3">
          <p className="text-base font-semibold tracking-[-0.02em] text-slate-950">Unfold</p>
          <span className="hidden h-4 w-px bg-slate-200 sm:block" />
          <p className="hidden truncate text-xs font-medium text-slate-500 sm:block">
            {manifest?.title ?? "Alberta Basic Security Training"}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="relative">
            <button
              className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-300"
              onClick={() => {
                setModuleOpen((v) => !v);
                setLangOpen(false);
              }}
              type="button"
            >
              {currentModule?.title.replace(/^Module\s/i, "M") ?? "Module"}
              <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </button>
            {moduleOpen && manifest && (
              <div className="absolute right-0 top-full z-40 mt-2 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.10)]">
                <div className="max-h-80 overflow-y-auto py-1">
                  {manifest.modules.map((m) => (
                    <button
                      key={m.id}
                      className={`flex w-full items-start gap-2 px-4 py-2.5 text-left text-xs ${
                        m.id === selectedModuleId
                          ? "bg-slate-50 font-semibold text-slate-950"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                      onClick={() => {
                        setSelectedModuleId(m.id);
                        setModuleOpen(false);
                      }}
                      type="button"
                    >
                      {m.title}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-300"
              onClick={() => {
                setLangOpen((v) => !v);
                setModuleOpen(false);
              }}
              type="button"
            >
              {currentLanguage.label}
              <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full z-40 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.10)]">
                <div className="py-1">
                  {supportedLanguages.map((l) => (
                    <button
                      key={l.code}
                      className={`flex w-full items-center justify-between px-4 py-2 text-left text-xs ${
                        l.code === language
                          ? "bg-slate-50 font-semibold text-slate-950"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                      onClick={() => {
                        setLanguage(l.code as LanguageCode);
                        setLangOpen(false);
                      }}
                      type="button"
                    >
                      <span>{l.label}</span>
                      <span className="text-[0.65rem] text-slate-400">{l.nativeLabel}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-300"
            onClick={resetDemo}
            title="Reset"
            type="button"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <div className="mx-auto w-full max-w-5xl px-6 pb-2">
        <TabNav />
      </div>
    </header>
  );
}
