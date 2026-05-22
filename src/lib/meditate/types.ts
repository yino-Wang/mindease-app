import type { LibraryCategory } from "@/lib/meditate/categories";

export type LibraryCardItem = {
  id: string;
  title: string;
  introduction: string;
  coverUrl: string;
  videoUrl: string;
  duration: number;
  durationLabel: string;
  author: string | null;
  category: LibraryCategory;
  href: string;
};
