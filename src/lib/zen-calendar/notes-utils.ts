export const MAX_CALENDAR_NOTE_LENGTH = 200;

export function normalizeCalendarNote(body: string): string {
  return body.trim().slice(0, MAX_CALENDAR_NOTE_LENGTH);
}

export function validateCalendarNote(body: string): string | null {
  if (normalizeCalendarNote(body).length > MAX_CALENDAR_NOTE_LENGTH) {
    return `Note must be ${MAX_CALENDAR_NOTE_LENGTH} characters or fewer.`;
  }
  return null;
}

const DATE_KEY_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isValidDateKey(date: string): boolean {
  if (!DATE_KEY_RE.test(date)) return false;
  const [y, m, d] = date.split("-").map(Number);
  const parsed = new Date(Date.UTC(y, m - 1, d));
  return (
    parsed.getUTCFullYear() === y &&
    parsed.getUTCMonth() + 1 === m &&
    parsed.getUTCDate() === d
  );
}

