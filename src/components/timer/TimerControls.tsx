"use client";

import { formatRemainingMs } from "@/lib/timer/format";
import type { TimerStatus } from "@/hooks/useZenTimer";

type TimerControlsProps = {
  status: TimerStatus;
  remainingMs: number;
  onStart: () => void;
  onReset: () => void;
};

export function TimerControls({
  status,
  remainingMs,
  onStart,
  onReset,
}: TimerControlsProps) {
  const isActive =
    status === "running" || status === "immersive" || status === "completed";
  const canStart = status === "armed";
  const showReset = status !== "idle";

  if (status === "completed") {
    return (
      <div className="flex flex-col items-center gap-6">
        <p className="font-serif text-xl tracking-wide text-amber-300/90">
          Session complete
        </p>
        <p className="text-sm tracking-wide text-stone-500">
          May you carry this stillness with you.
        </p>
        <button
          type="button"
          onClick={onReset}
          className="rounded-full border border-amber-500/30 bg-amber-500/10 px-8 py-3 font-serif text-lg tracking-widest text-amber-400/90 transition-all duration-700 ease-in-out hover:border-amber-500/50 hover:bg-amber-500/20"
        >
          Begin again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <p
        className="font-mono text-5xl tabular-nums tracking-wider text-stone-200"
        aria-live="polite"
        aria-atomic="true"
      >
        {formatRemainingMs(remainingMs)}
      </p>

      <div className="flex gap-3">
        {!isActive && (
          <button
            type="button"
            disabled={!canStart}
            onClick={onStart}
            className="sacred-glow rounded-full border border-amber-500/40 bg-amber-500/15 px-8 py-3 font-serif text-lg tracking-widest text-amber-300 transition-all duration-700 ease-in-out hover:bg-amber-500/25 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Start
          </button>
        )}
        {showReset && (
          <button
            type="button"
            onClick={onReset}
            className="rounded-full border border-stone-700/80 bg-stone-900/40 px-6 py-3 text-sm tracking-widest text-stone-400 uppercase transition-all duration-700 ease-in-out hover:border-stone-600 hover:text-stone-300"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
