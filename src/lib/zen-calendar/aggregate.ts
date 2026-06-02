import { prisma } from "@/lib/prisma";
import { GLOW_THRESHOLDS } from "@/lib/zen-calendar/constants";
import { getCalendarNotesForMonth } from "@/lib/zen-calendar/notes";
import type { GlowLevel, ZenCalendarCell, ZenCalendarData } from "@/lib/zen-calendar/types";

function toDateKey(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function startOfUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function addUtcDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

export function secondsToGlowLevel(totalSeconds: number): GlowLevel {
  for (const tier of GLOW_THRESHOLDS) {
    if (totalSeconds <= tier.maxSeconds) {
      return tier.level;
    }
  }
  return 4;
}

function formatMonthLabel(year: number, month: number): string {
  const date = new Date(Date.UTC(year, month - 1, 1));
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Monday on or before the 1st of the month (UTC). */
export function getMonthGridStart(year: number, month: number): Date {
  const firstOfMonth = new Date(Date.UTC(year, month - 1, 1));
  const mondayOffset = (firstOfMonth.getUTCDay() + 6) % 7;
  return addUtcDays(firstOfMonth, -mondayOffset);
}

export function getMonthGridRange(year: number, month: number) {
  const gridStart = getMonthGridStart(year, month);
  const lastOfMonth = new Date(Date.UTC(year, month, 0));
  const daysUntilSunday = (7 - lastOfMonth.getUTCDay()) % 7;
  const gridEnd = addUtcDays(lastOfMonth, daysUntilSunday);
  const totalDays =
    Math.round((gridEnd.getTime() - gridStart.getTime()) / 86_400_000) + 1;
  const rowCount = (totalDays / 7) as 5 | 6;

  return { gridStart, gridEnd, totalDays, rowCount };
}

/** Build a Mon-start month grid (5 or 6 rows × 7 columns). */
export function buildMonthGrid(
  dailyTotals: Map<string, number>,
  year: number,
  month: number
): { cells: ZenCalendarCell[]; rowCount: 5 | 6 } {
  const { gridStart, totalDays, rowCount } = getMonthGridRange(year, month);

  const cells: ZenCalendarCell[] = [];
  let cursor = gridStart;

  for (let i = 0; i < totalDays; i++) {
    const key = toDateKey(cursor);
    const totalSeconds = dailyTotals.get(key) ?? 0;
    const isCurrentMonth =
      cursor.getUTCFullYear() === year && cursor.getUTCMonth() + 1 === month;

    cells.push({
      date: key,
      dayOfMonth: cursor.getUTCDate(),
      isCurrentMonth,
      totalSeconds,
      level: secondsToGlowLevel(totalSeconds),
    });
    cursor = addUtcDays(cursor, 1);
  }

  return { cells, rowCount };
}

export async function getZenCalendarData(
  userId: string,
  now: Date = new Date()
): Promise<ZenCalendarData> {
  const today = startOfUtcDay(now);
  const year = today.getUTCFullYear();
  const month = today.getUTCMonth() + 1;
  const { gridStart, gridEnd } = getMonthGridRange(year, month);

  const logs = await prisma.userMeditationLog.findMany({
    where: {
      userId,
      createdAt: {
        gte: gridStart,
        lt: addUtcDays(gridEnd, 1),
      },
    },
    select: {
      createdAt: true,
      duration: true,
    },
  });

  const dailyTotals = new Map<string, number>();

  for (const log of logs) {
    const key = toDateKey(log.createdAt);
    dailyTotals.set(key, (dailyTotals.get(key) ?? 0) + log.duration);
  }

  const { cells, rowCount } = buildMonthGrid(dailyTotals, year, month);
  const notesByDate = await getCalendarNotesForMonth(userId, year, month);

  return {
    cells,
    rowCount,
    monthLabel: formatMonthLabel(year, month),
    year,
    month,
    totalSessions: logs.length,
    notesByDate,
  };
}
