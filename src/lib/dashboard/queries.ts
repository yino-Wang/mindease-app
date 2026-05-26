import { getFoundationCourse } from "@/lib/courses/queries";
import { getTodayDailyZen } from "@/lib/daily-zen/resolve";
import { resolvePlayableVideoUrl } from "@/lib/media/resolve-playable-url";
import { fetchDailyQuote } from "@/lib/quotes/fetch-daily-quote";
import { getStreamingItemsBySection } from "@/lib/streaming/queries";
import { getZenCalendarData } from "@/lib/zen-calendar/aggregate";
import type {
  DashboardContent,
  TopPickItem,
} from "@/lib/dashboard/types";

function formatDurationMinutes(seconds: number | null): number | null {
  if (!seconds) return null;
  return Math.max(1, Math.round(seconds / 60));
}

export async function getDashboardContent(
  userId: string
): Promise<DashboardContent> {
  const [course, daily, zenCalendar, spotlight, madeForYou, dailyQuote] =
    await Promise.all([
      getFoundationCourse(),
      getTodayDailyZen(),
      getZenCalendarData(userId),
      getStreamingItemsBySection("SPOTLIGHT"),
      getStreamingItemsBySection("MADE_FOR_YOU"),
      fetchDailyQuote(),
    ]);

  const courseId = course?.id ?? null;

  let topPick: TopPickItem | null = null;
  if (daily) {
    const videoUrl = await resolvePlayableVideoUrl(daily.bgVideoUrl);
    topPick = {
      id: daily.id,
      title: daily.theme,
      subtitle: "Your Top Pick Today",
      videoUrl,
      href: `/daily?audioId=${daily.id}`,
      durationMinutes: formatDurationMinutes(daily.duration),
    };
  }

  return {
    spotlight,
    topPick,
    madeForYou,
    zenCalendar,
    courseId,
    dailyQuote,
  };
}
