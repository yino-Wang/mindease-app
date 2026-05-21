/** Daily total duration (seconds) → amber glow tier */
export const GLOW_THRESHOLDS = [
  { maxSeconds: 0, level: 0 as const },
  { maxSeconds: 299, level: 1 as const },
  { maxSeconds: 899, level: 2 as const },
  { maxSeconds: 1799, level: 3 as const },
  { maxSeconds: Infinity, level: 4 as const },
];

export const GLOW_CELL_CLASSES: Record<number, string> = {
  0: "",
  1: "bg-amber-500/20",
  2: "bg-amber-500/40",
  3: "bg-amber-500/75",
  4: "bg-amber-500",
};

export const MONTH_WEEKDAY_LABELS = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
] as const;

export const MONTH_CELL_BASE =
  "rounded-lg bg-stone-900/60 border border-stone-800/40";

export const MONTH_GRID_GAP = "gap-2 sm:gap-3";
