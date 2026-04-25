export function WeakAreasList({
  improvedAreas,
  weakAreas
}: {
  improvedAreas: string[];
  weakAreas: string[];
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Panel title="Weak areas" tone="weak" items={weakAreas} emptyText="No weak areas recorded." />
      <Panel title="Improved" tone="improved" items={improvedAreas} emptyText="Complete practice to move concepts here." />
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
    <div className="rounded-xl border border-black/10 bg-white p-4">
      <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-400">{title}</p>
      <div className="mt-2 space-y-1.5">
        {items.length === 0 ? (
          <p className="text-[12px] text-neutral-400">{emptyText}</p>
        ) : (
          items.map((item) => (
            <div key={item} className={`rounded-lg px-3 py-1.5 text-[13px] font-medium ${accent}`}>
              {item}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
