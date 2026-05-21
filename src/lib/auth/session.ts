import { NextRequest } from "next/server";

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

/**
 * Resolves the authenticated user id for meditate APIs.
 * Phase B: dev header when ENABLE_DEV_AUTH=true.
 * Phase C: Supabase JWT verification (placeholder).
 */
export function getSessionUserId(request: NextRequest): string {
  const devAuthEnabled = process.env.ENABLE_DEV_AUTH === "true";

  if (devAuthEnabled) {
    const devUserId =
      request.headers.get("x-dev-user-id") ?? process.env.DEV_USER_ID;
    if (devUserId) return devUserId;
  }

  // TODO Phase C: verify Supabase session cookie / Bearer JWT
  throw new UnauthorizedError();
}
