/** Headers for meditate API calls during local dev (NEXT_PUBLIC_DEV_USER_ID). */
export function getMeditateHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const devUserId = process.env.NEXT_PUBLIC_DEV_USER_ID;
  if (devUserId) {
    headers["x-dev-user-id"] = devUserId;
  }

  return headers;
}
