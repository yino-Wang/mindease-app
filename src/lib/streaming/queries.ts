import { prisma } from "@/lib/prisma";
import { resolveStreamingMediaUrl } from "@/lib/media/resolve-playable-url";
import type {
  StreamingCardItem,
  StreamingItemRecord,
  StreamingSectionType,
} from "@/lib/streaming/types";

function parseTags(tags: string): string[] {
  if (!tags.trim()) return [];
  return tags.split(",").map((t) => t.trim()).filter(Boolean);
}

function formatDurationMinutes(seconds: number): number {
  return Math.max(1, Math.round(seconds / 60));
}

function formatSubtitle(
  sectionType: StreamingSectionType,
  durationMinutes: number,
  rating: number
): string {
  const kind = sectionType === "SPOTLIGHT" ? "Masterclass" : "Loop";
  return `${rating.toFixed(1)}★ · ${kind} · ${durationMinutes} min`;
}

function toRecord(row: {
  id: string;
  sectionType: string;
  title: string;
  description: string;
  videoUrl: string;
  coverUrl: string;
  duration: number;
  rating: number;
  playCount: number;
  author: string | null;
  tags: string;
}): StreamingItemRecord {
  return {
    id: row.id,
    sectionType: row.sectionType as StreamingSectionType,
    title: row.title,
    description: row.description,
    videoUrl: row.videoUrl,
    coverUrl: row.coverUrl,
    duration: row.duration,
    rating: row.rating,
    playCount: row.playCount,
    author: row.author,
    tags: parseTags(row.tags),
  };
}

export async function getStreamingItemsBySection(
  sectionType: StreamingSectionType
): Promise<StreamingCardItem[]> {
  const rows = await prisma.streamingItem.findMany({
    where: { sectionType, published: true },
    orderBy: { sortOrder: "asc" },
  });

  return Promise.all(
    rows.map(async (row) => {
      const playable = await resolveStreamingMediaUrl(row.videoUrl).catch(
        () => row.videoUrl
      );
      const durationMinutes = formatDurationMinutes(row.duration);
      return {
        id: row.id,
        title: row.title,
        subtitle: formatSubtitle(
          sectionType,
          durationMinutes,
          row.rating
        ),
        coverUrl: row.coverUrl,
        videoUrl: playable,
        href: `/dashboard/meditate/${row.id}`,
        durationMinutes,
        rating: row.rating,
      };
    })
  );
}

export async function getStreamingItemById(
  id: string
): Promise<StreamingItemRecord | null> {
  const row = await prisma.streamingItem.findFirst({
    where: { id, published: true },
  });

  if (!row) return null;

  const videoUrl = await resolveStreamingMediaUrl(row.videoUrl).catch(
    () => row.videoUrl
  );

  return { ...toRecord(row), videoUrl };
}

export async function incrementStreamingPlayCount(id: string): Promise<void> {
  await prisma.streamingItem.update({
    where: { id },
    data: { playCount: { increment: 1 } },
  });
}

export function formatPlayCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(count >= 10000 ? 0 : 1)}k`;
  }
  return String(count);
}
