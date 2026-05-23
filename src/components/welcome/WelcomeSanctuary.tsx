"use client";

import Link from "next/link";
import { SafeAmbientVideo } from "@/components/media/SafeAmbientVideo";
import {
  getWelcomeVideoUrl,
  WELCOME_HEADLINE,
} from "@/lib/welcome/constants";
import { FOCUS_RING } from "@/lib/dashboard/styles";

export function WelcomeSanctuary() {
  const videoUrl = getWelcomeVideoUrl();

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0D0E0E]">
      <SafeAmbientVideo
        src={videoUrl}
        autoPlay
        className="pointer-events-none fixed inset-0 h-full w-full object-cover opacity-45"
      />
      <div
        className="pointer-events-none fixed inset-0 bg-gradient-to-r from-[#0D0E0E] via-[#0D0E0E]/88 to-[#0D0E0E]/65"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 bg-gradient-to-t from-[#0D0E0E] via-[#0D0E0E]/40 to-[#0D0E0E]/70"
        aria-hidden
      />

      <div className="relative z-10 flex min-h-screen flex-col px-6 py-10 sm:px-10 lg:px-14">
        <p className="font-serif text-sm tracking-[0.2em] text-amber-400/80 uppercase">
          MindEase
        </p>

        <div className="flex flex-1 flex-col justify-center gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          <h1 className="max-w-3xl font-serif text-4xl leading-tight font-medium tracking-wide text-stone-100 sm:text-5xl lg:max-w-4xl lg:text-6xl lg:leading-[1.08]">
            {WELCOME_HEADLINE}
          </h1>

          <div className="flex shrink-0 flex-col items-start gap-4 lg:items-end">
            <Link
              href="/login"
              className={`sacred-glow inline-flex items-center justify-center rounded-full border border-amber-500/35 bg-amber-500/10 px-10 py-4 font-serif text-lg tracking-widest text-amber-300 transition-all duration-700 ease-in-out hover:border-amber-500/55 hover:bg-amber-500/20 hover:text-amber-200 motion-reduce:transition-none ${FOCUS_RING}`}
            >
              Sign in to explore more
            </Link>
            <p className="max-w-xs text-sm leading-relaxed tracking-wide text-stone-500 lg:text-right">
              Create a free account to open Dashboard, modalities, and your
              practice calendar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
