export function CardSkeleton({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-obsidian-850/60 p-5 animate-pulse"
        >
          <div className="h-44 rounded-xl bg-zinc-200 dark:bg-white/5 mb-4" />
          <div className="h-5 w-3/4 rounded bg-zinc-200 dark:bg-white/10 mb-2" />
          <div className="h-4 w-full rounded bg-zinc-200 dark:bg-white/5 mb-1.5" />
          <div className="h-4 w-2/3 rounded bg-zinc-200 dark:bg-white/5" />
        </div>
      ))}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white dark:bg-obsidian-950">
      <div className="w-10 h-10 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" />
      <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium tracking-wide">
        Loading experience...
      </p>
    </div>
  );
}
