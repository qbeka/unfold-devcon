"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function PdfViewer({
  startPage,
  endPage,
  height = "78vh"
}: {
  startPage: number;
  endPage: number;
  height?: string;
}) {
  const [page, setPage] = useState(startPage);

  function go(delta: number) {
    setPage((current) => Math.max(startPage, Math.min(endPage, current + delta)));
  }

  return (
    <div className="overflow-hidden rounded-xl border border-black/10 bg-white">
      <div className="flex items-center justify-between border-b border-black/5 px-4 py-2.5">
        <p className="text-[12px] font-medium text-neutral-500">
          Page <span className="text-neutral-900">{page}</span> of {endPage} · Module spans {startPage}–{endPage}
        </p>
        <div className="flex items-center gap-1">
          <button
            className="grid h-7 w-7 place-items-center rounded-full border border-black/10 bg-white text-neutral-600 hover:border-black/20 disabled:opacity-30"
            disabled={page <= startPage}
            onClick={() => go(-1)}
            type="button"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            className="grid h-7 w-7 place-items-center rounded-full border border-black/10 bg-white text-neutral-600 hover:border-black/20 disabled:opacity-30"
            disabled={page >= endPage}
            onClick={() => go(1)}
            type="button"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <div className="bg-neutral-100 p-3">
        <object
          data={`/manual/abst-manual.pdf#page=${page}&view=FitH`}
          type="application/pdf"
          className="w-full rounded-lg border border-black/10 bg-white"
          style={{ height }}
        >
          <iframe
            src={`/manual/abst-manual.pdf#page=${page}&view=FitH`}
            className="w-full rounded-lg border border-black/10 bg-white"
            style={{ height }}
            title="Manual PDF"
          />
        </object>
      </div>
    </div>
  );
}

export function ScrollablePdf({
  startPage,
  endPage,
  height = "70vh"
}: {
  startPage: number;
  endPage: number;
  height?: string;
}) {
  // Renders the PDF allowing native scroll through the document, jumping to startPage initially.
  const src = `/manual/abst-manual.pdf#page=${startPage}&view=FitH`;
  return (
    <div className="overflow-hidden rounded-xl border border-black/10 bg-neutral-100">
      <div className="border-b border-black/5 bg-white px-4 py-2 text-[11px] font-medium text-neutral-500">
        Original manual · Pages {startPage}–{endPage}
      </div>
      <iframe
        src={src}
        className="w-full bg-white"
        style={{ height }}
        title="Manual PDF (scrollable)"
      />
    </div>
  );
}
