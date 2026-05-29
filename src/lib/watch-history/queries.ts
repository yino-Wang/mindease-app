import { prisma } from "@/lib/prisma";
import { getLibraryItemById } from "@/lib/meditate/queries";
import { formatDurationLabel } from "@/lib/meditate/queries";
import { getStreamingItemById, incrementStreamingPlayCount } from "@/lib/streaming/queries";
import type {
  WatchHistoryContentType,
  WatchHistoryItem,
} from "@/lib/watch-history/types";

const PAGE_SIZE = 48;

function toWatchHistoryItem(row: {
  id: string;
  contentType: string;
  contentId: string;
  title: string;
  coverUrl: string;
  href: string;
  lastWatchedAt: Date;
  durationSeconds: number | null;
}): WatchHistoryItem {
  return {
    id: row.id,
    contentType: row.contentType as WatchHistoryContentType,
    contentId: row.contentId,
    title: row.title,
    coverUrl: row.coverUrl,
    href: row.href,
    lastWatchedAt: row.lastWatchedAt.toISOString(),
    durationLabel: row.durationSeconds
      ? formatDurationLabel(row.durationSeconds)
      : null,
  };
}

async function resolveWatchTarget(
  contentType: WatchHistoryContentType,
  contentId: string
): Promise<{
  title: string;
  coverUrl: string;
  href: string;
  durationSeconds: number | null;
} | null> {
  if (contentType === "STREAMING") {
    const item = await getStreamingItemById(contentId);
    if (!item) return null;
    return {
      title: item.title,
      coverUrl: item.coverUrl,
      href: `/dashboard/meditate/${item.id}`,
      durationSeconds: item.duration,
    };
  }

  const item = await getLibraryItemById(contentId);
  if (!item) return null;
  return {
    title: item.title,
    coverUrl: item.coverUrl,
    href: item.href,
    durationSeconds: item.duration > 0 ? item.duration : null,
  };
}

export async function recordWatchHistory(
  userId: string,
  contentType: WatchHistoryContentType,
  contentId: string
): Promise<void> {
  const target = await resolveWatchTarget(contentType, contentId);
  if (!target) return;

  await prisma.userWatchHistory.upsert({
    where: {
      userId_contentType_contentId: {
        userId,
        contentType,
        contentId,
      },
    },
    create: {
      userId,
      contentType,
      contentId,
      title: target.title,
      coverUrl: target.coverUrl,
      href: target.href,
      durationSeconds: target.durationSeconds,
      lastWatchedAt: new Date(),
    },
    update: {
      title: target.title,
      coverUrl: target.coverUrl,
      href: target.href,
      durationSeconds: target.durationSeconds,
      lastWatchedAt: new Date(),
    },
  });

  if (contentType === "STREAMING") {
    await incrementStreamingPlayCount(contentId);
  }
}

export async function getWatchHistoryForUser(
  userId: string,
  options?: { limit?: number; offset?: number }
): Promise<WatchHistoryItem[]> {
  const limit = options?.limit ?? PAGE_SIZE;
  const offset = options?.offset ?? 0;

  const rows = await prisma.userWatchHistory.findMany({
    where: { userId },
    orderBy: { lastWatchedAt: "desc" },
    take: limit,
    skip: offset,
  });

  return rows.map(toWatchHistoryItem);
}
