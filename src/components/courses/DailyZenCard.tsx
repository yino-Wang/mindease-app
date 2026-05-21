import Link from "next/link";
import { SafeAmbientVideo } from "@/components/media/SafeAmbientVideo";
import type { DailyZenToday } from "@/lib/daily-zen/resolve";

type DailyZenCardProps = {
  daily: DailyZenToday;
};

function formatDuration(seconds: number | null): string {
  if (!seconds) return "3 min";
  const mins = Math.round(seconds / 60);
  return `${mins} min`;
}

export function DailyZenCard({ daily }: DailyZenCardProps) {
  return (
    <section
      aria-label="Today's Daily Zen"
      className="sacred-glow relative overflow-hidden rounded-2xl border border-amber-500/25 bg-gradient-to-br from-stone-900/80 via-stone-900/50 to-amber-950/20"
    >
      {daily.bgVideoUrl && (
        <SafeAmbientVideo
          src={daily.bgVideoUrl}
          autoPlay
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20 saturate-50 motion-reduce:opacity-0"
        />
      )}
      <div className="relative flex flex-col gap-4 px-6 py-6">
        <p className="text-xs font-medium tracking-[0.2em] text-amber-500/80 uppercase">
          Daily Zen
        </p>
        <h2 className="font-serif text-2xl tracking-wide text-stone-200">
          {daily.theme}
        </h2>
        <p className="text-sm tracking-wide text-stone-400">
          A gentle {formatDuration(daily.duration)} practice to begin your day.
        </p>
        <Link
          href={`/daily?audioId=${daily.id}`}
          className="mt-1 inline-flex w-fit items-center rounded-full border border-amber-500/40 bg-amber-500/15 px-6 py-2.5 font-serif text-sm tracking-widest text-amber-300 transition-all duration-700 ease-in-out hover:border-amber-500/60 hover:bg-amber-500/25"
        >
          Begin today&apos;s practice
        </Link>
      </div>
    </section>
  );
}
