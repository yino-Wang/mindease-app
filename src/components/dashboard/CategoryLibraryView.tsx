"use client";

import { useEffect, useState } from "react";
import { CategoryVideoListSection } from "@/components/dashboard/sections/CategoryVideoListSection";
import type { LibraryCategory } from "@/lib/meditate/categories";
import type { LibraryCardItem } from "@/lib/meditate/types";

type CategoryLibraryViewProps = {
  category: LibraryCategory;
};

export function CategoryLibraryView({ category }: CategoryLibraryViewProps) {
  const [items, setItems] = useState<LibraryCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/meditate?category=${category}`);
        if (!res.ok) {
          const body = (await res.json().catch(() => ({}))) as {
            error?: string;
          };
          throw new Error(body.error ?? `Request failed (${res.status})`);
        }
        const data = (await res.json()) as { items: LibraryCardItem[] };
        if (!cancelled) {
          setItems(data.items ?? []);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load library");
          setItems([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [category]);

  if (loading) {
    return (
      <section className="w-full py-8" aria-busy="true" aria-label="Loading">
        <div className="space-y-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex animate-pulse flex-col gap-4 sm:flex-row sm:gap-6"
            >
              <div className="aspect-video w-full max-w-[360px] shrink-0 rounded-xl bg-stone-900/60" />
              <div className="flex flex-1 flex-col gap-3 py-2">
                <div className="h-5 w-3/4 rounded bg-stone-900/60" />
                <div className="h-4 w-1/2 rounded bg-stone-900/50" />
                <div className="h-4 w-full rounded bg-stone-900/40" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full py-8">
        <p className="text-sm text-stone-500">{error}</p>
        <p className="mt-2 text-sm text-stone-600">
          Run{" "}
          <code className="rounded-lg bg-stone-900/40 px-2 py-0.5 text-amber-500/80">
            npm run db:seed
          </code>{" "}
          if the library is empty.
        </p>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="w-full py-8">
        <p className="text-sm tracking-wide text-stone-600">
          No videos in {category} yet. Seed the category library to populate
          this page.
        </p>
      </section>
    );
  }

  return <CategoryVideoListSection category={category} items={items} />;
}
