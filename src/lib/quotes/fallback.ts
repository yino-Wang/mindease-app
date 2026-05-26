import type { DailyQuote } from "@/lib/quotes/types";

/** Local pool when ZenQuotes is unavailable (meditation / stillness themed). */
export const FALLBACK_QUOTES: readonly Omit<DailyQuote, "source">[] = [
  {
    text: "Meditation is not escape; it is intimacy with reality.",
    author: "Jiddu Krishnamurti",
  },
  {
    text: "The present moment is the only time over which we have dominion.",
    author: "Thích Nhất Hạnh",
  },
  {
    text: "Quiet the mind, and the soul will speak.",
    author: "Ma Jaya Sati Bhagavati",
  },
  {
    text: "Within you there is a stillness and a sanctuary to which you can retreat at any time.",
    author: "Hermann Hesse",
  },
  {
    text: "Feelings come and go like clouds in a windy sky. Conscious breathing is my anchor.",
    author: "Thích Nhất Hạnh",
  },
  {
    text: "The thing about meditation is: you become more and more you.",
    author: "David Lynch",
  },
  {
    text: "In the midst of movement and chaos, keep stillness inside of you.",
    author: "Deepak Chopra",
  },
];

export function getFallbackQuoteForToday(): DailyQuote {
  const start = new Date(new Date().getFullYear(), 0, 0);
  const dayOfYear = Math.floor(
    (Date.now() - start.getTime()) / (1000 * 60 * 60 * 24)
  );
  const pick = FALLBACK_QUOTES[dayOfYear % FALLBACK_QUOTES.length];
  return { ...pick, source: "fallback" };
}
