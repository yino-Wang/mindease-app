export type GlowLevel = 0 | 1 | 2 | 3 | 4;

export type ZenCalendarCell = {
  date: string;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  totalSeconds: number;
  level: GlowLevel;
};

export type ZenCalendarData = {
  cells: ZenCalendarCell[];
  rowCount: 5 | 6;
  monthLabel: string;
  year: number;
  month: number;
  totalSessions: number;
};
