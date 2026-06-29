export type DailyPickArticle = {
  id: string;
  title: string;
  excerpt: string;
  referenceUrl: string;
  sourceName: string;
  sourceUrl: string;
  imageUrl: string | null;
  author: string | null;
  publishedAt: string | null;

  /**
   * Enriched from fetching the actual article page (optional).
   * Kept optional so RSS-only items remain valid.
   */
  contentHtml?: string | null;
  contentText?: string | null;
  heroImageUrl?: string | null;
};
