import { CategoryVideoListCard } from "@/components/dashboard/cards/CategoryVideoListCard";
import type { LibraryCardItem } from "@/lib/meditate/types";
import type { LibraryCategory } from "@/lib/meditate/categories";

type CategoryVideoListSectionProps = {
  category: LibraryCategory;
  items: LibraryCardItem[];
};

export function CategoryVideoListSection({
  category,
  items,
}: CategoryVideoListSectionProps) {
  return (
    <section className="w-full" aria-label={`${category} video library`}>
      <h2 className="mb-6 font-serif text-xl tracking-wide text-stone-300">
        {category} Library
      </h2>
      <div className="flex flex-col gap-8" role="list">
        {items.map((item) => (
          <CategoryVideoListCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
