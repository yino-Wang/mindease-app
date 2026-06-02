import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthUser, UnauthorizedError } from "@/lib/auth/session";
import { ensureUser } from "@/lib/auth/ensure-user";
import {
  getWatchHistoryForUser,
  recordWatchHistory,
} from "@/lib/watch-history/queries";

export const runtime = "nodejs";

const postSchema = z.object({
  contentType: z.enum(["STREAMING", "LIBRARY"]),
  contentId: z.string().uuid(),
});

export async function GET() {
  try {
    const authUser = await getAuthUser();
    await ensureUser({ id: authUser.id, email: authUser.email });

    const items = await getWatchHistoryForUser(authUser.id);
    return NextResponse.json({ items });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("[api/watch-history GET]", error);
    return NextResponse.json(
      { error: "Failed to load watch history" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const authUser = await getAuthUser();
    await ensureUser({ id: authUser.id, email: authUser.email });

    const body = await request.json();
    const parsed = postSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    await recordWatchHistory(
      authUser.id,
      parsed.data.contentType,
      parsed.data.contentId
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("[api/watch-history POST]", error);
    return NextResponse.json(
      { error: "Failed to record watch history" },
      { status: 500 }
    );
  }
}
