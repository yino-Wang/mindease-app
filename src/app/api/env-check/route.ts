import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const databaseUrl = process.env.DATABASE_URL;
  const directUrl = process.env.DIRECT_URL;

  const res = NextResponse.json({
    ok: true,
    nodeEnv: process.env.NODE_ENV ?? null,
    vercelEnv: process.env.VERCEL_ENV ?? null,
    vercelGitCommitSha: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
    hasDatabaseUrl: Boolean(databaseUrl),
    hasDirectUrl: Boolean(directUrl),
    // Helps detect accidental quotes/whitespace without leaking secrets
    databaseUrlLength: databaseUrl?.length ?? 0,
    directUrlLength: directUrl?.length ?? 0,
    databaseUrlStartsWith: databaseUrl ? databaseUrl.slice(0, 14) : null, // "postgresql://"
    directUrlStartsWith: directUrl ? directUrl.slice(0, 14) : null,
  });
  res.headers.set("Cache-Control", "no-store, max-age=0");
  return res;
}

