"use client";

import { formatRemainingMs } from "@/lib/timer/format";
import type { TimerStatus } from "@/hooks/useZenTimer";
import { TimerRemainingBar } from "@/components/timer/TimerRemainingBar";

type TimerSessionHudProps = {
  status: TimerStatus;
  remainingMs: number;
  totalMs: number;
  onPause: () => void;
  onResume: () => void;
  onExit: () => void;
};

export function TimerSessionHud({
  status,
  remainingMs,
  totalMs,
  onPause,
  onResume,
  onExit,
}: TimerSessionHudProps) {
  const showPause = status === "running" || status === "immersive";
  const showResume = status === "paused";

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6">
      <TimerRemainingBar remainingMs={remainingMs} totalMs={totalMs} />
      <p
        className="font-mono text-4xl tabular-nums tracking-wider text-stone-200 sm:text-5xl"
        aria-live="polite"
        aria-atomic="true"
      >
        {formatRemainingMs(remainingMs)}
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {showPause && (
          <button
            type="button"
            onClick={onPause}
            className="rounded-full border border-stone-600/80 bg-stone-900/50 px-8 py-3 font-serif text-lg tracking-widest text-stone-300 transition-all duration-700 ease-in-out hover:border-stone-500 hover:text-stone-100"
          >
            Pause
          </button>
        )}
        {showResume && (
          <button
            type="button"
            onClick={onResume}
            className="sacred-glow rounded-full border border-amber-500/40 bg-amber-500/15 px-8 py-3 font-serif text-lg tracking-widest text-amber-300 transition-all duration-700 ease-in-out hover:bg-amber-500/25"
          >
            Continue
          </button>
        )}
        <button
          type="button"
          onClick={onExit}
          className="rounded-full border border-stone-700/80 bg-stone-900/40 px-8 py-3 text-sm tracking-widest text-stone-400 uppercase transition-all duration-700 ease-in-out hover:border-stone-600 hover:text-stone-300"
        >
          Exit
        </button>
      </div>
    </div>
  );
}
