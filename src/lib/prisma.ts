import { PrismaClient } from "@prisma/client";

/** Bump when Prisma schema changes so dev hot-reload picks up a fresh client. */
const PRISMA_CACHE_VERSION = 4;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaCacheVersion?: number;
};

function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

function meditationAudioHasLibraryFields(client: PrismaClient): boolean {
  const models = (
    client as unknown as {
      _runtimeDataModel?: { models?: Record<string, { fields?: Record<string, unknown> }> };
    }
  )._runtimeDataModel?.models;
  const fields = models?.MeditationAudio?.fields;
  return Boolean(fields && "published" in fields && "sortOrder" in fields);
}

/** Recreate client in dev when schema adds models/fields (avoids stale global cache). */
function getPrisma(): PrismaClient {
  const cached = globalForPrisma.prisma;
  const versionOk = globalForPrisma.prismaCacheVersion === PRISMA_CACHE_VERSION;

  if (
    cached &&
    versionOk &&
    "streamingItem" in cached &&
    "videoComment" in cached &&
    "zenCalendarNote" in cached &&
    meditationAudioHasLibraryFields(cached)
  ) {
    return cached;
  }

  if (cached) {
    void cached.$disconnect();
  }

  const client = createPrismaClient();
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
    globalForPrisma.prismaCacheVersion = PRISMA_CACHE_VERSION;
  }
  return client;
}

export const prisma: PrismaClient = getPrisma();
