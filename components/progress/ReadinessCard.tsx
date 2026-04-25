export function ReadinessCard({ score }: { score: number }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
        Exam readiness
      </p>
      <div className="mt-5 flex items-end gap-2">
        <span className="text-6xl font-bold tracking-tight">{score}</span>
        <span className="pb-2 text-xl font-semibold text-slate-300">%</span>
      </div>
      <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-white" style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}
