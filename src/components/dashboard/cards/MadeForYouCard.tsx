"use client";

import Link from "next/link";
import { DashboardCardCover } from "@/components/dashboard/cards/DashboardCardCover";
import {
  CARD_BORDER_ALT,
  CARD_CAROUSEL_WIDTH,
  CARD_HOVER_GLOW,
  CARD_RADIUS_LG,
  CARD_SURFACE,
  FOCUS_RING,
} from "@/lib/dashboard/styles";
import type { MadeForYouItem } from "@/lib/dashboard/types";

type MadeForYouCardProps = {
  item: MadeForYouItem;
  coverIndex: number;
};

function CardBody({
  item,
  isLocked,
  coverIndex,
}: {
  item: MadeForYouItem;
  isLocked: boolean;
  coverIndex: number;
}) {
  return (
    <article
      className={`flex flex-col overflow-hidden ${CARD_RADIUS_LG} ${CARD_SURFACE} ${
        isLocked
          ? "pointer-events-none border-stone-800/40 opacity-50 saturate-50"
          : `${CARD_BORDER_ALT} ${CARD_HOVER_GLOW} hover:sacred-glow-subtle`
      }`}
    >
      <DashboardCardCover
        coverUrl={item.coverUrl}
        coverIndex={coverIndex}
        alt={item.title}
        videoUrl={item.videoUrl}
        showVideo={!isLocked}
      />
      <div className="border-t border-stone-800/40 px-4 py-3.5">
        <p className="text-[10px] tracking-widest text-stone-500 uppercase">
          {item.subtitle}
        </p>
        <p className="mt-1 font-serif text-base tracking-wide text-stone-200">
          {item.title}
        </p>
      </div>
    </article>
  );
}

export function MadeForYouCard({ item, coverIndex }: MadeForYouCardProps) {
  const isLocked = item.subtitle === "Locked";

  if (isLocked) {
    return (
      <div
        className={`snap-start ${CARD_CAROUSEL_WIDTH}`}
        aria-label={`${item.title}, locked`}
      >
        <CardBody item={item} isLocked={true} coverIndex={coverIndex} />
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className={`group snap-start ${CARD_CAROUSEL_WIDTH} ${FOCUS_RING}`}
      aria-label={item.title}
    >
      <CardBody item={item} isLocked={false} coverIndex={coverIndex} />
    </Link>
  );
}
