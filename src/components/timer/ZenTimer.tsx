"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BreathingBubble } from "@/components/timer/BreathingBubble";
import { DurationPicker } from "@/components/timer/DurationPicker";
import { TimerChrome } from "@/components/timer/TimerChrome";
import { TimerControls } from "@/components/timer/TimerControls";
import { useZenTimer } from "@/hooks/useZenTimer";
import { DEFAULT_PRESET_MINUTES } from "@/lib/timer/constants";

export function ZenTimer() {
  const [selectedMinutes, setSelectedMinutes] = useState(
    DEFAULT_PRESET_MINUTES
  );

  const timer = useZenTimer({
    onStart: () => {
      // TODO Phase B: singing bowl chime at session start
    },
    onComplete: () => {
      // TODO Phase B: singing bowl chime at session complete
    },
  });

  const handleSelectMinutes = (minutes: number) => {
    setSelectedMinutes(minutes);
    timer.setDuration(minutes);
  };

  const showBubble =
    timer.status === "running" || timer.status === "immersive";

  const selectedMinutesResolved = useMemo(() => {
    return Math.round(timer.totalMs / 60000) || selectedMinutes;
  }, [timer.totalMs, selectedMinutes]);

  return (
    <div className="relative flex min-h-full flex-1 flex-col items-center justify-center bg-background px-6">
      <BreathingBubble visible={showBubble} />

      <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-8">
        <Link
          href="/"
          className="font-serif text-sm tracking-widest text-stone-500 uppercase transition-colors duration-700 hover:text-stone-300"
        >
          MindEase
        </Link>
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8 py-24">
        {!showBubble && (
          <div
            className="sacred-glow h-32 w-32 rounded-full bg-amber-500/10 blur-sm"
            aria-hidden
          />
        )}
        {showBubble && <div className="h-40 w-40" aria-hidden />}
      </main>

      <footer className="relative z-10 w-full max-w-md px-6 pb-12">
        <TimerChrome isImmersive={timer.isImmersive}>
          <div className="flex flex-col gap-8 rounded-2xl border border-stone-800/60 bg-stone-900/30 px-6 py-8">
            {timer.status !== "completed" && (
              <DurationPicker
                status={timer.status}
                selectedMinutes={selectedMinutesResolved}
                onSelectMinutes={handleSelectMinutes}
              />
            )}
            <TimerControls
              status={timer.status}
              remainingMs={timer.remainingMs}
              onStart={timer.start}
              onReset={timer.reset}
            />
          </div>
        </TimerChrome>
      </footer>
    </div>
  );
}
