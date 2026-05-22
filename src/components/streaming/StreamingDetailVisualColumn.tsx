import Image from "next/image";
import Link from "next/link";
import { formatPlayCount } from "@/lib/streaming/queries";
import type { StreamingItemRecord } from "@/lib/streaming/types";

type StreamingDetailVisualColumnProps = {
  item: StreamingItemRecord;
  durationMinutes: number;
};

export function StreamingDetailVisualColumn({
  item,
  durationMinutes,
}: StreamingDetailVisualColumnProps) {
  const sectionLabel =
    item.sectionType === "SPOTLIGHT" ? "Masterclass" : "Made For You";
  const playCountLabel = formatPlayCount(item.playCount);

  return (
    <div className="flex w-full flex-col">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-stone-800/40 ring-1 ring-stone-800/30 lg:aspect-video">
        <Image
          src={item.coverUrl}
          alt=""
          fill
          priority
          unoptimized={item.coverUrl.startsWith("/")}
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>

      <div className="mt-6 w-full">
        <h2 className="text-sm tracking-[0.25em] text-stone-600 uppercase">
          Session
        </h2>
        <dl className="mt-4 grid w-full grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4 lg:gap-x-6">
          <div className="min-w-0">
            <dt className="text-sm text-stone-600 lg:text-base">Duration</dt>
            <dd className="mt-1 font-serif text-xl text-stone-300 lg:text-2xl">
              {durationMinutes} min
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="text-sm text-stone-600 lg:text-base">Rating</dt>
            <dd className="mt-1 font-serif text-xl text-stone-300 lg:text-2xl">
              {item.rating.toFixed(1)}★
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="text-sm text-stone-600 lg:text-base">Total plays</dt>
            <dd className="mt-1 font-serif text-xl text-stone-300 lg:text-2xl">
              {playCountLabel}
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="text-sm text-stone-600 lg:text-base">Format</dt>
            <dd className="mt-1 text-base text-stone-400 lg:text-lg">
              {sectionLabel}
            </dd>
          </div>
        </dl>
        <Link
          href="/dashboard"
          className="mt-6 inline-block text-sm tracking-widest text-stone-600 uppercase transition-colors duration-700 ease-in-out hover:text-amber-500/80"
        >
          ← Back to dashboard
        </Link>
      </div>
    </div>
  );
}
