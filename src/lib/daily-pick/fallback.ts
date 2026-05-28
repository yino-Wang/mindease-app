import type { DailyPickArticle } from "@/lib/daily-pick/types";

const FALLBACK_ARTICLES: readonly Omit<DailyPickArticle, "id">[] = [
  {
    title: "A Gentle Way Back to Breath",
    excerpt:
      "When the day tightens around you, return to the simplest refuge: one slow inhale, one unhurried exhale. Begin again without keeping score.",
    referenceUrl: "https://www.mindful.org/",
    sourceName: "MindEase (fallback)",
    sourceUrl: "https://www.mindful.org/",
    imageUrl: "/cover/4.png",
    author: "MindEase",
    publishedAt: null,
  },
  {
    title: "Stillness Is a Skill",
    excerpt:
      "Stillness doesn’t arrive by force. It arrives by repetition—small moments of attention, practiced until calm becomes familiar.",
    referenceUrl: "https://zenhabits.net/",
    sourceName: "MindEase (fallback)",
    sourceUrl: "https://zenhabits.net/",
    imageUrl: "/cover/5.png",
    author: "MindEase",
    publishedAt: null,
  },
];

function dayOfYear(now: Date): number {
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function getFallbackDailyPick(now: Date = new Date()): DailyPickArticle {
  const pick = FALLBACK_ARTICLES[dayOfYear(now) % FALLBACK_ARTICLES.length];
  return {
    ...pick,
    id: `fallback-${dayOfYear(now)}`,
  };
}
