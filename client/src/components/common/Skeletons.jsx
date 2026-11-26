import { motion } from 'framer-motion';
import { Code2, Loader2, Server } from 'lucide-react';

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

export function PageLoader({ coldStart = false }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-white dark:bg-obsidian-950">
      {/* Animated logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-2xl shadow-indigo-500/30">
          <Code2 className="w-9 h-9 text-white" />
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="absolute -inset-3"
        >
          <div className="w-full h-full rounded-[1.75rem] border-2 border-transparent border-t-indigo-500 border-r-indigo-500/30" />
        </motion.div>
      </motion.div>

      {/* Loading text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center space-y-2"
      >
        <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-200 tracking-wide">
          Loading Portfolio
        </p>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
              className="w-1.5 h-1.5 rounded-full bg-indigo-500"
            />
          ))}
        </div>
      </motion.div>

      {/* Cold start message */}
      {coldStart && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 max-w-sm mx-4"
        >
          <Server className="w-5 h-5 text-amber-500 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
              Server is starting up
            </p>
            <p className="text-[11px] text-amber-600/70 dark:text-amber-400/70 mt-0.5">
              Free tier cold start — please wait 15-30 seconds
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export function SectionEmpty({ icon: Icon = Code2, title, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card rounded-3xl p-10 sm:p-14 text-center space-y-3"
    >
      <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-white/[0.04] flex items-center justify-center mx-auto">
        <Icon className="w-7 h-7 text-zinc-400 dark:text-zinc-500" />
      </div>
      <h3 className="text-base font-semibold text-zinc-500 dark:text-zinc-400">{title}</h3>
      <p className="text-sm text-zinc-400 dark:text-zinc-500 max-w-md mx-auto">{subtitle}</p>
    </motion.div>
  );
}
