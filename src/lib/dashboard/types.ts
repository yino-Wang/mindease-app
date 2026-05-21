export type SpotlightItem = {
  id: string;
  title: string;
  subtitle: string;
  videoUrl: string | null;
  href: string;
};

export type TopPickItem = {
  id: string;
  title: string;
  subtitle: string;
  videoUrl: string | null;
  href: string;
  durationMinutes: number | null;
};

export type MadeForYouItem = {
  id: string;
  title: string;
  subtitle: string;
  videoUrl: string | null;
  href: string;
};

import type { ZenCalendarData } from "@/lib/zen-calendar/types";

export type DashboardContent = {
  spotlight: SpotlightItem[];
  topPick: TopPickItem | null;
  madeForYou: MadeForYouItem[];
  zenCalendar: ZenCalendarData;
  courseId: string | null;
};
