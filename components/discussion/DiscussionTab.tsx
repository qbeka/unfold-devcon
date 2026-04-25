import { card, label } from "@/lib/ui";

const goals = [
  "Identify personal opinion",
  "Check if the report includes who, what, where, when, why, and how",
  "Check if important information is missing",
  "Decide which report is more useful for an investigation"
];

const messages = [
  {
    author: "Priya",
    role: "ESL learner who asks clarifying questions",
    message:
      "I understand that the report should explain what happened, but I am not sure when a description becomes an opinion."
  },
  {
    author: "Daniel",
    role: "Rule-focused student who references the manual",
    message:
      "The manual says reports should be accurate and free from personal opinion. The better report sentence includes who reported the theft and the time."
  }
];

export function DiscussionTab() {
  return (
    <div className={`${card} p-6 lg:p-8`}>
      <p className={label}>Discussion activity</p>
      <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
        AI Class Discussion
      </h2>
      <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-600">
        Compare incident reports and decide which report better follows the manual&apos;s
        guidelines.
      </p>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_22rem]">
        <section className="rounded-3xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-bold text-slate-950">Class messages</h3>
          <div className="mt-5 space-y-4">
            {messages.map((message) => (
              <div key={message.author} className="rounded-3xl bg-slate-50 p-4">
                <div className="flex flex-wrap items-baseline gap-2">
                  <p className="font-bold text-slate-950">{message.author}</p>
                  <p className="text-xs font-semibold text-slate-500">{message.role}</p>
                </div>
                <p className="mt-2 leading-7 text-slate-700">{message.message}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Class message
            </label>
            <div className="mt-3 flex gap-2">
              <input
                className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
                aria-label="Class message"
              />
              <button className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white" type="button">
                Send
              </button>
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <Panel title="Discussion goals" items={goals} />
          <Panel
            title="Discussion summary"
            items={[
              "Objective facts are stronger than guesses.",
              "The source manual requires clear, relevant details.",
              "Next step: practice removing opinion from report sentences."
            ]}
          />
          <Panel
            title="Weak areas"
            items={["Personal opinion", "Relevant details", "Report completeness"]}
          />
        </aside>
      </div>
    </div>
  );
}

function Panel({ items, title }: { items: string[]; title: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5">
      <h3 className="text-lg font-bold text-slate-950">{title}</h3>
      <div className="mt-4 space-y-2">
        {items.map((item) => (
          <p key={item} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}
