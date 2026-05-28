import { DAILY_PICK_SOURCES } from "@/lib/daily-pick/sources";
import { fetchRssArticles } from "@/lib/daily-pick/fetch";
import { getFallbackDailyPick } from "@/lib/daily-pick/fallback";
import type { DailyPickArticle } from "@/lib/daily-pick/types";
import { extractArticleFromUrl } from "@/lib/daily-pick/extract";
import { getEffectiveDate } from "@/lib/daily-zen/resolve";

function dayOfYear(now: Date): number {
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

function pickForDay(items: DailyPickArticle[], now: Date): DailyPickArticle {
  const idx = dayOfYear(now) % items.length;
  return items[idx];
}

/**
 * Returns a deterministic daily article from RSS sources.
 *
 * Fetches server-side (CORS safe) and is cached hourly via fetch revalidate.
 */
export async function getDailyPickArticle(
  now: Date = new Date()
): Promise<DailyPickArticle> {
  const effective = getEffectiveDate(now);

  const results = await Promise.allSettled(
    DAILY_PICK_SOURCES.map(async (source) => {
      const list = await fetchRssArticles(source);
      return list.map((item) => ({ ...item, sourceName: source.name, sourceUrl: source.homepage ?? source.url }));
    })
  );

  const items = results
    .filter((r): r is PromiseFulfilledResult<DailyPickArticle[]> => r.status === "fulfilled")
    .flatMap((r) => r.value)
    .filter((item) => item.title && item.excerpt && item.referenceUrl);

  if (items.length === 0) {
    return getFallbackDailyPick(effective);
  }

  return pickForDay(items, effective);
}

export async function getDailyPickArticleWithContent(
  now: Date = new Date()
): Promise<DailyPickArticle> {
  const article = await getDailyPickArticle(now);

  try {
    const extracted = await extractArticleFromUrl(article.referenceUrl);
    return {
      ...article,
      contentText: extracted.contentText,
      heroImageUrl: extracted.heroImageUrl ?? article.imageUrl ?? null,
    };
  } catch {
    return article;
  }
}
