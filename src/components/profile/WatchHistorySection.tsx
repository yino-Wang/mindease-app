"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CARD_RADIUS_SM } from "@/lib/dashboard/styles";
import type { WatchHistoryItem } from "@/lib/watch-history/types";

function formatWatchedAt(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return "This week";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

export function WatchHistorySection() {
  const [items, setItems] = useState<WatchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/watch-history");
        if (!res.ok) {
          throw new Error("Failed to load watch history");
        }
        const data = (await res.json()) as { items: WatchHistoryItem[] };
        if (!cancelled) {
          setItems(data.items ?? []);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Something went wrong");
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
  }, []);

  if (loading) {
    return (
      <div
        className="grid grid-cols-1 gap-8 md:grid-cols-2"
        aria-busy="true"
        aria-label="Loading watch history"
      >
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="animate-pulse space-y-3">
            <div className={`aspect-video w-full ${CARD_RADIUS_SM} bg-stone-900/60`} />
            <div className="h-5 w-3/4 rounded bg-stone-900/50" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-sm text-stone-500" role="alert">
        {error}
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm tracking-wide text-stone-500">
          You haven&apos;t watched any videos yet.
        </p>
        <Link
          href="/dashboard"
          className="mt-4 inline-block text-sm tracking-widest text-amber-500/80 uppercase transition-colors hover:text-amber-300"
        >
          Explore the dashboard
        </Link>
      </div>
    );
  }

  return (
    <ul
      className="grid grid-cols-1 gap-8 md:grid-cols-2"
      role="list"
      aria-label="Watch history"
    >
      {items.map((item) => {
        const isLocal = item.coverUrl.startsWith("/");
        return (
          <li key={item.id}>
            <Link
              href={item.href}
              className="group block space-y-4"
              aria-label={item.title}
            >
              <div
                className={`relative aspect-video overflow-hidden ${CARD_RADIUS_SM} border border-stone-800/50 bg-stone-950/40 transition-all duration-700 group-hover:border-amber-500/25`}
              >
                <Image
                  src={item.coverUrl}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  unoptimized={isLocal}
                  className="object-cover opacity-90 transition-opacity group-hover:opacity-100"
                />
              </div>
              <div className="min-w-0 space-y-0.5">
                <p className="line-clamp-2 text-xl leading-snug text-stone-200 sm:text-2xl">
                  {item.title}
                </p>
                <p className="text-base text-stone-600">
                  {formatWatchedAt(item.lastWatchedAt)}
                  {item.durationLabel ? ` · ${item.durationLabel}` : ""}
                </p>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
