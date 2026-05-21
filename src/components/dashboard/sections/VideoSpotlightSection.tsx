import { SpotlightVideoCard } from "@/components/dashboard/cards/SpotlightVideoCard";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { CAROUSEL_ROW } from "@/lib/dashboard/styles";
import type { SpotlightItem } from "@/lib/dashboard/types";

type VideoSpotlightSectionProps = {
  items: SpotlightItem[];
  seeAllHref?: string;
};

export function VideoSpotlightSection({
  items,
  seeAllHref = "/courses",
}: VideoSpotlightSectionProps) {
  if (items.length === 0) {
    return (
      <section className="w-full" aria-label="Video spotlight">
        <SectionHeader title="Video Spotlight" seeAllHref={seeAllHref} />
        <p className="text-sm tracking-wide text-stone-600">
          Course previews will appear after seeding. Run{" "}
          <code className="rounded-lg bg-stone-900/40 px-2 py-0.5 text-amber-500/80">
            npm run db:seed
          </code>
          .
        </p>
      </section>
    );
  }

  return (
    <section className="w-full" aria-label="Video spotlight">
      <SectionHeader title="Video Spotlight" seeAllHref={seeAllHref} />
      <div className={CAROUSEL_ROW} role="list" aria-label="Spotlight videos">
        {items.map((item) => (
          <SpotlightVideoCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
