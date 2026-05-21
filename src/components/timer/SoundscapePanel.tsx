"use client";

import type { AmbientTrack } from "@/hooks/useAudioMixer";
import type { TimerStatus } from "@/hooks/useZenTimer";

type SoundscapePanelProps = {
  tracks: AmbientTrack[];
  volumes: Record<string, number>;
  status: TimerStatus;
  isReady: boolean;
  error: string | null;
  onVolumeChange: (trackId: string, volume: number) => void;
};

export function SoundscapePanel({
  tracks,
  volumes,
  status,
  isReady,
  error,
  onVolumeChange,
}: SoundscapePanelProps) {
  const disabled =
    status === "running" || status === "immersive" || status === "completed";

  if (error) {
    return (
      <p className="text-center text-sm text-stone-500" role="alert">
        Soundscapes unavailable. Check your connection or storage URLs.
      </p>
    );
  }

  if (!isReady) {
    return (
      <p className="text-center text-sm tracking-wide text-stone-500">
        Loading soundscapes…
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-center font-serif text-sm tracking-widest text-stone-500 uppercase">
        Ambient mix
      </p>
      {tracks.map((track) => (
        <label
          key={track.id}
          className="flex items-center gap-4 text-sm text-stone-400"
        >
          <span className="w-36 shrink-0 tracking-wide">{track.name}</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            disabled={disabled}
            value={volumes[track.id] ?? 0}
            onChange={(e) =>
              onVolumeChange(track.id, Number(e.target.value))
            }
            className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-stone-700 accent-amber-500 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={`${track.name} volume`}
          />
        </label>
      ))}
    </div>
  );
}
