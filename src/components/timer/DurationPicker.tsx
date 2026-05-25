"use client";

import { useState } from "react";
import {
  CUSTOM_MAX_MINUTES,
  CUSTOM_MIN_MINUTES,
  PRESET_MINUTES,
} from "@/lib/timer/constants";
import type { TimerStatus } from "@/hooks/useZenTimer";

type DurationPickerProps = {
  status: TimerStatus;
  selectedMinutes: number;
  onSelectMinutes: (minutes: number) => void;
};

const customOptions = Array.from(
  { length: CUSTOM_MAX_MINUTES - CUSTOM_MIN_MINUTES + 1 },
  (_, i) => i + CUSTOM_MIN_MINUTES
);

export function DurationPicker({
  status,
  selectedMinutes,
  onSelectMinutes,
}: DurationPickerProps) {
  const [showCustom, setShowCustom] = useState(false);
  const disabled =
    status === "running" ||
    status === "immersive" ||
    status === "paused" ||
    status === "completed";

  const isPreset = (PRESET_MINUTES as readonly number[]).includes(
    selectedMinutes
  );

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-wrap justify-center gap-2">
        {PRESET_MINUTES.map((minutes) => {
          const active = !showCustom && selectedMinutes === minutes;
          return (
            <button
              key={minutes}
              type="button"
              disabled={disabled}
              onClick={() => {
                setShowCustom(false);
                onSelectMinutes(minutes);
              }}
              className={`rounded-full px-5 py-2 text-sm tracking-widest uppercase transition-all duration-700 ease-in-out ${
                active
                  ? "sacred-glow border border-amber-500/40 bg-amber-500/15 text-amber-300"
                  : "border border-stone-700/80 bg-stone-900/40 text-stone-400 hover:border-stone-600 hover:text-stone-300"
              } disabled:cursor-not-allowed disabled:opacity-40`}
            >
              {minutes} min
            </button>
          );
        })}
        <button
          type="button"
          disabled={disabled}
          onClick={() => setShowCustom((v) => !v)}
          className={`rounded-full px-5 py-2 text-sm tracking-widest uppercase transition-all duration-700 ease-in-out ${
            showCustom || !isPreset
              ? "sacred-glow border border-amber-500/40 bg-amber-500/15 text-amber-300"
              : "border border-stone-700/80 bg-stone-900/40 text-stone-400 hover:border-stone-600 hover:text-stone-300"
          } disabled:cursor-not-allowed disabled:opacity-40`}
        >
          Custom
        </button>
      </div>

      {showCustom && (
        <div
          className="mx-auto h-36 w-full max-w-[12rem] overflow-y-auto scroll-smooth rounded-2xl border border-stone-800/60 bg-stone-900/50 snap-y snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="listbox"
          aria-label="Custom duration in minutes"
        >
          {customOptions.map((minutes) => {
            const active = selectedMinutes === minutes;
            return (
              <button
                key={minutes}
                type="button"
                disabled={disabled}
                onClick={() => onSelectMinutes(minutes)}
                className={`flex h-12 w-full shrink-0 snap-center items-center justify-center text-lg transition-all duration-700 ease-in-out ${
                  active
                    ? "font-serif text-amber-300"
                    : "text-stone-500 hover:text-stone-300"
                } disabled:cursor-not-allowed disabled:opacity-40`}
              >
                {minutes} min
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
