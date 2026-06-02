"use client";

import { useCallback, useEffect, useState } from "react";
import { FOCUS_RING } from "@/lib/dashboard/styles";
import {
  GLOW_CELL_CLASSES,
  MONTH_CELL_BASE,
  MONTH_GRID_GAP,
  MONTH_WEEKDAY_LABELS,
} from "@/lib/zen-calendar/constants";
import { MAX_CALENDAR_NOTE_LENGTH } from "@/lib/zen-calendar/notes-utils";
import type { ZenCalendarCell, ZenCalendarData } from "@/lib/zen-calendar/types";

type ZenCalendarProps = {
  data: ZenCalendarData;
  todayKey?: string;
};

function formatTooltip(
  date: string,
  totalSeconds: number,
  hasNote: boolean
): string {
  const minutes =
    totalSeconds > 0 ? Math.max(1, Math.round(totalSeconds / 60)) : 0;
  const practice =
    totalSeconds <= 0 ? "no practice" : `${minutes} min meditation`;
  const note = hasNote ? " · note saved" : "";
  return `${date}: ${practice}${note}`;
}

type CalendarDayCellProps = {
  cell: ZenCalendarCell;
  isToday: boolean;
  note: string;
  onNoteChange: (date: string, value: string) => void;
  onNoteBlur: (date: string) => void;
};

function CalendarDayCell({
  cell,
  isToday,
  note,
  onNoteChange,
  onNoteBlur,
}: CalendarDayCellProps) {
  const glowClass = cell.level > 0 ? GLOW_CELL_CLASSES[cell.level] : "";
  const hasNote = note.trim().length > 0;

  return (
    <div
      className={`flex min-h-0 min-w-0 flex-col p-1 sm:p-1.5 ${MONTH_CELL_BASE} ${glowClass} ${!cell.isCurrentMonth ? "opacity-40" : ""} ${isToday ? "ring-1 ring-amber-500/40" : ""}`}
      title={formatTooltip(cell.date, cell.totalSeconds, hasNote)}
    >
      <span
        className={`shrink-0 text-[9px] leading-none sm:text-[10px] ${cell.isCurrentMonth ? "text-stone-400" : "text-stone-600"}`}
      >
        {cell.dayOfMonth}
      </span>
      <label className="sr-only" htmlFor={`zen-note-${cell.date}`}>
        Note for {cell.date}
      </label>
      <textarea
        id={`zen-note-${cell.date}`}
        value={note}
        onChange={(e) => onNoteChange(cell.date, e.target.value)}
        onBlur={() => onNoteBlur(cell.date)}
        maxLength={MAX_CALENDAR_NOTE_LENGTH}
        placeholder="Note…"
        rows={2}
        className={`mt-0.5 min-h-0 w-full flex-1 resize-none bg-transparent text-[13px] leading-snug text-stone-300 placeholder:text-stone-600 focus:outline-none sm:text-[15px] ${FOCUS_RING}`}
        aria-label={`Note for ${cell.date}`}
      />
    </div>
  );
}

export function ZenCalendar({ data, todayKey }: ZenCalendarProps) {
  const [notesByDate, setNotesByDate] = useState<Record<string, string>>(
    () => data.notesByDate ?? {}
  );
  const [draftByDate, setDraftByDate] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const cell of data.cells) {
      initial[cell.date] = data.notesByDate?.[cell.date] ?? "";
    }
    return initial;
  });
  useEffect(() => {
    setNotesByDate(data.notesByDate ?? {});
    const next: Record<string, string> = {};
    for (const cell of data.cells) {
      next[cell.date] = data.notesByDate?.[cell.date] ?? "";
    }
    setDraftByDate(next);
  }, [data.year, data.month, data.notesByDate, data.cells]);

  const saveNote = useCallback(async (date: string, body: string) => {
    const trimmed = body.trim();
    try {
      const res = await fetch("/api/zen-calendar/notes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, body: trimmed }),
      });

      const payload = (await res.json()) as {
        note?: { date: string; body: string } | null;
        error?: string;
      };

      if (!res.ok) {
        throw new Error(payload.error ?? "Failed to save note");
      }

      setNotesByDate((prev) => {
        const next = { ...prev };
        if (payload.note?.body) {
          next[date] = payload.note.body;
        } else {
          delete next[date];
        }
        return next;
      });
      setDraftByDate((prev) => ({
        ...prev,
        [date]: payload.note?.body ?? "",
      }));
    } catch {
      setDraftByDate((prev) => ({
        ...prev,
        [date]: notesByDate[date] ?? "",
      }));
    }
  }, [notesByDate]);

  const handleNoteChange = useCallback((date: string, value: string) => {
    setDraftByDate((prev) => ({ ...prev, [date]: value }));
  }, []);

  const handleNoteBlur = useCallback(
    (date: string) => {
      const body = draftByDate[date] ?? "";
      const trimmed = body.trim();
      const saved = (notesByDate[date] ?? "").trim();
      if (trimmed === saved) return;
      void saveNote(date, body);
    },
    [draftByDate, notesByDate, saveNote]
  );

  const hasActivity = data.cells.some(
    (c) => c.isCurrentMonth && c.level > 0
  );

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <div
        className={`mb-2 grid shrink-0 grid-cols-7 ${MONTH_GRID_GAP} sm:mb-2`}
      >
        {MONTH_WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="flex items-center justify-center text-[9px] font-medium tracking-wider text-stone-500 uppercase sm:text-[10px]"
          >
            {label}
          </div>
        ))}
      </div>

      <div
        className={`grid min-h-0 flex-1 grid-cols-7 ${MONTH_GRID_GAP}`}
        style={{
          gridTemplateRows: `repeat(${data.rowCount}, minmax(0, 1fr))`,
        }}
        role="img"
        aria-label={`Meditation calendar for ${data.monthLabel}. ${data.totalSessions} sessions logged this month.`}
      >
        {data.cells.map((cell) => {
          const isToday = todayKey === cell.date;

          return (
            <CalendarDayCell
              key={cell.date}
              cell={cell}
              isToday={isToday}
              note={draftByDate[cell.date] ?? ""}
              onNoteChange={handleNoteChange}
              onNoteBlur={handleNoteBlur}
            />
          );
        })}
      </div>

      {!hasActivity && (
        <p className="mt-1.5 shrink-0 text-[10px] tracking-wide text-stone-600 sm:text-xs">
          Your energy glow will appear as you log meditation sessions. Add a
          short note on any day to capture your journey.
        </p>
      )}
    </div>
  );
}
