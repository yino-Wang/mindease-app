import { TopPickSection } from "@/components/dashboard/sections/TopPickSection";
import { ZenCalendarSection } from "@/components/dashboard/sections/ZenCalendarSection";
import type { TopPickItem } from "@/lib/dashboard/types";
import type { ZenCalendarData } from "@/lib/zen-calendar/types";

type TopTierSplitSectionProps = {
  topPick: TopPickItem | null;
  zenCalendar: ZenCalendarData;
};

export function TopTierSplitSection({
  topPick,
  zenCalendar,
}: TopTierSplitSectionProps) {
  return (
    <section
      className="mb-12 grid w-full grid-cols-1 items-stretch gap-10 lg:grid-cols-2"
      aria-label="Featured today"
    >
      <div className="flex min-w-0 flex-col">
        <TopPickSection item={topPick} variant="embedded" />
      </div>
      <div className="flex min-h-0 min-w-0 flex-col">
        <ZenCalendarSection data={zenCalendar} />
      </div>
    </section>
  );
}
