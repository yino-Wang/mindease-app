export type VideoCommentContentType = "STREAMING" | "LIBRARY";

export type VideoCommentItem = {
  id: string;
  body: string;
  createdAt: string;
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  initials: string;
};
