"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Send, Sparkles, Loader2, CheckCircle2, AlertTriangle, RotateCcw } from "lucide-react";
import { useUnfoldStore } from "@/lib/store";
import { moduleFiveContent } from "@/lib/data/moduleFiveContent";
import { ScrollablePdf } from "@/components/read/PdfViewer";
import { eyebrow, helperText, sectionTitle } from "@/lib/ui";
import { buttonPrimary, buttonSecondary } from "@/lib/ui";
import type { AgentKey, DiscussionSummary } from "@/lib/types";

// ── Agent display config ─────────────────────────────────────────────

const AGENT_INFO: Record<AgentKey, { initial: string; label: string; role: string; color: string }> = {
  riya: { initial: "R", label: "Riya", role: "Nervous rookie", color: "bg-rose-100 text-rose-700" },
  val:  { initial: "V", label: "Val",  role: "Veteran guard",  color: "bg-amber-100 text-amber-700" },
  ben:  { initial: "B", label: "Ben",  role: "By-the-book",    color: "bg-sky-100 text-sky-700" },
  dana: { initial: "D", label: "Dana", role: "Devil's advocate", color: "bg-violet-100 text-violet-700" },
};

// ── Build chapter context from Module Five content ───────────────────

function getModuleContext(): { chapterContext: string; activityPrompt: string } {
  // Pull the reports section — this is what the discussion activity is about
  const reportsSection = moduleFiveContent.sections.find((s) => s.id === "reports");
  const notebooksSection = moduleFiveContent.sections.find((s) => s.id === "notebooks");

  const extractText = (blocks: typeof moduleFiveContent.sections[0]["blocks"]) =>
    blocks
      .map((b) => {
        if (b.kind === "paragraph") return b.text;
        if (b.kind === "callout") return `${b.label}: ${b.text}`;
        if (b.kind === "list") return b.items.join(" ");
        if (b.kind === "report") return `${b.title}\n${b.lines.join("\n")}`;
        return "";
      })
      .join(" ");

  const chapterContext = [
    reportsSection ? extractText(reportsSection.blocks) : "",
    notebooksSection ? extractText(notebooksSection.blocks) : "",
  ]
    .filter(Boolean)
    .join("\n\n");

  const activityPrompt =
    "Compare the two incident reports from the manual. Discuss with your classmates: " +
    "Which report better follows Module Five's guidelines? Look for personal opinion vs objective facts, " +
    "whether who/what/where/when/why/how are covered, and which details are missing or irrelevant.";

  return { chapterContext, activityPrompt };
}

const goals = [
  "Identify personal opinion vs objective facts",
  "Check who, what, where, when, why, how",
  "Spot missing or irrelevant details",
  "Decide which report better follows the manual",
];

type DiscussionView = "discussion" | "open_book";

