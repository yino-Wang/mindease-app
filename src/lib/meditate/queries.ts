import { prisma } from "@/lib/prisma";
import {
  isLibraryCategory,
  type LibraryCategory,
} from "@/lib/meditate/categories";
import type { LibraryCardItem } from "@/lib/meditate/types";

export function formatDurationLabel(seconds: number | null | undefined): string {
  if (seconds == null || seconds <= 0) return "—";
  const total = Math.max(1, Math.round(seconds));
  const minutes = Math.floor(total / 60);
  const secs = total % 60;
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const rem = minutes % 60;
    return rem > 0 ? `${hours}:${String(rem).padStart(2, "0")}:00` : `${hours}:00:00`;
  }
  return `${minutes}:${String(secs).padStart(2, "0")}`;
}

function toLibraryCard(row: {
  id: string;
  name: string;
  introduction: string | null;
  coverUrl: string | null;
  url: string;
  duration: number | null;
  author: string | null;
  category: string;
}): LibraryCardItem {
  const category = row.category as LibraryCategory;
  return {
    id: row.id,
    title: row.name,
    introduction: row.introduction ?? "",
    coverUrl: row.coverUrl ?? "/cover/1.jpg",
    videoUrl: row.url,
    duration: row.duration ?? 0,
    durationLabel: formatDurationLabel(row.duration),
    author: row.author,
    category,
    href: `/dashboard/meditate/${row.id}`,
  };
}

export async function getLibraryItemsByCategory(
  category: LibraryCategory
): Promise<LibraryCardItem[]> {
  const rows = await prisma.meditationAudio.findMany({
    where: { category, published: true },
    orderBy: { sortOrder: "asc" },
  });

  return rows.map(toLibraryCard);
}

export async function getLibraryItemById(
  id: string
): Promise<LibraryCardItem | null> {
  const row = await prisma.meditationAudio.findFirst({
    where: { id, published: true },
  });

  if (!row || !isLibraryCategory(row.category)) {
    return null;
  }

  return toLibraryCard(row);
}
