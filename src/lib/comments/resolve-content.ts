import { getLibraryItemById } from "@/lib/meditate/queries";
import { getStreamingItemById } from "@/lib/streaming/queries";
import type { VideoCommentContentType } from "@/lib/comments/types";

export async function resolveCommentTarget(
  mediaId: string
): Promise<{ contentType: VideoCommentContentType; contentId: string } | null> {
  const streaming = await getStreamingItemById(mediaId);
  if (streaming) {
    return { contentType: "STREAMING", contentId: streaming.id };
  }

  const library = await getLibraryItemById(mediaId);
  if (library) {
    return { contentType: "LIBRARY", contentId: library.id };
  }

  return null;
}
