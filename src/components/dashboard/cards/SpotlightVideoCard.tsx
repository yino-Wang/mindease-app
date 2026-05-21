import Link from "next/link";
import { SafeAmbientVideo } from "@/components/media/SafeAmbientVideo";
import {
  CARD_BORDER,
  CARD_CAROUSEL_WIDTH,
  CARD_HOVER_GLOW,
  CARD_MEDIA_ASPECT,
  CARD_RADIUS_SM,
  CARD_SURFACE,
  FOCUS_RING,
} from "@/lib/dashboard/styles";
import type { SpotlightItem } from "@/lib/dashboard/types";

type SpotlightVideoCardProps = {
  item: SpotlightItem;
};

export function SpotlightVideoCard({ item }: SpotlightVideoCardProps) {
  return (
    <Link
      href={item.href}
      className={`group snap-start ${CARD_CAROUSEL_WIDTH} ${FOCUS_RING}`}
      aria-label={`${item.title}, ${item.subtitle}`}
    >
      <article
        className={`flex flex-col overflow-hidden ${CARD_RADIUS_SM} ${CARD_SURFACE} ${CARD_BORDER} ${CARD_HOVER_GLOW} group-hover:sacred-glow-subtle`}
      >
        <div className={`relative overflow-hidden ${CARD_MEDIA_ASPECT}`}>
          {item.videoUrl ? (
            <SafeAmbientVideo
              src={item.videoUrl}
              autoPlay
              className="h-full w-full object-cover opacity-90 transition-opacity duration-700 group-hover:opacity-100 motion-reduce:transition-none"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-stone-800/60 via-stone-900/80 to-stone-950" />
          )}
        </div>
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
