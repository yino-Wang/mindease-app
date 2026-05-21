import { prisma } from "@/lib/prisma";
import { DAILY_ZEN_THEME_NAMES } from "@/lib/daily-zen/constants";
import {
  resolvePlayableGuideUrl,
  resolvePlayableVideoUrl,
} from "@/lib/media/resolve-playable-url";

const ROLLOVER_HOUR = 5;

/** Effective calendar date after 5:00 AM local rollover. */
export function getEffectiveDate(now: Date = new Date()): Date {
  const effective = new Date(now);
  if (effective.getHours() < ROLLOVER_HOUR) {
    effective.setDate(effective.getDate() - 1);
  }
  return effective;
}

export function getWeekdayIndex(now: Date = new Date()): number {
  return getEffectiveDate(now).getDay();
}

export function getTodayThemeName(now: Date = new Date()): string {
  const index = getWeekdayIndex(now);
  return DAILY_ZEN_THEME_NAMES[index];
}

export type DailyZenToday = {
  id: string;
  theme: string;
  name: string;
  guideUrl: string;
  bgVideoUrl: string | null;
  duration: number | null;
  weekdayIndex: number;
};

export async function getTodayDailyZen(
  now: Date = new Date()
): Promise<DailyZenToday | null> {
  const weekdayIndex = getWeekdayIndex(now);
  const themeName = DAILY_ZEN_THEME_NAMES[weekdayIndex];

  const audio = await prisma.meditationAudio.findFirst({
    where: { name: themeName, category: "daily" },
  });

  if (!audio) return null;

  const themeLabel = themeName.replace(/^Daily Zen — /, "");

  const [guideUrl, bgVideoUrl] = await Promise.all([
    resolvePlayableGuideUrl(audio.url),
    resolvePlayableVideoUrl(audio.bgVideoUrl),
  ]);

  return {
    id: audio.id,
    theme: themeLabel,
    name: audio.name,
    guideUrl,
    bgVideoUrl,
    duration: audio.duration,
    weekdayIndex,
  };
}
