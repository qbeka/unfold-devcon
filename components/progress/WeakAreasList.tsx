export function WeakAreasList({
  improvedAreas,
  weakAreas
}: {
  improvedAreas: string[];
  weakAreas: string[];
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <AreaPanel title="Weak areas" tone="weak" items={weakAreas} emptyText="No weak areas recorded." />
      <AreaPanel
        title="Improved areas"
        tone="improved"
        items={improvedAreas}
        emptyText="Complete practice to move concepts here."
      />
    </div>
  );
}

function AreaPanel({
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
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5">
      <h3 className="text-lg font-bold text-slate-950">{title}</h3>
      <div className="mt-4 space-y-2">
        {items.length === 0 ? (
          <p className="text-sm text-slate-500">{emptyText}</p>
        ) : (
          items.map((item) => (
            <div
              key={item}
              className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
                tone === "weak" ? "bg-amber-50 text-amber-950" : "bg-emerald-50 text-emerald-950"
              }`}
            >
              {item}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
