import { prisma } from "@/lib/prisma";

let cachedFallbackGuideUrl: string | null | undefined;

async function getFallbackGuideUrl(): Promise<string | null> {
  if (cachedFallbackGuideUrl !== undefined) {
    return cachedFallbackGuideUrl;
  }

  const track = await prisma.meditationAudio.findFirst({
    where: { category: { in: ["nature", "zen"] } },
    orderBy: { name: "asc" },
  });

  cachedFallbackGuideUrl = track?.url ?? null;
  return cachedFallbackGuideUrl;
}

/** Returns url if reachable, otherwise first seeded ambient track (MVP fallback). */
export async function resolvePlayableGuideUrl(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      method: "HEAD",
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) return url;
  } catch {
    // Storage object missing or unreachable — use ambient fallback
  }

  const fallback = await getFallbackGuideUrl();
  if (fallback) return fallback;

  return url;
}

/** Returns url if reachable, otherwise null (skip broken video backgrounds). */
export async function resolvePlayableVideoUrl(
  url: string | null | undefined
): Promise<string | null> {
  if (!url) return null;

  try {
    const res = await fetch(url, {
      method: "HEAD",
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) return url;
  } catch {
    // ignore
  }

  return null;
}
