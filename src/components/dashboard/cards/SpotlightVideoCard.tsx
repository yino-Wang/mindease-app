import Link from "next/link";
import { SafeAmbientVideo } from "@/components/media/SafeAmbientVideo";
import {
  CARD_BORDER,
  CARD_HOVER_GLOW,
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
      className={`group block shrink-0 snap-start ${FOCUS_RING}`}
      aria-label={`${item.title}, ${item.subtitle}`}
    >
      <article
        className={`relative aspect-square w-44 overflow-hidden sm:w-52 ${CARD_RADIUS_SM} ${CARD_SURFACE} ${CARD_BORDER} ${CARD_HOVER_GLOW} group-hover:sacred-glow-subtle`}
      >
        {item.videoUrl ? (
          <SafeAmbientVideo
            src={item.videoUrl}
            autoPlay
            className="h-full w-full object-cover opacity-90 transition-opacity duration-700 group-hover:opacity-100 motion-reduce:transition-none"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-stone-800/60 via-stone-900/80 to-stone-950" />
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-4 py-4">
          <p className="text-[10px] tracking-widest text-stone-500 uppercase">
            {item.subtitle}
          </p>
          <p className="font-serif text-base tracking-wide text-stone-200">
            {item.title}
          </p>
        </div>
      </article>
    </Link>
  );
}
