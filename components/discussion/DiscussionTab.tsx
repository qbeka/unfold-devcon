"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { eyebrow, helperText, sectionTitle } from "@/lib/ui";

const goals = [
  "Identify personal opinion",
  "Check who, what, where, when, why, how",
  "Spot missing details",
  "Decide which report is more useful"
];

const messages = [
  {
    author: "Priya",
    role: "ESL learner",
    message:
      "I understand the report should explain what happened, but I am not sure when a description becomes an opinion."
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
    <div className="space-y-10">
      <header className="space-y-3">
        <p className={eyebrow}>Discussion</p>
        <h1 className={sectionTitle}>AI class discussion</h1>
        <p className={helperText}>
          Compare incident reports and decide which one better follows the manual&apos;s guidelines.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <section className="space-y-3">
          {messages.map((msg) => (
            <article key={msg.author} className="rounded-xl border border-black/10 bg-white p-4">
              <div className="flex items-baseline gap-2">
                <p className="text-[13px] font-medium text-neutral-950">{msg.author}</p>
                <p className="text-[11px] text-neutral-400">{msg.role}</p>
              </div>
              <p className="mt-1.5 text-[14px] leading-6 text-neutral-700">{msg.message}</p>
            </article>
          ))}
          <div className="flex items-center gap-1 rounded-full border border-black/10 bg-white px-2 py-1">
            <input
              className="min-w-0 flex-1 bg-transparent px-3 py-1.5 text-[13px] outline-none placeholder:text-neutral-400"
              placeholder="Add to the discussion…"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
            <button
              className="grid h-7 w-7 place-items-center rounded-full bg-neutral-950 text-white"
              type="button"
              onClick={() => setDraft("")}
            >
              <Send className="h-3 w-3" />
            </button>
          </div>
        </section>

        <aside className="space-y-3">
          <SidebarBox title="Goals" items={goals} />
          <SidebarBox
            title="Summary"
            items={[
              "Objective facts are stronger than guesses.",
              "Reports require relevant details.",
              "Next: practice removing opinion."
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
