"use client";

import { useUnfoldStore } from "@/lib/store";
import type { ExamMode } from "@/lib/types";

const modes: { id: ExamMode; label: string }[] = [
  { id: "focused", label: "Focused" },
  { id: "open_book", label: "Open-book" }
];

export function ExamModeSelector() {
  const examMode = useUnfoldStore((state) => state.examMode);
  const setExamMode = useUnfoldStore((state) => state.setExamMode);
  const questionCount = useUnfoldStore((state) => state.questionCount);
  const setQuestionCount = useUnfoldStore((state) => state.setQuestionCount);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Pillset>
        {modes.map((mode) => (
          <PillButton
            key={mode.id}
            active={examMode === mode.id}
            onClick={() => setExamMode(mode.id)}
            label={mode.label}
          />
        ))}
      </Pillset>

      <Pillset>
        {[3, 5].map((count) => (
          <PillButton
            key={count}
            active={questionCount === count}
            onClick={() => setQuestionCount(count)}
            label={`${count} questions`}
          />
        ))}
      </Pillset>
    </div>
  );
}

function Pillset({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-0.5 rounded-full border border-black/10 bg-white p-0.5">
      {children}
    </div>
  );
}

function PillButton({
  active,
  onClick,
  label
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      className={`rounded-full px-3 py-1.5 text-[12px] font-medium transition ${
        active ? "bg-neutral-950 text-white" : "text-neutral-500 hover:text-neutral-950"
      }`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}
