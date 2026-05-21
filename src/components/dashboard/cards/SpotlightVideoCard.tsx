import Link from "next/link";
import { DashboardCardCover } from "@/components/dashboard/cards/DashboardCardCover";
import {
  CARD_BORDER,
  CARD_CAROUSEL_WIDTH,
  CARD_HOVER_GLOW,
  CARD_RADIUS_SM,
  CARD_SURFACE,
  FOCUS_RING,
} from "@/lib/dashboard/styles";
import type { SpotlightItem } from "@/lib/dashboard/types";

type SpotlightVideoCardProps = {
  item: SpotlightItem;
  coverIndex: number;
};

export function SpotlightVideoCard({
  item,
  coverIndex,
}: SpotlightVideoCardProps) {
  return (
    <Link
      href={item.href}
      className={`group snap-start ${CARD_CAROUSEL_WIDTH} ${FOCUS_RING}`}
      aria-label={`${item.title}, ${item.subtitle}`}
    >
      <article
        className={`flex flex-col overflow-hidden ${CARD_RADIUS_SM} ${CARD_SURFACE} ${CARD_BORDER} ${CARD_HOVER_GLOW} group-hover:sacred-glow-subtle`}
      >
        <DashboardCardCover
          coverIndex={coverIndex}
          alt={`${item.title}, ${item.subtitle}`}
          videoUrl={item.videoUrl}
          priority={coverIndex === 0}
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
    </Link>
  );
}
