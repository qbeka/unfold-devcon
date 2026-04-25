"use client";

import { ScrollablePdf } from "@/components/read/PdfViewer";
import { moduleFiveContent } from "@/lib/data/moduleFiveContent";

export function OpenBookPanel() {
  return (
    <aside className="space-y-2">
      <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-400">
        Open-book source
      </p>
      <ScrollablePdf
        startPage={moduleFiveContent.pageRange.start}
        endPage={moduleFiveContent.pageRange.end}
        height="68vh"
      />
    </aside>
  );
}
