"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getChimeAudioUrl } from "@/lib/timer/audio-urls";

const ATTACK_SECONDS = 0.005;
const RELEASE_SECONDS = 0.4;
const PEAK_GAIN = 0.55;

export function useChime() {
  const [isReady, setIsReady] = useState(false);
  const contextRef = useRef<AudioContext | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);

  const ensureContext = useCallback(async () => {
    if (!contextRef.current) {
      contextRef.current = new AudioContext();
    }
    if (contextRef.current.state === "suspended") {
      await contextRef.current.resume();
    }
    return contextRef.current;
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const ctx = await ensureContext();
        const response = await fetch(getChimeAudioUrl());
        if (!response.ok) return;
        const arrayBuffer = await response.arrayBuffer();
        if (cancelled) return;
        bufferRef.current = await ctx.decodeAudioData(arrayBuffer);
        if (!cancelled) setIsReady(true);
      } catch {
        // Chime is optional; fail silently
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [ensureContext]);

  const play = useCallback(async () => {
    const buffer = bufferRef.current;
    if (!buffer) return;

    const ctx = await ensureContext();
    const now = ctx.currentTime;

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(PEAK_GAIN, now + ATTACK_SECONDS);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      now + ATTACK_SECONDS + RELEASE_SECONDS
    );

    source.connect(gain);
    gain.connect(ctx.destination);
    source.start(0);
    source.stop(now + ATTACK_SECONDS + RELEASE_SECONDS + 0.05);
  }, [ensureContext]);

  useEffect(() => {
    return () => {
      void contextRef.current?.close();
      contextRef.current = null;
    };
  }, []);

  return { play, isReady, ensureContext };
}
