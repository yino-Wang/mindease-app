"use client";

import Link from "next/link";
import { SafeAmbientVideo } from "@/components/media/SafeAmbientVideo";
import {
  CARD_BORDER_ALT,
  CARD_HOVER_GLOW,
  CARD_RADIUS_LG,
  CARD_SURFACE,
  FOCUS_RING,
} from "@/lib/dashboard/styles";
import type { MadeForYouItem } from "@/lib/dashboard/types";

type MadeForYouCardProps = {
  item: MadeForYouItem;
};

export function MadeForYouCard({ item }: MadeForYouCardProps) {
  const isLocked = item.subtitle === "Locked";

  const content = (
    <article
      className={`relative aspect-[16/10] w-72 overflow-hidden sm:w-80 ${CARD_RADIUS_LG} ${CARD_SURFACE} ${
        isLocked
          ? "pointer-events-none border-stone-800/40 opacity-50 saturate-50 ring-0"
          : `${CARD_BORDER_ALT} ${CARD_HOVER_GLOW} hover:sacred-glow-subtle`
      }`}
    >
      {item.videoUrl && !isLocked ? (
        <SafeAmbientVideo
          src={item.videoUrl}
          autoPlay
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="h-full w-full bg-gradient-to-br from-stone-800/50 via-stone-900/80 to-stone-950" />
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent px-5 py-5">
        <p className="text-[10px] tracking-widest text-stone-500 uppercase">
          {item.subtitle}
        </p>
        <p className="font-serif text-lg tracking-wide text-stone-200">
          {item.title}
        </p>
      </div>
    </article>
  );

  if (isLocked) {
    return (
      <div className="shrink-0 snap-start" aria-label={`${item.title}, locked`}>
        {content}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className={`shrink-0 snap-start ${FOCUS_RING}`}
      aria-label={item.title}
    >
      {content}
    </Link>
  );
}
