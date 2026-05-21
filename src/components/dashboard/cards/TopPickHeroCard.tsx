import Link from "next/link";
import { SafeAmbientVideo } from "@/components/media/SafeAmbientVideo";
import {
  CARD_BORDER,
  CARD_MEDIA_ASPECT,
  CARD_RADIUS_LG,
  CARD_SURFACE,
  FOCUS_RING,
} from "@/lib/dashboard/styles";
import type { TopPickItem } from "@/lib/dashboard/types";

type TopPickHeroCardProps = {
  item: TopPickItem;
  layout?: "default" | "split";
};

export function TopPickHeroCard({
  item,
  layout = "default",
}: TopPickHeroCardProps) {
  const isSplit = layout === "split";

  return (
    <Link
      href={item.href}
      className={`group block w-full ${isSplit ? "flex h-full min-h-0 flex-1 flex-col" : ""} ${FOCUS_RING}`}
      aria-label={`${item.title}, featured practice`}
    >
      <article
        className={`flex w-full flex-col overflow-hidden ${CARD_RADIUS_LG} ${CARD_SURFACE} ${CARD_BORDER} transition-opacity duration-700 ease-in-out motion-reduce:transition-none group-hover:opacity-95 ${isSplit ? "h-full min-h-0 flex-1" : ""}`}
      >
        <div
          className={`relative overflow-hidden ${isSplit ? "min-h-[200px] flex-1" : CARD_MEDIA_ASPECT}`}
        >
          {item.videoUrl ? (
            <SafeAmbientVideo
              src={item.videoUrl}
              autoPlay
              className="h-full w-full object-cover opacity-85 transition-opacity duration-700 group-hover:opacity-100 motion-reduce:transition-none"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-stone-800/40 via-stone-900/90 to-stone-950" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute right-0 bottom-0 left-0 px-8 py-8 sm:px-10 sm:py-10">
            <p className="text-xs tracking-[0.25em] text-stone-500 uppercase">
              {item.subtitle}
            </p>
            <h3 className="mt-3 font-serif text-2xl tracking-wide text-stone-100 sm:text-4xl">
              {item.title}
            </h3>
            {item.durationMinutes && (
              <p className="mt-3 text-sm tracking-wide text-stone-500">
                {item.durationMinutes} min practice
              </p>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
