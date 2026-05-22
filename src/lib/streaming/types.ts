export type StreamingSectionType = "SPOTLIGHT" | "MADE_FOR_YOU";

export type StreamingItemRecord = {
  id: string;
  sectionType: StreamingSectionType;
  title: string;
  description: string;
  videoUrl: string;
  coverUrl: string;
  duration: number;
  rating: number;
  playCount: number;
  author: string | null;
  tags: string[];
};

export type StreamingCardItem = {
  id: string;
  title: string;
  subtitle: string;
  coverUrl: string;
  videoUrl: string | null;
  href: string;
  durationMinutes: number;
  rating: number;
};
