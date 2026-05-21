"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type AmbientTrack = {
  id: string;
  name: string;
  url: string;
};

type ActiveSource = {
  source: AudioBufferSourceNode;
  gain: GainNode;
};

const RAMP_SECONDS = 0.08;
const MASTER_GAIN = 0.85;

export function useAudioMixer() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const contextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const buffersRef = useRef<Map<string, AudioBuffer>>(new Map());
  const gainsRef = useRef<Map<string, GainNode>>(new Map());
  const volumesRef = useRef<Map<string, number>>(new Map());
  const sourcesRef = useRef<Map<string, ActiveSource>>(new Map());
  const tracksRef = useRef<AmbientTrack[]>([]);

  const ensureContext = useCallback(async () => {
    if (!contextRef.current) {
      contextRef.current = new AudioContext();
      masterGainRef.current = contextRef.current.createGain();
      masterGainRef.current.gain.value = MASTER_GAIN;
      masterGainRef.current.connect(contextRef.current.destination);
    }
    if (contextRef.current.state === "suspended") {
      await contextRef.current.resume();
    }
    return contextRef.current;
  }, []);

  const loadTracks = useCallback(async (tracks: AmbientTrack[]) => {
    setError(null);
    setIsReady(false);
    tracksRef.current = tracks;

    try {
      const ctx = await ensureContext();
      const master = masterGainRef.current!;

      buffersRef.current.clear();
      gainsRef.current.clear();
      volumesRef.current.clear();

      await Promise.all(
        tracks.map(async (track) => {
          const response = await fetch(track.url);
          if (!response.ok) {
            throw new Error(`Failed to load ${track.name}`);
          }
          const arrayBuffer = await response.arrayBuffer();
          const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
          buffersRef.current.set(track.id, audioBuffer);

          const gain = ctx.createGain();
          gain.gain.value = 0;
          gain.connect(master);
          gainsRef.current.set(track.id, gain);
          volumesRef.current.set(track.id, 0);
        })
      );

      setIsReady(true);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Failed to load soundscapes";
      setError(message);
      setIsReady(false);
    }
  }, [ensureContext]);

  const setTrackVolume = useCallback(
    (trackId: string, volume: number) => {
      const clamped = Math.max(0, Math.min(1, volume));
      volumesRef.current.set(trackId, clamped);

      const ctx = contextRef.current;
      const gain = gainsRef.current.get(trackId);
      if (!ctx || !gain) return;

      const now = ctx.currentTime;
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.linearRampToValueAtTime(clamped, now + RAMP_SECONDS);
    },
    []
  );

  const start = useCallback(async () => {
    const ctx = await ensureContext();
    const master = masterGainRef.current!;

    for (const [trackId, buffer] of buffersRef.current) {
      const existing = sourcesRef.current.get(trackId);
      if (existing) {
        try {
          existing.source.stop();
        } catch {
          // already stopped
        }
      }

      const gain =
        gainsRef.current.get(trackId) ?? ctx.createGain();
      if (!gainsRef.current.has(trackId)) {
        gain.connect(master);
        gainsRef.current.set(trackId, gain);
      }

      const volume = volumesRef.current.get(trackId) ?? 0;
      const now = ctx.currentTime;
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(volume, now);

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.connect(gain);
      source.start(0);
      sourcesRef.current.set(trackId, { source, gain });
    }

    setIsPlaying(true);
  }, [ensureContext]);

  const stop = useCallback(() => {
    for (const { source } of sourcesRef.current.values()) {
      try {
        source.stop();
      } catch {
        // already stopped
      }
    }
    sourcesRef.current.clear();
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    return () => {
      stop();
      void contextRef.current?.close();
      contextRef.current = null;
    };
  }, [stop]);

  return {
    isReady,
    error,
    isPlaying,
    loadTracks,
    setTrackVolume,
    start,
    stop,
    ensureContext,
  };
}
