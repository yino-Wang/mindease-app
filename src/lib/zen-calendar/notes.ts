import { prisma } from "@/lib/prisma";
import { getMonthGridRange } from "@/lib/zen-calendar/aggregate";

export const MAX_CALENDAR_NOTE_LENGTH = 200;

export function normalizeCalendarNote(body: string): string {
  return body.trim().slice(0, MAX_CALENDAR_NOTE_LENGTH);
}

export function validateCalendarNote(body: string): string | null {
  if (normalizeCalendarNote(body).length > MAX_CALENDAR_NOTE_LENGTH) {
    return `Note must be ${MAX_CALENDAR_NOTE_LENGTH} characters or fewer.`;
  }
  return null;
}

const DATE_KEY_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isValidDateKey(date: string): boolean {
  if (!DATE_KEY_RE.test(date)) return false;
  const [y, m, d] = date.split("-").map(Number);
  const parsed = new Date(Date.UTC(y, m - 1, d));
  return (
    parsed.getUTCFullYear() === y &&
    parsed.getUTCMonth() + 1 === m &&
    parsed.getUTCDate() === d
  );
}

export async function getCalendarNotesForMonth(
  userId: string,
  year: number,
  month: number
): Promise<Record<string, string>> {
  const { gridStart, gridEnd } = getMonthGridRange(year, month);

  const y = (n: number) => String(n).padStart(2, "0");
  const startKey = `${gridStart.getUTCFullYear()}-${y(gridStart.getUTCMonth() + 1)}-${y(gridStart.getUTCDate())}`;
  const endKey = `${gridEnd.getUTCFullYear()}-${y(gridEnd.getUTCMonth() + 1)}-${y(gridEnd.getUTCDate())}`;

  const rows = await prisma.zenCalendarNote.findMany({
    where: {
      userId,
      date: { gte: startKey, lte: endKey },
    },
    select: { date: true, body: true },
  });

  const notesByDate: Record<string, string> = {};
  for (const row of rows) {
    notesByDate[row.date] = row.body;
  }
  return notesByDate;
}

export async function upsertCalendarNote(
  userId: string,
  date: string,
  body: string
): Promise<{ date: string; body: string } | null> {
  const normalized = normalizeCalendarNote(body);

  if (normalized.length === 0) {
    await prisma.zenCalendarNote.deleteMany({
      where: { userId, date },
    });
    return null;
  }

  const row = await prisma.zenCalendarNote.upsert({
    where: { userId_date: { userId, date } },
    create: { userId, date, body: normalized },
    update: { body: normalized },
    select: { date: true, body: true },
  });

  return row;
}
