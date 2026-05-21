import { TopPickHeroCard } from "@/components/dashboard/cards/TopPickHeroCard";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { CARD_RADIUS_LG, CARD_SURFACE } from "@/lib/dashboard/styles";
import type { TopPickItem } from "@/lib/dashboard/types";

type TopPickSectionProps = {
  item: TopPickItem | null;
};

export function TopPickSection({ item }: TopPickSectionProps) {
  return (
    <section className="w-full" aria-label="Your top pick today">
      <SectionHeader title="Your Top Pick Today" />
      {item ? (
        <TopPickHeroCard item={item} />
      ) : (
        <div
          className={`flex aspect-video w-full items-center justify-center border border-stone-800/50 ${CARD_RADIUS_LG} ${CARD_SURFACE}`}
        >
          <p className="text-sm tracking-wide text-stone-600">
            Today&apos;s featured practice is not available yet.
          </p>
        </div>
      )}
    </section>
  );
}
