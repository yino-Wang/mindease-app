import { TopPickHeroCard } from "@/components/dashboard/cards/TopPickHeroCard";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { CARD_RADIUS_LG, CARD_SURFACE } from "@/lib/dashboard/styles";
import type { TopPickItem } from "@/lib/dashboard/types";

type TopPickSectionProps = {
  item: TopPickItem | null;
  variant?: "default" | "embedded";
};

export function TopPickSection({
  item,
  variant = "default",
}: TopPickSectionProps) {
  const showHeader = variant === "default";

  const isEmbedded = variant === "embedded";

  return (
    <section
      className={isEmbedded ? "flex h-full w-full flex-col" : "w-full"}
      aria-label="Your top pick today"
    >
      {showHeader && <SectionHeader title="Your Top Pick Today" />}
      {isEmbedded && (
        <h2 className="mb-4 text-xs font-medium tracking-[0.25em] text-stone-500 uppercase">
          Your Top Pick Today
        </h2>
      )}
      {item ? (
        <div className={isEmbedded ? "min-h-[130px]" : ""}>
          <TopPickHeroCard
            item={item}
            layout={isEmbedded ? "split" : "default"}
          />
        </div>
      ) : (
        <div
          className={`flex w-full items-center justify-center border border-stone-800/50 ${CARD_RADIUS_LG} ${CARD_SURFACE} ${isEmbedded ? "min-h-[240px] flex-1" : "aspect-video"}`}
        >
          <p className="text-sm tracking-wide text-stone-600">
            Today&apos;s featured practice is not available yet.
          </p>
        </div>
      )}
    </section>
  );
}
