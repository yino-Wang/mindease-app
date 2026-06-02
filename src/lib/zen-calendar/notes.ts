import "server-only";
import { prisma } from "@/lib/prisma";
import { getMonthGridRange } from "@/lib/zen-calendar/aggregate";
import { normalizeCalendarNote } from "@/lib/zen-calendar/notes-utils";

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
