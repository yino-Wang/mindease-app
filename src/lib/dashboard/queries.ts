import { getFoundationCourse } from "@/lib/courses/queries";
import { getDailyPickArticleWithContent } from "@/lib/daily-pick/resolve";
import { fetchDailyQuote } from "@/lib/quotes/fetch-daily-quote";
import { getStreamingItemsBySection } from "@/lib/streaming/queries";
import { getZenCalendarData } from "@/lib/zen-calendar/aggregate";
import type { DashboardContent, TopPickItem } from "@/lib/dashboard/types";

function estimateReadingMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export async function getDashboardContent(
  userId: string
): Promise<DashboardContent> {
  const [course, zenCalendar, spotlight, madeForYou, dailyQuote, dailyPick] =
    await Promise.all([
      getFoundationCourse(),
      getZenCalendarData(userId),
      getStreamingItemsBySection("SPOTLIGHT"),
      getStreamingItemsBySection("MADE_FOR_YOU"),
      fetchDailyQuote(),
      getDailyPickArticleWithContent(),
    ]);

  const courseId = course?.id ?? null;

  const topPick: TopPickItem = {
    id: dailyPick.id,
    kind: "article",
    title: dailyPick.title,
    subtitle: "Your Top Pick Today",
    href: "/daily-pick",
    imageUrl: dailyPick.heroImageUrl ?? dailyPick.imageUrl,
    excerpt: dailyPick.excerpt,
    sourceName: dailyPick.sourceName,
    referenceUrl: dailyPick.referenceUrl,
    durationMinutes: estimateReadingMinutes(dailyPick.excerpt),
  };

  return {
    spotlight,
    topPick,
    madeForYou,
    zenCalendar,
    courseId,
    dailyQuote,
  };
}
