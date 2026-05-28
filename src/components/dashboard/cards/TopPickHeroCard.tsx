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
  const label = item.kind === "article" ? "featured article" : "featured practice";

  const minutesLabel = item.durationMinutes
    ? `${item.durationMinutes} min ${item.kind === "article" ? "read" : "practice"}`
    : null;

  return (
    <Link
      href={item.href}
      className={`group block w-full ${isSplit ? "flex h-full min-h-0 flex-1 flex-col" : ""} ${FOCUS_RING}`}
      aria-label={`${item.title}, ${label}`}
    >
      <article
        className={`flex w-full flex-col overflow-hidden ${CARD_RADIUS_LG} ${CARD_SURFACE} ${CARD_BORDER} transition-opacity duration-700 ease-in-out motion-reduce:transition-none group-hover:opacity-95`}
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
          ) : item.imageUrl ? (
            // Use <img> to avoid Next remotePatterns constraints for arbitrary RSS hosts.
            <img
              src={item.imageUrl}
              alt=""
              className="h-full w-full object-cover opacity-90 transition-opacity duration-700 group-hover:opacity-100 motion-reduce:transition-none"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-stone-800/40 via-stone-900/90 to-stone-950" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          <div className="absolute right-0 bottom-0 left-0 px-6 py-6 sm:px-7 sm:py-7">
            <p className="text-[10px] tracking-[0.25em] text-stone-500 uppercase">
              {item.subtitle}
            </p>

            <h3 className="mt-2 font-serif text-xl tracking-wide text-stone-100 sm:text-3xl">
              {item.title}
            </h3>

            {item.kind === "article" && item.excerpt ? (
              <p className="mt-3 line-clamp-2 text-sm leading-relaxed tracking-wide text-stone-400 sm:text-base">
                {item.excerpt}
              </p>
            ) : null}

            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs tracking-wide text-stone-500 sm:text-sm">
              {minutesLabel ? <span>{minutesLabel}</span> : null}
              {item.kind === "article" && item.sourceName ? (
                <span className="text-stone-600">· {item.sourceName}</span>
              ) : null}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
