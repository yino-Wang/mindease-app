import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const databaseUrl = process.env.DATABASE_URL;
  const directUrl = process.env.DIRECT_URL;

  return NextResponse.json({
    ok: true,
    nodeEnv: process.env.NODE_ENV ?? null,
    hasDatabaseUrl: Boolean(databaseUrl),
    hasDirectUrl: Boolean(directUrl),
    // Helps detect accidental quotes/whitespace without leaking secrets
    databaseUrlLength: databaseUrl?.length ?? 0,
    directUrlLength: directUrl?.length ?? 0,
    databaseUrlStartsWith: databaseUrl ? databaseUrl.slice(0, 14) : null, // "postgresql://"
    directUrlStartsWith: directUrl ? directUrl.slice(0, 14) : null,
  });
}

