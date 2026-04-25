"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function PdfViewer({ startPage, endPage }: { startPage: number; endPage: number }) {
  const [page, setPage] = useState(startPage);

  function go(delta: number) {
    setPage((current) => Math.max(startPage, Math.min(endPage, current + delta)));
  }

  return (
    <div className="overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
        <p className="text-xs font-medium text-slate-600">
          Page {page} of {endPage} (Module Five spans pages {startPage}–{endPage})
        </p>
        <div className="flex items-center gap-1">
          <button
            className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 hover:border-slate-300 disabled:opacity-40"
            disabled={page <= startPage}
            onClick={() => go(-1)}
            type="button"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 hover:border-slate-300 disabled:opacity-40"
            disabled={page >= endPage}
            onClick={() => go(1)}
            type="button"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="bg-slate-100 p-4">
        <object
          data={`/manual/abst-manual.pdf#page=${page}&view=FitH`}
          type="application/pdf"
          className="h-[78vh] w-full rounded-xl border border-slate-200 bg-white"
        >
          <iframe
            src={`/manual/abst-manual.pdf#page=${page}&view=FitH`}
            className="h-[78vh] w-full rounded-xl border border-slate-200 bg-white"
            title="Manual PDF"
          />
        </object>
      </div>
    </div>
  );
}
