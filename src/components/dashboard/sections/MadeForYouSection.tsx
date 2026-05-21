import { MadeForYouCard } from "@/components/dashboard/cards/MadeForYouCard";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { CAROUSEL_ROW } from "@/lib/dashboard/styles";
import type { MadeForYouItem } from "@/lib/dashboard/types";

type MadeForYouSectionProps = {
  items: MadeForYouItem[];
  seeAllHref?: string;
};

export function MadeForYouSection({
  items,
  seeAllHref = "/courses",
}: MadeForYouSectionProps) {
  if (items.length === 0) {
    return (
      <section className="w-full" aria-label="Made for you">
        <SectionHeader title="Made For You" seeAllHref={seeAllHref} />
        <p className="text-sm tracking-wide text-stone-600">
          Personalized recommendations will appear as you begin your journey.
        </p>
      </section>
    );
  }

  return (
    <section className="w-full" aria-label="Made for you">
      <SectionHeader title="Made For You" seeAllHref={seeAllHref} />
      <div
        className={CAROUSEL_ROW}
        role="list"
        aria-label="Recommended for you"
      >
        {items.map((item) => (
          <MadeForYouCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
