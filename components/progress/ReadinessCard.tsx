export function ReadinessCard({ score }: { score: number }) {
  return (
    <div className="rounded-xl border border-black/10 bg-neutral-950 p-5 text-white">
      <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-400">
        Readiness
      </p>
      <div className="mt-5 flex items-end gap-1.5">
        <span className="text-[58px] font-semibold leading-none tracking-tighter2">{score}</span>
        <span className="pb-2 text-[14px] text-neutral-400">%</span>
      </div>
      <div className="mt-5 h-1 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-white transition-[width] duration-500" style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}
