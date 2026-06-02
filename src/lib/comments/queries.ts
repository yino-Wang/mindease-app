import { prisma } from "@/lib/prisma";
import { displayName, getInitials } from "@/lib/profile/utils";
import type {
  VideoCommentContentType,
  VideoCommentItem,
} from "@/lib/comments/types";

const MAX_COMMENT_LENGTH = 500;

export function normalizeCommentBody(body: string): string {
  return body.trim().slice(0, MAX_COMMENT_LENGTH);
}

export function validateCommentBody(body: string): string | null {
  const normalized = normalizeCommentBody(body);
  if (normalized.length < 1) return "Comment cannot be empty.";
  if (normalized.length > MAX_COMMENT_LENGTH) {
    return `Comment must be ${MAX_COMMENT_LENGTH} characters or fewer.`;
  }
  return null;
}

function toCommentItem(row: {
  id: string;
  body: string;
  createdAt: Date;
  userId: string;
  user: {
    email: string;
    username: string | null;
    avatarUrl: string | null;
  };
}): VideoCommentItem {
  return {
    id: row.id,
    body: row.body,
    createdAt: row.createdAt.toISOString(),
    userId: row.userId,
    displayName: displayName(row.user.username, row.user.email),
    avatarUrl: row.user.avatarUrl,
    initials: getInitials(row.user.username, row.user.email),
  };
}

export async function getVideoComments(
  contentType: VideoCommentContentType,
  contentId: string
): Promise<VideoCommentItem[]> {
  const rows = await prisma.videoComment.findMany({
    where: { contentType, contentId },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      user: {
        select: { email: true, username: true, avatarUrl: true },
      },
    },
  });

  return rows.map(toCommentItem);
}

export async function createVideoComment(
  userId: string,
  contentType: VideoCommentContentType,
  contentId: string,
  body: string
): Promise<VideoCommentItem> {
  const row = await prisma.videoComment.create({
    data: {
      userId,
      contentType,
      contentId,
      body: normalizeCommentBody(body),
    },
    include: {
      user: {
        select: { email: true, username: true, avatarUrl: true },
      },
    },
  });

  return toCommentItem(row);
}
