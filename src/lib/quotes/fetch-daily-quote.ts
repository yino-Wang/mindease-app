import { getFallbackQuoteForToday } from "@/lib/quotes/fallback";
import type { DailyQuote } from "@/lib/quotes/types";

const ZENQUOTES_TODAY = "https://zenquotes.io/api/today";

type ZenQuotesRow = {
  q?: string;
  a?: string;
};

/** One shared quote per day; refreshed from ZenQuotes at most once per hour. */
export async function fetchDailyQuote(): Promise<DailyQuote> {
  try {
    const res = await fetch(ZENQUOTES_TODAY, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      return getFallbackQuoteForToday();
    }

    const data = (await res.json()) as ZenQuotesRow[];
    const row = data[0];
    const text = row?.q?.trim();
    const author = row?.a?.trim();

    if (!text || !author) {
      return getFallbackQuoteForToday();
    }

    return { text, author, source: "zenquotes" };
  } catch {
    return getFallbackQuoteForToday();
  }
}
