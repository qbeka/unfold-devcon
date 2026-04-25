export function WeakAreasList({
  improvedAreas,
  weakAreas
}: {
  improvedAreas: string[];
  weakAreas: string[];
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Panel title="Weak areas" tone="weak" items={weakAreas} emptyText="No weak areas recorded." />
      <Panel
        title="Improved"
        tone="improved"
        items={improvedAreas}
        emptyText="Complete practice to move concepts here."
      />
    </div>
  );
}

function Panel({
  emptyText,
  items,
  title,
  tone
}: {
  emptyText: string;
  items: string[];
  title: string;
  tone: "weak" | "improved";
}) {
  const accent = tone === "weak" ? "text-amber-700 bg-amber-50" : "text-emerald-700 bg-emerald-50";
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-slate-400">{title}</p>
      <div className="mt-3 space-y-1.5">
        {items.length === 0 ? (
          <p className="text-sm text-slate-400">{emptyText}</p>
        ) : (
          items.map((item) => (
            <div key={item} className={`rounded-xl px-3 py-2 text-sm font-medium ${accent}`}>
              {item}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
