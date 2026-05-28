export type DailyPickSource = {
  name: string;
  url: string;
  homepage?: string;
};

export const DAILY_PICK_SOURCES: readonly DailyPickSource[] = [
  {
    name: "Mindful",
    url: "https://www.mindful.org/feed",
    homepage: "https://www.mindful.org/",
  },
  {
    name: "Zen Habits",
    url: "https://zenhabits.net/feed",
    homepage: "https://zenhabits.net/",
  },
  {
    name: "Tiny Buddha",
    url: "https://feeds.feedburner.com/tinybuddha",
    homepage: "https://tinybuddha.com/",
  },
];
