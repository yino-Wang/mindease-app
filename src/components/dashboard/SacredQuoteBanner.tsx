import Link from "next/link";
import type { DailyQuote } from "@/lib/quotes/types";
import { CARD_RADIUS_LG } from "@/lib/dashboard/styles";

type SacredQuoteBannerProps = {
  quote: DailyQuote;
};

export function SacredQuoteBanner({ quote }: SacredQuoteBannerProps) {
  return (
    <section className="w-full py-20 sm:py-24" aria-label="Quote of the day">
      <div
        className={`w-full border border-stone-800/40 bg-stone-900/20 px-8 py-14 sm:px-16 ${CARD_RADIUS_LG}`}
      >
        <blockquote className="mx-auto max-w-5xl text-center">
          <p className="font-serif text-xl leading-relaxed font-normal tracking-wide text-stone-400/90 italic sm:text-2xl sm:tracking-wider lg:text-3xl">
            &ldquo;{quote.text}&rdquo;
          </p>
          <footer className="mt-8 space-y-2 font-serif text-sm tracking-[0.25em] text-stone-600 not-italic">
            <p>— {quote.author}</p>
            {quote.source === "zenquotes" && (
              <p className="text-[10px] tracking-[0.2em] text-stone-700 uppercase">
                Quote of the day via{" "}
                <Link
                  href="https://zenquotes.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-500 underline-offset-2 transition-colors hover:text-stone-400 hover:underline"
                >
                  ZenQuotes
                </Link>
              </p>
            )}
          </footer>
        </blockquote>
      </div>
    </section>
  );
}
