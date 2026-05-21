"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { SafeAmbientVideo } from "@/components/media/SafeAmbientVideo";
import { ZenJournalModal } from "@/components/timer/ZenJournalModal";
import { safePlay } from "@/lib/media/safe-play";

type DailyZenData = {
  id: string;
  theme: string;
  guideUrl: string;
  bgVideoUrl: string | null;
  duration: number | null;
};

function DailyZenPlayer() {
  const searchParams = useSearchParams();
  const audioIdParam = searchParams.get("audioId");

  const [daily, setDaily] = useState<DailyZenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [journalOpen, setJournalOpen] = useState(false);
  const [completedLogId, setCompletedLogId] = useState<string | null>(null);
  const [audioReady, setAudioReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startedAtRef = useRef<number | null>(null);

  useEffect(() => {
    setAudioReady(false);
  }, [daily?.guideUrl]);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/daily-zen", { credentials: "include" });
        if (!res.ok) {
          setError("Could not load today's practice.");
          return;
        }
        const data = await res.json();
        setDaily({
          id: audioIdParam ?? data.id,
          theme: data.theme,
          guideUrl: data.guideUrl,
          bgVideoUrl: data.bgVideoUrl,
          duration: data.duration,
        });
      } catch {
        setError("Could not load today's practice.");
      } finally {
        setLoading(false);
      }
    })();
  }, [audioIdParam]);

  const handleComplete = useCallback(async () => {
    if (!daily) return;
    const audio = audioRef.current;
    if (audio) audio.pause();
    setPlaying(false);

    const elapsed = startedAtRef.current
      ? Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000))
      : daily.duration ?? 180;

    try {
      const res = await fetch("/api/meditate/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          audioId: daily.id,
          duration: elapsed,
          logType: "COURSE",
        }),
      });

      if (!res.ok) {
        setError("Could not log your session.");
        return;
      }

      const data = await res.json();
      setCompletedLogId(data.logId);
      setJournalOpen(true);
    } catch {
      setError("Could not log your session.");
    }
  }, [daily]);

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !daily) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }

    if (!audioReady || audio.error) {
      setError("Audio is still loading. Wait a moment, or tap Complete.");
      return;
    }

    if (!startedAtRef.current) startedAtRef.current = Date.now();

    const ok = await safePlay(audio);
    if (ok) {
      setPlaying(true);
      setError(null);
    } else {
      setError("Could not start playback. Try again or tap Complete.");
    }
  }, [playing, daily, audioReady]);

  if (loading) {
    return (
      <p className="text-sm tracking-wide text-stone-500">Loading…</p>
    );
  }

  if (!daily) {
    return (
      <div className="text-center">
        <p className="text-stone-400">{error ?? "Practice unavailable."}</p>
        <Link
          href="/courses"
          className="mt-6 inline-block text-sm text-amber-500/80 uppercase"
        >
          Back to courses
        </Link>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-full flex-1 flex-col">
      {daily.bgVideoUrl && (
        <SafeAmbientVideo
          src={daily.bgVideoUrl}
          autoPlay
          className="pointer-events-none fixed inset-0 h-full w-full object-cover opacity-25"
        />
      )}
      <header className="relative z-10 px-6 py-8">
        <Link
          href="/courses"
          className="text-xs tracking-widest text-stone-500 uppercase hover:text-stone-300"
        >
          Back
        </Link>
      </header>
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8 px-6">
        <h1 className="font-serif text-3xl text-stone-200">{daily.theme}</h1>
        <audio
          ref={audioRef}
          src={daily.guideUrl}
          preload="metadata"
          onCanPlay={() => setAudioReady(true)}
          onLoadedMetadata={() => setAudioReady(true)}
          onError={() => {
            setAudioReady(false);
            setError("Could not load audio. Try again or tap Complete.");
          }}
          onEnded={() => void handleComplete()}
        />
        <button
          type="button"
          onClick={() => void togglePlay()}
          className="sacred-glow rounded-full border border-amber-500/40 bg-amber-500/15 px-10 py-4 font-serif text-lg tracking-widest text-amber-300"
        >
          {playing ? "Pause" : "Begin"}
        </button>
        <button
          type="button"
          onClick={() => void handleComplete()}
          className="text-xs tracking-widest text-stone-500 uppercase"
        >
          Complete
        </button>
        {error && (
          <p className="text-sm text-amber-600/90" role="alert">
            {error}
          </p>
        )}
      </main>
      <ZenJournalModal
        logId={completedLogId}
        open={journalOpen}
        onClose={() => {
          setJournalOpen(false);
          window.location.href = "/courses";
        }}
      />
    </div>
  );
}

export default function DailyPage() {
  return (
    <div className="min-h-full bg-background">
      <Suspense
        fallback={
          <p className="p-12 text-center text-stone-500">Loading…</p>
        }
      >
        <DailyZenPlayer />
      </Suspense>
    </div>
  );
}
