import { ZenCalendar } from "@/components/dashboard/ZenCalendar";
import {
  CARD_BORDER_ALT,
  CARD_RADIUS_LG,
  CARD_SURFACE,
} from "@/lib/dashboard/styles";
import type { ZenCalendarData } from "@/lib/zen-calendar/types";

type ZenCalendarSectionProps = {
  data: ZenCalendarData;
};

function todayUtcKey(): string {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, "0");
  const d = String(now.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function ZenCalendarSection({ data }: ZenCalendarSectionProps) {
  return (
    <section className="flex h-full min-w-0 flex-col" aria-label="Zen calendar">
      <h2 className="mb-4 shrink-0 text-xs font-medium tracking-[0.25em] text-stone-500 uppercase">
        Zen Calendar
      </h2>
      <div
        className={`flex min-h-[320px] flex-1 flex-col ${CARD_RADIUS_LG} ${CARD_SURFACE} ${CARD_BORDER_ALT} p-3 sm:p-4`}
      >
        <p className="mb-1.5 shrink-0 font-serif text-sm tracking-wide text-stone-300 sm:text-sm">
          {data.monthLabel}
        </p>
        <ZenCalendar data={data} todayKey={todayUtcKey()} />
      </div>
    </section>
  );
}
