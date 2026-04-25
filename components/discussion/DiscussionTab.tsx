"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { buttonGhost, helperText, label, sectionHeading } from "@/lib/ui";

const goals = [
  "Identify personal opinion",
  "Check if the report includes who, what, where, when, why, and how",
  "Check if important information is missing",
  "Decide which report is more useful for an investigation"
];

const messages = [
  {
    author: "Priya",
    role: "ESL learner",
    message:
      "I understand that the report should explain what happened, but I am not sure when a description becomes an opinion."
  },
  {
    author: "Daniel",
    role: "Rule-focused student",
    message:
      "The manual says reports should be accurate and free from personal opinion. The better sentence includes who reported the theft and the time."
  }
];

export function DiscussionTab() {
  const [draft, setDraft] = useState("");

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <p className={label}>Discussion</p>
        <h1 className={sectionHeading}>AI class discussion</h1>
        <p className={helperText}>
          Compare incident reports and decide which one better follows the manual&apos;s guidelines.
          Lawrence&apos;s live discussion logic plugs into this surface.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
        <section className="space-y-4">
          {messages.map((msg) => (
            <article key={msg.author} className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-baseline gap-2">
                <p className="text-sm font-semibold text-slate-950">{msg.author}</p>
                <p className="text-xs text-slate-400">{msg.role}</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">{msg.message}</p>
            </article>
          ))}
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5">
            <input
              className="min-w-0 flex-1 bg-transparent px-1 py-1.5 text-sm outline-none placeholder:text-slate-400"
              placeholder="Add to the discussion…"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
            <button
              className="grid h-8 w-8 place-items-center rounded-full bg-slate-950 text-white"
              type="button"
              onClick={() => setDraft("")}
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </section>

        <aside className="space-y-4">
          <SidebarBox title="Goals" items={goals} />
          <SidebarBox
            title="Summary"
            items={[
              "Objective facts are stronger than guesses.",
              "Reports require clear, relevant details.",
              "Next: practice removing opinion from sentences."
            ]}
          />
          <SidebarBox
            title="Weak areas"
            items={["Personal opinion", "Relevant details", "Report completeness"]}
          />
        </aside>
      </div>
    </div>
  );
}

function SidebarBox({ items, title }: { items: string[]; title: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-400">{title}</p>
      <ul className="mt-3 space-y-1.5 text-sm leading-6 text-slate-600">
        {items.map((item) => (
          <li key={item}>· {item}</li>
        ))}
      </ul>
    </div>
  );
}
