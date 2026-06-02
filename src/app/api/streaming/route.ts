import { NextResponse } from "next/server";
import { getAuthUser, UnauthorizedError } from "@/lib/auth/session";
import { ensureUser } from "@/lib/auth/ensure-user";
import { getStreamingItemsBySection } from "@/lib/streaming/queries";
import type { StreamingSectionType } from "@/lib/streaming/types";

export const runtime = "nodejs";

const VALID_SECTIONS = new Set<StreamingSectionType>([
  "SPOTLIGHT",
  "MADE_FOR_YOU",
]);

export async function GET(request: Request) {
  try {
    const authUser = await getAuthUser();
    await ensureUser({ id: authUser.id, email: authUser.email });

    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section") as StreamingSectionType | null;

    if (!section || !VALID_SECTIONS.has(section)) {
      return NextResponse.json(
        { error: "Query param section must be SPOTLIGHT or MADE_FOR_YOU" },
        { status: 400 }
      );
    }

    const items = await getStreamingItemsBySection(section);
    return NextResponse.json({ items });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("[streaming]", error);
    return NextResponse.json(
      { error: "Failed to load streaming catalog" },
      { status: 500 }
    );
  }
}
