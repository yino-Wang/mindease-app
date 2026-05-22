import Link from "next/link";
import Image from "next/image";
import { CARD_RADIUS_SM } from "@/lib/dashboard/styles";
import type { LibraryCardItem } from "@/lib/meditate/types";

type CategoryVideoListCardProps = {
  item: LibraryCardItem;
};

export function CategoryVideoListCard({ item }: CategoryVideoListCardProps) {
  const imageSrc = item.coverUrl;
  const isLocal = imageSrc.startsWith("/");

  return (
    <article className="group w-full">
      <Link
        href={item.href}
        className="flex w-full flex-col gap-4 sm:flex-row sm:gap-6"
      >
        <div
          className={`relative aspect-video w-full max-w-[360px] shrink-0 overflow-hidden ${CARD_RADIUS_SM} transition-shadow duration-700 ease-in-out group-hover:sacred-glow motion-reduce:transition-none`}
        >
          <Image
            src={imageSrc}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, 360px"
            unoptimized={isLocal}
            className="object-cover opacity-90 transition-opacity duration-700 group-hover:opacity-100 motion-reduce:transition-none"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent"
            aria-hidden
          />
          <span className="absolute right-2 bottom-2 rounded-md bg-black/80 px-1.5 py-0.5 font-mono text-xs text-stone-100">
            {item.durationLabel}
          </span>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2 py-0.5 sm:py-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="line-clamp-2 text-base font-semibold leading-snug text-stone-100 sm:text-lg">
              {item.title}
            </h3>
            <span
              className="shrink-0 text-stone-600 opacity-0 transition-opacity group-hover:opacity-100 sm:opacity-60"
              aria-hidden
            >
              ⋯
            </span>
          </div>

          <p className="text-sm text-stone-500">
            {item.durationLabel} · {item.category}
            {item.author ? ` · ${item.author}` : ""}
          </p>

          {item.author ? (
            <p className="text-sm text-stone-500">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-stone-800 text-[10px] font-semibold text-amber-400/90">
                {item.author.slice(0, 1)}
              </span>{" "}
              <span className="text-stone-400">{item.author}</span>
            </p>
          ) : null}

          <p className="line-clamp-2 text-sm leading-relaxed text-stone-500">
            {item.introduction}
          </p>

          <div className="mt-1 flex flex-wrap gap-2">
            <span className="rounded-sm bg-stone-800/80 px-2 py-0.5 text-xs text-stone-400">
              {item.category}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
