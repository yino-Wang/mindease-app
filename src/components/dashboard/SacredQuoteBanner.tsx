import {
  SPLASH_ATTRIBUTION,
  SPLASH_QUOTE,
} from "@/lib/splash/content";
import { CARD_RADIUS_LG } from "@/lib/dashboard/styles";

export function SacredQuoteBanner() {
  return (
    <section className="w-full py-20 sm:py-24" aria-label="Sacred quote">
      <div
        className={`mx-auto max-w-4xl border border-stone-800/40 bg-stone-900/20 px-8 py-12 sm:px-12 ${CARD_RADIUS_LG}`}
      >
        <blockquote className="text-center">
          <p className="font-serif text-xl leading-relaxed font-normal tracking-wide text-stone-400/90 italic sm:text-2xl sm:tracking-wider">
            &ldquo;{SPLASH_QUOTE}&rdquo;
          </p>
          <footer className="mt-8 font-serif text-sm tracking-[0.25em] text-stone-600 not-italic">
            — {SPLASH_ATTRIBUTION}
          </footer>
        </blockquote>
      </div>
    </section>
  );
}
