const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,24}$/;

export function validateUsername(value: string): string | null {
  const trimmed = value.trim();
  if (!USERNAME_PATTERN.test(trimmed)) {
    return "Username must be 3–24 characters (letters, numbers, underscore only).";
  }
  return null;
}

export function normalizeUsername(value: string): string {
  return value.trim();
}
