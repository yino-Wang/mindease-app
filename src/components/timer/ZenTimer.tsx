"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BreathingBubble } from "@/components/timer/BreathingBubble";
import { DurationPicker } from "@/components/timer/DurationPicker";
import { SoundscapePanel } from "@/components/timer/SoundscapePanel";
import { TimerChrome } from "@/components/timer/TimerChrome";
import { TimerControls } from "@/components/timer/TimerControls";
import { ZenJournalModal } from "@/components/timer/ZenJournalModal";
import { useAudioMixer, type AmbientTrack } from "@/hooks/useAudioMixer";
import { useChime } from "@/hooks/useChime";
import { useZenTimer } from "@/hooks/useZenTimer";
import { DEFAULT_PRESET_MINUTES } from "@/lib/timer/constants";

export function ZenTimer() {
  const [selectedMinutes, setSelectedMinutes] = useState(
    DEFAULT_PRESET_MINUTES
  );
  const [tracks, setTracks] = useState<AmbientTrack[]>([]);
  const [volumes, setVolumes] = useState<Record<string, number>>({});
  const [primaryAudioId, setPrimaryAudioId] = useState<string | undefined>();
  const [journalOpen, setJournalOpen] = useState(false);
  const [completedLogId, setCompletedLogId] = useState<string | null>(null);
  const [logError, setLogError] = useState<string | null>(null);

  const mixer = useAudioMixer();
  const chime = useChime();
  const sessionStartedAtRef = useRef<number | null>(null);
  const totalMsRef = useRef(0);

  const handleSessionComplete = useCallback(async () => {
    await chime.play();
    mixer.stop();

    const elapsed = sessionStartedAtRef.current
      ? Math.max(
          1,
          Math.round((Date.now() - sessionStartedAtRef.current) / 1000)
        )
      : Math.max(1, Math.round(totalMsRef.current / 1000));

    sessionStartedAtRef.current = null;

    try {
      const res = await fetch("/api/meditate/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          audioId: primaryAudioId,
          duration: elapsed,
          logType: "TIMER",
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setLogError(
          typeof data.error === "string"
            ? data.error
            : "Session could not be logged."
        );
        setJournalOpen(false);
        return;
      }

      const data = await res.json();
      setCompletedLogId(data.logId);
      setLogError(null);
      setJournalOpen(true);
    } catch {
      setLogError("Session could not be logged.");
    }
  }, [chime, mixer, primaryAudioId]);

  const timer = useZenTimer({
    onStart: () => {
      void (async () => {
        await chime.ensureContext();
        await mixer.ensureContext();
        await chime.play();
        sessionStartedAtRef.current = Date.now();
        await mixer.start();
      })();
    },
    onComplete: () => {
      void handleSessionComplete();
    },
  });

  totalMsRef.current = timer.totalMs;

  useEffect(() => {
    async function loadTracks() {
      try {
        const res = await fetch("/api/ambient-tracks");
        if (!res.ok) return;
        const data = await res.json();
        const list: AmbientTrack[] = data.tracks ?? [];
        setTracks(list);
        const initial: Record<string, number> = {};
        list.forEach((t, i) => {
          initial[t.id] = i === 0 ? 0.6 : 0;
        });
        setVolumes(initial);
        if (list[0]) setPrimaryAudioId(list[0].id);
        await mixer.loadTracks(list);
      } catch {
        // mixer error state handles display
      }
    }
    void loadTracks();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once on mount
  }, []);

  const handleVolumeChange = useCallback(
    (trackId: string, volume: number) => {
      setVolumes((prev) => ({ ...prev, [trackId]: volume }));
      mixer.setTrackVolume(trackId, volume);
      if (volume > 0) setPrimaryAudioId(trackId);
    },
    [mixer]
  );

  const handleSelectMinutes = (minutes: number) => {
    setSelectedMinutes(minutes);
    timer.setDuration(minutes);
  };

  const handleStart = async () => {
    await chime.ensureContext();
    await mixer.ensureContext();
    timer.start();
  };

  const handleReset = () => {
    mixer.stop();
    sessionStartedAtRef.current = null;
    setJournalOpen(false);
    setCompletedLogId(null);
    setLogError(null);
    timer.reset();
  };

  const showBubble =
    timer.status === "running" || timer.status === "immersive";

  const selectedMinutesResolved = useMemo(() => {
    return Math.round(timer.totalMs / 60000) || selectedMinutes;
  }, [timer.totalMs, selectedMinutes]);

  const showSoundscapes =
    timer.status === "idle" || timer.status === "armed";

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
                <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="text-xs tracking-widest text-stone-500 uppercase transition-colors duration-700 hover:text-stone-300"
          >
            Sign out
          </button>
        </form>
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
            {showSoundscapes && (
              <SoundscapePanel
                tracks={tracks}
                volumes={volumes}
                status={timer.status}
                isReady={mixer.isReady}
                error={mixer.error}
                onVolumeChange={handleVolumeChange}
              />
            )}
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
              onStart={handleStart}
              onReset={handleReset}
            />
            {logError && timer.status === "completed" && (
              <p className="text-center text-sm text-stone-500" role="alert">
                {logError}
              </p>
            )}
          </div>
        </TimerChrome>
      </footer>

      <ZenJournalModal
        logId={completedLogId}
        open={journalOpen}
        onClose={() => {
          setJournalOpen(false);
          setCompletedLogId(null);
        }}
      />
    </div>
  );
}

