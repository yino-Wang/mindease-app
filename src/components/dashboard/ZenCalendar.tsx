import {
  GLOW_CELL_CLASSES,
  MONTH_CELL_BASE,
  MONTH_GRID_GAP,
  MONTH_WEEKDAY_LABELS,
} from "@/lib/zen-calendar/constants";
import type { ZenCalendarData } from "@/lib/zen-calendar/types";

type ZenCalendarProps = {
  data: ZenCalendarData;
  todayKey?: string;
};

function formatTooltip(date: string, totalSeconds: number): string {
  if (totalSeconds <= 0) {
    return `${date}: no practice`;
  }
  const minutes = Math.max(1, Math.round(totalSeconds / 60));
  return `${date}: ${minutes} min`;
}

export function ZenCalendar({ data, todayKey }: ZenCalendarProps) {
  const hasActivity = data.cells.some(
    (c) => c.isCurrentMonth && c.level > 0
  );

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <div
        className={`mb-2 grid shrink-0 grid-cols-7 ${MONTH_GRID_GAP} sm:mb-3`}
      >
        {MONTH_WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="flex items-center justify-center text-[10px] font-medium tracking-wider text-stone-500 uppercase sm:text-xs"
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
          const glowClass =
            cell.level > 0 ? GLOW_CELL_CLASSES[cell.level] : "";

          return (
            <div
              key={cell.date}
              className={`flex min-h-0 min-w-0 flex-col p-1.5 sm:p-2 ${MONTH_CELL_BASE} ${glowClass} ${!cell.isCurrentMonth ? "opacity-40" : ""} ${isToday ? "ring-1 ring-amber-500/40" : ""}`}
              title={formatTooltip(cell.date, cell.totalSeconds)}
            >
              <span
                className={`text-[10px] leading-none sm:text-xs ${cell.isCurrentMonth ? "text-stone-400" : "text-stone-600"}`}
              >
                {cell.dayOfMonth}
              </span>
            </div>
          );
        })}
      </div>

      {!hasActivity && (
        <p className="mt-2 shrink-0 text-[10px] tracking-wide text-stone-600 sm:text-xs">
          Your energy glow will appear as you log meditation sessions.
        </p>
      )}
    </div>
  );
}
