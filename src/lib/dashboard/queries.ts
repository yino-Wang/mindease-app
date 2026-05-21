import {
  getCourseCatalog,
  getFoundationCourse,
} from "@/lib/courses/queries";
import { getTodayDailyZen } from "@/lib/daily-zen/resolve";
import { resolvePlayableVideoUrl } from "@/lib/media/resolve-playable-url";
import { getZenCalendarData } from "@/lib/zen-calendar/aggregate";
import type {
  DashboardContent,
  MadeForYouItem,
  SpotlightItem,
  TopPickItem,
} from "@/lib/dashboard/types";

function formatDurationMinutes(seconds: number | null): number | null {
  if (!seconds) return null;
  return Math.max(1, Math.round(seconds / 60));
}

function stripDayPrefix(title: string): string {
  return title.replace(/^Day \d+: /, "");
}

export async function getDashboardContent(
  userId: string
): Promise<DashboardContent> {
  const [course, catalog, daily, zenCalendar] = await Promise.all([
    getFoundationCourse(),
    getCourseCatalog(userId),
    getTodayDailyZen(),
    getZenCalendarData(userId),
  ]);

  const courseId = course?.id ?? null;

  const spotlight: SpotlightItem[] = course
    ? await Promise.all(
        course.steps.map(async (step) => {
          const videoUrl = await resolvePlayableVideoUrl(
            step.audio.bgVideoUrl
          );
          return {
            id: step.id,
            title: stripDayPrefix(step.title),
            subtitle: `Day ${step.daySequence}`,
            videoUrl,
            href: `/courses/${course.id}/day/${step.daySequence}`,
          };
        })
      )
    : [];

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

  const madeForYou: MadeForYouItem[] = [];

  if (catalog) {
    for (const day of catalog.days) {
      const videoUrl = await resolvePlayableVideoUrl(day.bgVideoUrl);
      madeForYou.push({
        id: day.stepId,
        title: stripDayPrefix(day.title),
        subtitle:
          day.status === "completed"
            ? "Completed"
            : day.status === "locked"
              ? "Locked"
              : "Continue your journey",
        videoUrl,
        href: `/courses/${catalog.course.id}/day/${day.daySequence}`,
      });
    }
  }

  if (daily && madeForYou.length < 6) {
    const videoUrl = await resolvePlayableVideoUrl(daily.bgVideoUrl);
    madeForYou.unshift({
      id: `daily-${daily.id}`,
      title: daily.theme,
      subtitle: "Daily Zen",
      videoUrl,
      href: `/daily?audioId=${daily.id}`,
    });
  }

  return {
    spotlight,
    topPick,
    madeForYou: madeForYou.slice(0, 6),
    zenCalendar,
    courseId,
  };
}
