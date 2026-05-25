"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  DEFAULT_PRESET_MINUTES,
  IMMERSIVE_DELAY_MS,
} from "@/lib/timer/constants";

export type TimerStatus =
  | "idle"
  | "armed"
  | "running"
  | "immersive"
  | "paused"
  | "completed";

export type UseZenTimerOptions = {
  onStart?: () => void;
  onComplete?: () => void;
  immersiveDelayMs?: number;
};

function minutesToMs(minutes: number) {
  return minutes * 60 * 1000;
}

export function useZenTimer(options: UseZenTimerOptions = {}) {
  const immersiveDelayMs = options.immersiveDelayMs ?? IMMERSIVE_DELAY_MS;

  const [status, setStatus] = useState<TimerStatus>("idle");
  const [totalMs, setTotalMs] = useState(minutesToMs(DEFAULT_PRESET_MINUTES));
  const [remainingMs, setRemainingMs] = useState(
    minutesToMs(DEFAULT_PRESET_MINUTES)
  );
  const [isImmersive, setIsImmersive] = useState(false);

  const endAtRef = useRef<number | null>(null);
  const immersiveAtRef = useRef<number | null>(null);
  const pausedImmersiveDelayRef = useRef(IMMERSIVE_DELAY_MS);
  const pausedWasImmersiveRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const onStartRef = useRef(options.onStart);
  const onCompleteRef = useRef(options.onComplete);

  useEffect(() => {
    onStartRef.current = options.onStart;
    onCompleteRef.current = options.onComplete;
  }, [options.onStart, options.onComplete]);

  const cancelTick = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    const endAt = endAtRef.current;
    if (endAt === null) return;

    const now = Date.now();
    const nextRemaining = Math.max(0, endAt - now);
    setRemainingMs(nextRemaining);

    const immersiveAt = immersiveAtRef.current;
    if (immersiveAt !== null && now >= immersiveAt) {
      setIsImmersive(true);
      setStatus((prev) => (prev === "running" ? "immersive" : prev));
    }

    if (nextRemaining <= 0) {
      cancelTick();
      endAtRef.current = null;
      immersiveAtRef.current = null;
      setIsImmersive(false);
      setStatus("completed");
      onCompleteRef.current?.();
      return;
    }

    rafRef.current = requestAnimationFrame(tick);
  }, [cancelTick]);

  const setDuration = useCallback(
    (minutes: number) => {
      if (status !== "idle" && status !== "armed") return;
      const ms = minutesToMs(minutes);
      setTotalMs(ms);
      setRemainingMs(ms);
      setStatus("armed");
    },
    [status]
  );

  const start = useCallback(() => {
    if (status !== "armed") return;

    const now = Date.now();
    endAtRef.current = now + remainingMs;
    immersiveAtRef.current = now + immersiveDelayMs;
    setIsImmersive(false);
    setStatus("running");
    onStartRef.current?.();
    cancelTick();
    rafRef.current = requestAnimationFrame(tick);
  }, [status, remainingMs, immersiveDelayMs, cancelTick, tick]);

  const pause = useCallback(() => {
    if (status !== "running" && status !== "immersive") return;

    cancelTick();
    const now = Date.now();

    if (endAtRef.current !== null) {
      setRemainingMs(Math.max(0, endAtRef.current - now));
    }

    pausedWasImmersiveRef.current = isImmersive;
    pausedImmersiveDelayRef.current =
      immersiveAtRef.current !== null
        ? Math.max(0, immersiveAtRef.current - now)
        : immersiveDelayMs;

    endAtRef.current = null;
    immersiveAtRef.current = null;
    setStatus("paused");
  }, [status, isImmersive, immersiveDelayMs, cancelTick]);

  const resume = useCallback(() => {
    if (status !== "paused") return;

    const now = Date.now();
    endAtRef.current = now + remainingMs;

    if (pausedWasImmersiveRef.current) {
      setIsImmersive(true);
      setStatus("immersive");
      immersiveAtRef.current = null;
    } else {
      setIsImmersive(false);
      setStatus("running");
      immersiveAtRef.current = now + pausedImmersiveDelayRef.current;
    }

    cancelTick();
    rafRef.current = requestAnimationFrame(tick);
  }, [status, remainingMs, cancelTick, tick]);

  const reset = useCallback(() => {
    cancelTick();
    endAtRef.current = null;
    immersiveAtRef.current = null;
    pausedImmersiveDelayRef.current = immersiveDelayMs;
    pausedWasImmersiveRef.current = false;
    setIsImmersive(false);
    setRemainingMs(totalMs);
    setStatus("idle");
  }, [cancelTick, totalMs, immersiveDelayMs]);

  useEffect(() => {
    return () => cancelTick();
  }, [cancelTick]);

  return {
    status,
    totalMs,
    remainingMs,
    isImmersive,
    setDuration,
    start,
    pause,
    resume,
    reset,
  };
}
