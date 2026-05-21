"use client";

import { useCallback, useState } from "react";

type SafeAmbientVideoProps = {
  src: string;
  className?: string;
  /** Attempt muted loop playback only after the source loads successfully. */
  autoPlay?: boolean;
};

export function SafeAmbientVideo({
  src,
  className = "",
  autoPlay = false,
}: SafeAmbientVideoProps) {
  const [failed, setFailed] = useState(false);

  const handleError = useCallback(() => {
    setFailed(true);
  }, []);

  const tryPlay = useCallback(
    (video: HTMLVideoElement) => {
      if (!autoPlay || failed) return;
      void video.play().catch(() => {
        setFailed(true);
      });
    },
    [autoPlay, failed]
  );

  if (failed || !src) {
    return (
      <div
        className={`bg-gradient-to-br from-stone-800/50 to-stone-950 ${className}`}
        aria-hidden
      />
    );
  }

  return (
    <video
      src={src}
      loop
      muted
      playsInline
      preload="none"
      className={className}
      aria-hidden
      tabIndex={-1}
      onError={handleError}
      onCanPlay={(e) => tryPlay(e.currentTarget)}
    />
  );
}
