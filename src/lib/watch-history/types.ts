export type WatchHistoryContentType = "STREAMING" | "LIBRARY";

export type WatchHistoryItem = {
  id: string;
  contentType: WatchHistoryContentType;
  contentId: string;
  title: string;
  coverUrl: string;
  href: string;
  lastWatchedAt: string;
  durationLabel: string | null;
};
