import { getLibraryItemById } from "@/lib/meditate/queries";
import { resolveStreamingMediaUrl } from "@/lib/media/resolve-playable-url";
import { getStreamingItemById } from "@/lib/streaming/queries";
import type { StreamingItemRecord } from "@/lib/streaming/types";

export async function getPlayableMediaById(
  id: string
): Promise<StreamingItemRecord | null> {
  const streaming = await getStreamingItemById(id);
  if (streaming) {
    return streaming;
  }

  const row = await getLibraryItemById(id);
  if (!row) {
    return null;
  }

  const videoUrl = await resolveStreamingMediaUrl(row.videoUrl).catch(
    () => row.videoUrl
  );

  return {
    id: row.id,
    sectionType: "LIBRARY",
    libraryCategory: row.category,
    title: row.title,
    description: row.introduction,
    videoUrl,
    coverUrl: row.coverUrl,
    duration: row.duration,
    rating: 4.8,
    playCount: 0,
    author: row.author,
    tags: [row.category],
  };
}
