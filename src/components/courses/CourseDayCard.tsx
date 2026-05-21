import Link from "next/link";
import { SafeAmbientVideo } from "@/components/media/SafeAmbientVideo";
import type { DayCardState } from "@/lib/courses/types";

type CourseDayCardProps = {
  courseId: string;
  day: DayCardState;
};

function LockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5 text-stone-500"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3V12.75a3 3 0 00-3-3h-3.75V6.75A5.25 5.25 0 0012 1.5zm3.75 8.25v3h-7.5v-3a3.75 3.75 0 117.5 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5 text-amber-400"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function CourseDayCard({ courseId, day }: CourseDayCardProps) {
  const isLocked = day.status === "locked";
  const isCompleted = day.status === "completed";
  const href = `/courses/${courseId}/day/${day.daySequence}`;

  const cardInner = (
    <article
      className={`group relative flex gap-4 overflow-hidden rounded-2xl border px-4 py-4 transition-all duration-700 ease-in-out ${
        isLocked
          ? "pointer-events-none select-none border-stone-800/40 bg-stone-900/20 blur-[2px] opacity-40 saturate-50"
          : isCompleted
            ? "sacred-glow border-amber-500/30 bg-amber-500/5 hover:border-amber-500/40"
            : "border-stone-800/60 bg-stone-900/30 hover:border-stone-700/80 hover:bg-stone-900/50"
      }`}
      aria-disabled={isLocked}
    >
      <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border border-stone-800/60 bg-stone-950/50">
        {day.bgVideoUrl && !isLocked ? (
          <SafeAmbientVideo
            src={day.bgVideoUrl}
            autoPlay
            className="h-full w-full object-cover"
          />
        ) : day.bgVideoUrl && isLocked ? (
          <div className="h-full w-full bg-gradient-to-br from-stone-800/50 to-stone-950" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-stone-800/50 to-stone-950" />
        )}
        {isLocked && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/50"
            aria-hidden
          >
            <LockIcon />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
        <span className="text-xs tracking-widest text-stone-500 uppercase">
          Day {day.daySequence}
        </span>
        <h3 className="font-serif text-lg tracking-wide text-stone-200">
          {day.title.replace(/^Day \d+: /, "")}
        </h3>
        {day.duration && (
          <p className="text-xs text-stone-500">
            {Math.round(day.duration / 60)} min session
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center">
        {isCompleted && <CheckIcon />}
        {isLocked && <LockIcon />}
        {!isLocked && !isCompleted && (
          <span className="text-xs tracking-widest text-amber-500/70 uppercase">
            Start
          </span>
        )}
      </div>
    </article>
  );

  if (isLocked) {
    return (
      <div role="group" aria-label={`${day.title} — locked`}>
        {cardInner}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="block rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500/50"
      aria-label={`${day.title}${isCompleted ? " — completed" : ""}`}
    >
      {cardInner}
    </Link>
  );
}
