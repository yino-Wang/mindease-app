import Link from "next/link";
import { StreamingDetailVisualColumn } from "@/components/streaming/StreamingDetailVisualColumn";
import { StreamingPlayButton } from "@/components/streaming/StreamingPlayButton";
import { formatPlayCount } from "@/lib/streaming/queries";
import type { StreamingItemRecord } from "@/lib/streaming/types";

type StreamingDetailContentProps = {
  item: StreamingItemRecord;
  durationMinutes: number;
};

export function StreamingDetailContent({
  item,
  durationMinutes,
}: StreamingDetailContentProps) {
  const sectionLabel =
    item.sectionType === "LIBRARY"
      ? (item.libraryCategory ?? "Library")
      : item.sectionType === "SPOTLIGHT"
        ? "Masterclass"
        : "Made For You";
  const playCountLabel = formatPlayCount(item.playCount);

  return (
    <div className="flex min-h-screen w-full max-w-none flex-col bg-[#0D0E0E]">
      <header className="flex w-full shrink-0 items-center px-6 py-5 sm:px-10 lg:px-14">
        <Link
          href="/dashboard"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-700/60 bg-stone-900/40 text-stone-300 backdrop-blur-md transition-all duration-700 ease-in-out hover:border-amber-500/30 hover:text-amber-300/90"
          aria-label="Back to dashboard"
        >
          ←
        </Link>
      </header>

      <div className="w-full flex-1 px-6 pb-12 sm:px-10 lg:px-14">
        <div className="grid w-full grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-x-10 lg:gap-y-8 xl:gap-x-14">
          <StreamingDetailVisualColumn
            item={item}
            durationMinutes={durationMinutes}
          />

          <div className="flex min-w-0 w-full flex-col justify-center space-y-8 lg:pl-4 lg:py-4 xl:pl-8">
            <p className="text-base tracking-wide text-stone-500 lg:text-lg">
              {item.rating.toFixed(1)}★ · {sectionLabel} · {durationMinutes}{" "}
              min
            </p>

            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h1 className="font-serif text-4xl leading-tight tracking-wide text-stone-100 sm:text-5xl lg:text-[3.25rem]">
                  {item.title}
                </h1>
                {item.author ? (
                  <p className="mt-4 text-base text-stone-500 lg:text-lg">
                    By{" "}
                    <span className="text-stone-400 underline decoration-stone-600 underline-offset-4">
                      {item.author}
                    </span>
                  </p>
                ) : null}
              </div>
              <div className="flex shrink-0 gap-3">
                <button
                  type="button"
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-stone-700/50 bg-stone-900/50 text-lg text-stone-500 transition-all duration-700 ease-in-out hover:border-amber-500/25"
                  aria-label="More options"
                >
                  ⋯
                </button>
                <button
                  type="button"
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-stone-700/50 bg-stone-900/50 text-lg text-stone-500 transition-all duration-700 ease-in-out hover:border-amber-500/25"
                  aria-label="Save"
                >
                  ♡
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
              <StreamingPlayButton
                href={`/dashboard/play/${item.id}`}
                className="sm:flex-1"
              />
              <button
                type="button"
                className="flex flex-1 items-center justify-center rounded-full border border-amber-500/25 bg-transparent px-8 py-4 text-base tracking-widest text-amber-500/80 uppercase transition-all duration-700 ease-in-out hover:border-amber-500/40 hover:bg-amber-500/5 motion-reduce:transition-none sm:max-w-[220px] lg:text-lg"
              >
                Share
              </button>
            </div>

            <div className="space-y-5">
              <p className="font-serif text-xl tracking-wide text-stone-300 lg:text-2xl">
                {playCountLabel} plays
              </p>
              <p className="w-full text-lg leading-relaxed tracking-wide text-stone-400 lg:text-xl">
                {item.description}
              </p>
            </div>

            {item.tags.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-amber-500/25 px-4 py-1.5 text-sm tracking-widest text-amber-500/80 uppercase"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
