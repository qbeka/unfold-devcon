export function ReadinessCard({ score }: { score: number }) {
  return (
    <div className="rounded-[1.25rem] border border-slate-200 bg-slate-950 p-6 text-white">
      <p className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-slate-400">
        Readiness
      </p>
      <div className="mt-5 flex items-end gap-1.5">
        <span className="text-[3.5rem] font-semibold leading-none tracking-[-0.04em]">{score}</span>
        <span className="pb-2 text-base text-slate-400">%</span>
      </div>
      <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-white" style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}
