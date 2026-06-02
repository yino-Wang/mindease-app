"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import {
  CARD_BORDER,
  CARD_RADIUS_LG,
  CARD_SURFACE,
  FOCUS_RING,
} from "@/lib/dashboard/styles";
import type { VideoCommentItem } from "@/lib/comments/types";

type VideoCommentsSectionProps = {
  mediaId: string;
};

function formatCommentTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function CommentAvatar({
  avatarUrl,
  initials,
}: {
  avatarUrl: string | null;
  initials: string;
}) {
  const className =
    "relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-stone-800/80 bg-stone-900/60";

  if (avatarUrl) {
    return (
      <div className={className}>
        <Image
          src={avatarUrl}
          alt=""
          fill
          unoptimized
          className="object-cover"
          sizes="40px"
        />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center text-xs font-semibold tracking-widest text-amber-400/90 ${className}`}
    >
      {initials}
    </div>
  );
}

export function VideoCommentsSection({ mediaId }: VideoCommentsSectionProps) {
  const [comments, setComments] = useState<VideoCommentItem[]>([]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadComments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/media/${mediaId}/comments`);
      if (!res.ok) {
        throw new Error("Failed to load comments");
      }
      const data = (await res.json()) as { comments: VideoCommentItem[] };
      setComments(data.comments ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [mediaId]);

  useEffect(() => {
    void loadComments();
  }, [loadComments]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = body.trim();
    if (!trimmed || submitting) return;

    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/media/${mediaId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: trimmed }),
      });

      const data = (await res.json()) as {
        comment?: VideoCommentItem;
        error?: string;
      };

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to post comment");
      }

      if (data.comment) {
        setComments((prev) => [data.comment!, ...prev]);
      }
      setBody("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      className={`mt-8 w-full ${CARD_SURFACE} ${CARD_BORDER} ${CARD_RADIUS_LG} p-5 sm:p-6`}
      aria-label="Comments"
    >
      <h2 className="text-sm tracking-[0.25em] text-stone-500 uppercase">
        Comments
      </h2>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-3">
        <label className="sr-only" htmlFor={`comment-input-${mediaId}`}>
          Write a comment
        </label>
        <input
          id={`comment-input-${mediaId}`}
          type="text"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={500}
          placeholder="Share your thoughts…"
          disabled={submitting}
          className={`min-w-0 flex-1 rounded-full border border-stone-700/60 bg-stone-950/50 px-5 py-3 text-sm tracking-wide text-stone-200 placeholder:text-stone-600 focus:border-amber-500/40 focus:outline-none ${FOCUS_RING}`}
        />
        <button
          type="submit"
          disabled={submitting || !body.trim()}
          className={`shrink-0 rounded-full border border-amber-500/35 bg-amber-500/10 px-6 py-3 text-sm tracking-widest text-amber-300 uppercase transition-all duration-700 hover:border-amber-500/55 hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-40 ${FOCUS_RING}`}
        >
          {submitting ? "Sending…" : "Send"}
        </button>
      </form>

      {error ? (
        <p className="mt-3 text-sm text-amber-600/90" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-6 space-y-5">
        {loading ? (
          <p className="text-sm text-stone-600">Loading comments…</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-stone-600">
            No comments yet. Be the first to share your experience.
          </p>
        ) : (
          <ul className="space-y-5" role="list">
            {comments.map((comment) => (
              <li key={comment.id} className="flex gap-3">
                <CommentAvatar
                  avatarUrl={comment.avatarUrl}
                  initials={comment.initials}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="text-sm font-medium text-stone-200">
                      {comment.displayName}
                    </span>
                    <time
                      className="text-xs text-stone-600"
                      dateTime={comment.createdAt}
                    >
                      {formatCommentTime(comment.createdAt)}
                    </time>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-stone-400">
                    {comment.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
