"use client";

import { useState } from "react";
import { ChevronDown, FileUp, RotateCcw } from "lucide-react";
import { TabNav } from "@/components/layout/TabNav";
import { useUnfoldStore } from "@/lib/store";

export function TopBar() {
  const resetDemo = useUnfoldStore((state) => state.resetDemo);
  const returnToUpload = useUnfoldStore((state) => state.returnToUpload);
  const manifest = useUnfoldStore((state) => state.documentManifest);
  const selectedModuleId = useUnfoldStore((state) => state.selectedModuleId);
  const setSelectedModuleId = useUnfoldStore((state) => state.setSelectedModuleId);
  const [moduleOpen, setModuleOpen] = useState(false);

  const currentModule = manifest?.modules.find((m) => m.id === selectedModuleId) ?? manifest?.modules[0];

  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-6 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/unfold-logo.png" alt="Unfold" className="h-14 w-14" />
          <p className="hidden truncate text-[13px] font-medium text-neutral-500 sm:block">
            <span className="text-neutral-500">{manifest?.fileName ?? "manual.pdf"}</span>
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <Pill open={moduleOpen} setOpen={setModuleOpen} label={shortenModule(currentModule?.title)}>
            <div className="max-h-80 overflow-y-auto py-1">
              {manifest?.modules.map((m) => (
                <button
                  key={m.id}
                  className={`flex w-full flex-col gap-0.5 px-3 py-2 text-left text-[12px] ${
                    m.id === selectedModuleId
                      ? "bg-black/5 font-medium text-neutral-950"
                      : "text-neutral-700 hover:bg-black/5"
                  }`}
                  onClick={() => {
                    setSelectedModuleId(m.id);
                    setModuleOpen(false);
                  }}
                  type="button"
                >
                  <span>{m.title}</span>
                  {m.pageStart && m.pageEnd && (
                    <span className="text-[10px] text-neutral-400">
                      Pages {m.pageStart}–{m.pageEnd}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </Pill>

          <button
            className="grid h-8 w-8 place-items-center rounded-full border border-black/10 bg-white text-neutral-700 hover:border-black/20"
            onClick={returnToUpload}
            title="Upload a new PDF"
            type="button"
          >
            <FileUp className="h-3.5 w-3.5" />
          </button>
          <button
            className="grid h-8 w-8 place-items-center rounded-full border border-black/10 bg-white text-neutral-700 hover:border-black/20"
            onClick={resetDemo}
            title="Reset progress"
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

function shortenModule(title: string | undefined) {
  if (!title) return "Module";
  // "Module Five: Documentation and Evidence" -> "M5 · Documentation"
  const m = title.match(/^Module\s+([A-Za-z]+):\s*(.+)$/);
  if (!m) return title;
  const num = wordToNum(m[1]);
  const sub = m[2].split(/\s+/).slice(0, 2).join(" ");
  return `M${num} · ${sub}`;
}

function wordToNum(w: string) {
  const map: Record<string, string> = {
    one: "1", two: "2", three: "3", four: "4", five: "5",
    six: "6", seven: "7", eight: "8", nine: "9", ten: "10"
  };
  return map[w.toLowerCase()] ?? w;
}

function Pill({
  open,
  setOpen,
  label,
  children
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <button
        className="flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-3 py-1.5 text-[12px] font-medium text-neutral-700 hover:border-black/20"
        onClick={() => {
          setOpen(!open);
        }}
        type="button"
      >
        {label}
        <ChevronDown className="h-3 w-3 opacity-60" />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-40 mt-2 w-72 overflow-hidden rounded-xl border border-black/10 bg-white shadow-soft">
          {children}
        </div>
      )}
    </div>
  );
}
