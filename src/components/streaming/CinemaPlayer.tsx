"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

type CinemaPlayerProps = {
  id: string;
  title: string;
  mediaUrl: string;
  coverUrl: string;
};

function isVideoSource(url: string): boolean {
  return /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url);
}

export function CinemaPlayer({
  id,
  title,
  mediaUrl,
  coverUrl,
}: CinemaPlayerProps) {
  const recordedPlay = useRef(false);

  useEffect(() => {
    if (recordedPlay.current) return;
    recordedPlay.current = true;
    void fetch(`/api/streaming/${id}/play`, { method: "POST" });
  }, [id]);

  const useVideo = isVideoSource(mediaUrl);

  return (
    <div className="relative flex h-full w-full flex-col bg-black">
      {!useVideo && (
        <Image
          src={coverUrl}
          alt=""
          fill
          unoptimized={coverUrl.startsWith("/")}
          className="object-cover opacity-30"
          aria-hidden
        />
      )}

      <div className="absolute top-0 right-0 left-0 z-10 flex items-center justify-between p-5 sm:p-8">
        <Link
          href={`/dashboard/meditate/${id}`}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-700/60 bg-black/50 text-stone-300 backdrop-blur-md transition-all duration-700 hover:border-amber-500/30"
          aria-label="Back to session detail"
        >
          ←
        </Link>
        <p className="max-w-[50%] truncate text-sm tracking-wide text-stone-500">
          {title}
        </p>
      </div>

      <div className="relative z-10 flex flex-1 items-center justify-center p-4 pt-20">
        {useVideo ? (
          <video
            src={mediaUrl}
            controls
            playsInline
            autoPlay
            className="max-h-full max-w-full object-contain"
            aria-label={`Playing ${title}`}
          />
        ) : (
          <audio
            src={mediaUrl}
            controls
            playsInline
            autoPlay
            className="w-full max-w-lg"
            aria-label={`Playing ${title}`}
          />
        )}
      </div>
    </div>
  );
}
