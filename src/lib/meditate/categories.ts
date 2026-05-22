export const LIBRARY_CATEGORIES = ["MIXER", "MORNINGS", "SLEEP"] as const;

export type LibraryCategory = (typeof LIBRARY_CATEGORIES)[number];

export function isLibraryCategory(value: string): value is LibraryCategory {
  return (LIBRARY_CATEGORIES as readonly string[]).includes(value);
}
