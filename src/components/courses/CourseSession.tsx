"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { SafeAmbientVideo } from "@/components/media/SafeAmbientVideo";
import { ZenJournalModal } from "@/components/timer/ZenJournalModal";
import { safePlay } from "@/lib/media/safe-play";

type CourseSessionProps = {
  courseId: string;
  stepId: string;
  daySequence: number;
  title: string;
  guideUrl: string;
  bgVideoUrl: string | null;
  duration: number | null;
};

export function CourseSession({
  courseId,
  stepId,
  daySequence,
  title,
  guideUrl,
  bgVideoUrl,
  duration,
}: CourseSessionProps) {
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startedAtRef = useRef<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [journalOpen, setJournalOpen] = useState(false);
  const [completedLogId, setCompletedLogId] = useState<string | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [audioReady, setAudioReady] = useState(false);

  useEffect(() => {
    setAudioReady(false);
    setError(null);
  }, [guideUrl]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const handler = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const handleComplete = useCallback(async () => {
    if (completing) return;
    setCompleting(true);
    setError(null);

    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      setPlaying(false);
    }

    const elapsed = startedAtRef.current
      ? Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000))
      : duration ?? 60;

    try {
      const res = await fetch("/api/courses/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          courseId,
          stepId,
          duration: elapsed,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(
          typeof data.error === "string"
            ? data.error
            : "Could not save your progress."
        );
        setCompleting(false);
        return;
      }

      setCompletedLogId(data.logId ?? null);
      setJournalOpen(true);
    } catch {
      setError("Could not save your progress.");
      setCompleting(false);
    }
  }, [completing, courseId, stepId, duration]);

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }

    if (!audioReady || audio.error) {
      setError(
        "Audio is still loading. Wait a moment, or use Complete session below."
      );
      return;
    }

    if (!startedAtRef.current) {
      startedAtRef.current = Date.now();
    }

    const ok = await safePlay(audio);
    if (ok) {
      setPlaying(true);
      setError(null);
    } else {
      setError("Could not start playback. Try again or complete the session.");
    }
  }, [playing, audioReady]);

  const handleJournalClose = useCallback(() => {
    setJournalOpen(false);
    router.push("/courses");
    router.refresh();
  }, [router]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onEnded = () => {
      setPlaying(false);
      void handleComplete();
    };

    audio.addEventListener("ended", onEnded);
    return () => audio.removeEventListener("ended", onEnded);
  }, [handleComplete]);

  return (
    <div className="relative flex min-h-full flex-1 flex-col bg-background">
      {bgVideoUrl && !reduceMotion && (
        <SafeAmbientVideo
          src={bgVideoUrl}
          autoPlay
          className="pointer-events-none fixed inset-0 h-full w-full object-cover opacity-30"
        />
      )}

      <div className="fixed inset-0 bg-background/60" aria-hidden />

      <header className="relative z-10 flex items-center justify-between px-6 py-8">
        <Link
          href="/courses"
          className="text-xs tracking-widest text-stone-500 uppercase transition-all duration-700 ease-in-out hover:text-stone-300"
        >
          Back
        </Link>
        <span className="text-xs tracking-widest text-stone-500 uppercase">
          Day {daySequence}
        </span>
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center gap-10 px-6 pb-16">
        <div className="text-center">
          <h1 className="font-serif text-3xl tracking-wide text-stone-200">
            {title.replace(/^Day \d+: /, "")}
          </h1>
          {duration && (
            <p className="mt-2 text-sm tracking-wide text-stone-500">
              ~{Math.round(duration / 60)} min guided session
            </p>
          )}
        </div>

        <audio
          ref={audioRef}
          src={guideUrl}
          preload="metadata"
          onCanPlay={() => setAudioReady(true)}
          onLoadedMetadata={() => setAudioReady(true)}
          onError={() => {
            setAudioReady(false);
            setError(
              "Could not load guided audio. Check your connection, or complete the session below."
            );
          }}
        />

        <div className="flex flex-col items-center gap-6">
          <button
            type="button"
            onClick={() => void togglePlay()}
            disabled={completing}
            className="sacred-glow rounded-full border border-amber-500/40 bg-amber-500/15 px-10 py-4 font-serif text-lg tracking-widest text-amber-300 transition-all duration-700 ease-in-out hover:bg-amber-500/25 disabled:opacity-40"
            aria-pressed={playing}
          >
            {playing ? "Pause" : "Begin"}
          </button>

          <button
            type="button"
            onClick={() => void handleComplete()}
            disabled={completing}
            className="text-xs tracking-widest text-stone-500 uppercase transition-all duration-700 ease-in-out hover:text-stone-300 disabled:opacity-40"
          >
            {completing ? "Saving…" : "Complete session"}
          </button>
        </div>

        {error && (
          <p className="text-sm text-amber-600/90" role="alert">
            {error}
          </p>
        )}
      </main>

      <ZenJournalModal
        logId={completedLogId}
        open={journalOpen}
        onClose={handleJournalClose}
      />
    </div>
  );
}
