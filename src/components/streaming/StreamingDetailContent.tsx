import Link from "next/link";
import { StreamingPlayButton } from "@/components/streaming/StreamingPlayButton";
import type { StreamingItemRecord } from "@/lib/streaming/types";
import { formatPlayCount } from "@/lib/streaming/queries";

type StreamingDetailContentProps = {
  item: StreamingItemRecord;
  durationMinutes: number;
};

export function StreamingDetailContent({
  item,
  durationMinutes,
}: StreamingDetailContentProps) {
  const sectionLabel =
    item.sectionType === "SPOTLIGHT" ? "Masterclass" : "Made For You";
  const playCountLabel = formatPlayCount(item.playCount);

  return (
    <div className="relative z-10 -mt-6 w-full px-5 pb-16 sm:px-10 lg:px-14">
      <div className="grid w-full gap-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-14">
        <div className="min-w-0 space-y-8">
          <p className="text-sm tracking-wide text-stone-500">
            {item.rating.toFixed(1)}★ · {sectionLabel} · {durationMinutes} min
          </p>

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="font-serif text-3xl leading-tight tracking-wide text-stone-100 sm:text-4xl lg:text-5xl">
                {item.title}
              </h1>
              {item.author ? (
                <p className="mt-3 text-sm text-stone-500">
                  By{" "}
                  <span className="text-stone-400 underline decoration-stone-600 underline-offset-4">
                    {item.author}
                  </span>
                </p>
              ) : null}
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-700/50 bg-stone-900/50 text-stone-500"
                aria-label="More options"
              >
                ⋯
              </button>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-700/50 bg-stone-900/50 text-stone-500"
                aria-label="Save"
              >
                ♡
              </button>
            </div>
          </div>

          <StreamingPlayButton href={`/dashboard/play/${item.id}`} />

          <button
            type="button"
            className="flex w-full max-w-md items-center justify-center gap-2 rounded-full border border-amber-500/25 bg-transparent py-3.5 text-sm tracking-widest text-amber-500/80 uppercase transition-all duration-700 ease-in-out hover:border-amber-500/40 hover:bg-amber-500/5"
          >
            Share
          </button>

          <div className="space-y-4 pt-2">
            <p className="font-serif text-lg tracking-wide text-stone-300">
              {playCountLabel} plays
            </p>
            <p className="max-w-2xl text-base leading-relaxed tracking-wide text-stone-400">
              {item.description}
            </p>
          </div>

          {item.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-amber-500/25 px-3 py-1 text-xs tracking-widest text-amber-500/80 uppercase"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <aside className="space-y-6 border-t border-stone-800/50 pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
          <h2 className="text-xs tracking-[0.25em] text-stone-600 uppercase">
            Session
          </h2>
          <dl className="space-y-5 text-sm">
            <div>
              <dt className="text-stone-600">Duration</dt>
              <dd className="mt-1 font-serif text-xl text-stone-200">
                {durationMinutes} min
              </dd>
            </div>
            <div>
              <dt className="text-stone-600">Rating</dt>
              <dd className="mt-1 font-serif text-xl text-stone-200">
                {item.rating.toFixed(1)}★
              </dd>
            </div>
            <div>
              <dt className="text-stone-600">Total plays</dt>
              <dd className="mt-1 font-serif text-xl text-stone-200">
                {playCountLabel}
              </dd>
            </div>
            <div>
              <dt className="text-stone-600">Format</dt>
              <dd className="mt-1 text-stone-300">{sectionLabel}</dd>
            </div>
          </dl>
          <Link
            href="/dashboard"
            className="inline-block text-xs tracking-widest text-stone-600 uppercase transition-colors duration-700 hover:text-amber-500/80"
          >
            ← Back to dashboard
          </Link>
        </aside>
      </div>
    </div>
  );
}