export function DiscussionTab() {
  const [draft, setDraft] = useState("");
  const [view, setView] = useState<DiscussionView>("discussion");
  const chatMessages = useUnfoldStore((s) => s.chatMessages);
  const chatLoading = useUnfoldStore((s) => s.chatLoading);
  const chatSummary = useUnfoldStore((s) => s.chatSummary);
  const chatSubmitting = useUnfoldStore((s) => s.chatSubmitting);
  const sendChatMessage = useUnfoldStore((s) => s.sendChatMessage);
  const endActivity = useUnfoldStore((s) => s.endActivity);
  const clearChat = useUnfoldStore((s) => s.clearChat);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { chapterContext, activityPrompt } = useMemo(() => getModuleContext(), []);

  // Auto-scroll on new messages
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [chatMessages]);

  const handleSend = () => {
    const text = draft.trim();
    if (!text || chatLoading) return;
    setDraft("");
    sendChatMessage(text, chapterContext, activityPrompt);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <p className={eyebrow}>Discussion</p>
        <h1 className={sectionTitle}>AI class discussion</h1>
        <p className={helperText}>
          Compare incident reports and discuss which one better follows Module Five&apos;s guidelines.
        </p>
        <ViewToggle active={view} onChange={setView} />
      </header>

      {view === "open_book" ? (
        <ScrollablePdf
          startPage={moduleFiveContent.pageRange.start}
          endPage={moduleFiveContent.pageRange.end}
          height="70vh"
        />
      ) : chatSummary ? (
        <SummaryScreen summary={chatSummary} onRetry={clearChat} />
      ) : (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <section className="space-y-3">
            <ActivityCard />

            {/* Chat messages */}
            <div
              ref={scrollRef}
              className="flex max-h-[28rem] flex-col gap-2 overflow-y-auto rounded-2xl border border-black/10 bg-neutral-50/50 p-3"
            >
              {chatMessages.length === 0 && !chatLoading && (
                <p className="py-8 text-center text-[13px] text-neutral-400">
                  Start the discussion by sending a message below.
                </p>
              )}

              {chatMessages.map((msg, i) => {
                if (msg.role === "user") {
                  return (
                    <article key={i} className="flex gap-3 rounded-2xl border border-black/10 bg-white p-4">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-neutral-900 text-[12px] font-semibold text-white">
                        U
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-semibold text-neutral-950">You</p>
                        <p className="mt-1 text-[14px] leading-6 text-neutral-700">{msg.content}</p>
                      </div>
                    </article>
                  );
                }

                const info = AGENT_INFO[(msg.agent ?? "riya") as AgentKey] ?? AGENT_INFO.riya;
                return (
                  <article key={i} className="flex gap-3 rounded-2xl border border-black/10 bg-white p-4">
                    <span
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[12px] font-semibold ${info.color}`}
                    >
                      {info.initial}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2">
                        <p className="text-[13px] font-semibold text-neutral-950">{info.label}</p>
                        <p className="text-[11px] text-neutral-400">{info.role}</p>
                      </div>
                      <p className="mt-1 text-[14px] leading-6 text-neutral-700">{msg.content}</p>
                    </div>
                  </article>
                );
              })}

              {chatLoading && (
                <div className="flex items-center gap-2 px-4 py-3 text-[13px] text-neutral-400">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Classmates are typing…
                </div>
              )}
            </div>

            {/* Input + Submit */}
            <div className="flex items-center gap-2">
              <div className="flex flex-1 items-center gap-1 rounded-full border border-black/10 bg-white px-2 py-1">
                <input
                  className="min-w-0 flex-1 bg-transparent px-3 py-1.5 text-[13px] outline-none placeholder:text-neutral-400"
                  placeholder={chatLoading ? "Wait for classmates…" : "Add to the discussion…"}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={chatLoading || chatSubmitting}
                />
                <button
                  className="grid h-7 w-7 place-items-center rounded-full bg-neutral-950 text-white disabled:opacity-30"
                  type="button"
                  onClick={handleSend}
                  disabled={!draft.trim() || chatLoading || chatSubmitting}
                >
                  <Send className="h-3 w-3" />
                </button>
              </div>
              <button
                className={buttonPrimary}
                type="button"
                onClick={() => endActivity(activityPrompt)}
                disabled={chatMessages.length === 0 || chatLoading || chatSubmitting}
              >
                {chatSubmitting ? (
                  <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Grading…</>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </section>

          <aside className="space-y-3">
            <SidebarBox title="Discussion goals" items={goals} />
          </aside>
        </div>
      )}
    </div>
  );
}

function ActivityCard() {
  return (
    <div className="rounded-2xl border border-black/10 bg-gradient-to-b from-white to-neutral-50 p-4">
      <p className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">
        <Sparkles className="h-3 w-3" />
        Activity
      </p>
      <p className="mt-2 text-[14px] leading-6 text-neutral-800">
        Compare the two incident reports from the manual. Which one better follows Module Five&apos;s
        guidelines on objective facts, proper detail, and chronological reporting?
      </p>
    </div>
  );
}

function ViewToggle({ active, onChange }: { active: DiscussionView; onChange: (v: DiscussionView) => void }) {
  const views: { id: DiscussionView; label: string }[] = [
    { id: "discussion", label: "Discussion" },
    { id: "open_book", label: "Open-book" },
  ];
  return (
    <div className="inline-flex items-center gap-0.5 rounded-full border border-black/10 bg-white p-0.5">
      {views.map((v) => (
        <button
          key={v.id}
          className={`rounded-full px-3 py-1.5 text-[12px] font-medium transition ${
            active === v.id ? "bg-neutral-950 text-white" : "text-neutral-500 hover:text-neutral-950"
          }`}
          onClick={() => onChange(v.id)}
          type="button"
        >
          {v.label}
        </button>
      ))}
    </div>
  );
}

function SidebarBox({ items, title }: { items: string[]; title: string }) {
  return (
    <div className="rounded-xl border border-black/10 bg-white p-4">
      <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-400">{title}</p>
      <ul className="mt-2 space-y-1 text-[13px] leading-6 text-neutral-700">
        {items.map((item) => (
          <li key={item}>· {item}</li>
        ))}
      </ul>
    </div>
  );
}

function SummaryScreen({ summary, onRetry }: { summary: DiscussionSummary; onRetry: () => void }) {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* What you covered well */}
      {summary.covered.length > 0 && (
        <div className="rounded-2xl border border-black/10 bg-white p-5">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-emerald-600">What your group covered well</p>
          <div className="mt-4 space-y-4">
            {summary.covered.map((item, i) => (
              <div key={i}>
                <p className="flex items-center gap-2 text-[13px] font-semibold text-neutral-900">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                  {item.topic}
                </p>
                <ul className="mt-1.5 ml-6 space-y-1">
                  {item.highlights.map((h, j) => (
                    <li key={j} className="text-[13px] leading-6 text-neutral-600">· {h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* What you missed */}
      {summary.missed.length > 0 && (
        <div className="rounded-2xl border border-black/10 bg-white p-5">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-amber-600">Topics to revisit</p>
          <div className="mt-4 space-y-4">
            {summary.missed.map((item, i) => (
              <div key={i}>
                <p className="flex items-center gap-2 text-[13px] font-semibold text-neutral-900">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
                  {item.topic}
                </p>
                <p className="mt-1 ml-6 text-[13px] leading-6 text-neutral-600">{item.detail}</p>
                <button
                  className="mt-1.5 ml-6 text-[12px] font-medium text-sky-600 hover:text-sky-800 transition"
                  type="button"
                  onClick={() => {
                    useUnfoldStore.setState({ selectedSectionId: item.sectionId, activeTab: "read" });
                  }}
                >
                  Review: {item.sectionTitle}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Retry */}
      <div className="flex justify-center">
        <button className={buttonSecondary} type="button" onClick={onRetry}>
          <RotateCcw className="h-3.5 w-3.5" />
          Start new discussion
        </button>
      </div>
    </div>
  );
}

