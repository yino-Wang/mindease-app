"use client";

type TimerRemainingBarProps = {
  remainingMs: number;
  totalMs: number;
};

export function TimerRemainingBar({
  remainingMs,
  totalMs,
}: TimerRemainingBarProps) {
  const progress =
    totalMs > 0
      ? Math.min(100, Math.max(0, (remainingMs / totalMs) * 100))
      : 0;

  return (
    <div className="w-full max-w-md space-y-2">
      <div className="flex items-center justify-between text-xs tracking-widest text-stone-500 uppercase">
        <span>Time remaining</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-stone-800/80"
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Time remaining"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-600/80 to-amber-400/90 transition-[width] duration-300 ease-linear motion-reduce:transition-none"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
