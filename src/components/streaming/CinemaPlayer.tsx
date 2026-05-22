"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import {
  isDirectMediaFile,
  isYouTubeUrl,
} from "@/lib/media/is-external-stream";
import type { StreamingSectionType } from "@/lib/streaming/types";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

type CinemaPlayerProps = {
  id: string;
  title: string;
  mediaUrl: string;
  coverUrl: string;
  sectionType?: StreamingSectionType;
};

function isAudioSource(url: string): boolean {
  return /\.(mp3|m4a|wav|ogg)(\?|$)/i.test(url);
}

export function CinemaPlayer({
  id,
  title,
  mediaUrl,
  coverUrl,
  sectionType = "SPOTLIGHT",
}: CinemaPlayerProps) {
  const recordedPlay = useRef(false);
  const useReactPlayer = isYouTubeUrl(mediaUrl) || isDirectMediaFile(mediaUrl);
  const useAudio = isAudioSource(mediaUrl);
  const shouldLoop = sectionType === "MADE_FOR_YOU";

  useEffect(() => {
    if (recordedPlay.current) return;
    recordedPlay.current = true;
    void fetch(`/api/streaming/${id}/play`, { method: "POST" });
  }, [id]);

  return (
    <div className="relative flex h-full w-full flex-col bg-black">
      {(useAudio || !useReactPlayer) && (
        <Image
          src={coverUrl}
          alt=""
          fill
          unoptimized={coverUrl.startsWith("/")}
          className="object-cover opacity-30"
          aria-hidden
        />
      )}

      <div className="absolute top-0 right-0 left-0 z-20 flex items-center justify-between p-5 sm:p-8">
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

      <div className="absolute inset-0 top-16 z-10 flex items-center justify-center p-4">
        {useReactPlayer && !useAudio ? (
          <div className="aspect-video h-full max-h-full w-full max-w-full [&_video]:object-contain">
            <ReactPlayer
              src={mediaUrl}
              playing
              controls
              playsInline
              loop={shouldLoop}
              width="100%"
              height="100%"
              config={{
                youtube: {
                  rel: 0,
                  iv_load_policy: 3,
                },
              }}
            />
          </div>
        ) : (
          <audio
            src={mediaUrl}
            controls
            playsInline
            autoPlay
            loop={shouldLoop}
            className="relative z-10 w-full max-w-lg"
            aria-label={`Playing ${title}`}
          />
        )}
      </div>
    </div>
  );
}
