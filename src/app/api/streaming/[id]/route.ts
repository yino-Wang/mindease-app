import { NextResponse } from "next/server";
import { getAuthUser, UnauthorizedError } from "@/lib/auth/session";
import { ensureUser } from "@/lib/auth/ensure-user";
import {
  formatPlayCount,
  getStreamingItemById,
} from "@/lib/streaming/queries";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const authUser = await getAuthUser();
    await ensureUser({ id: authUser.id, email: authUser.email });

    const { id } = await context.params;
    const item = await getStreamingItemById(id);

    if (!item) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      item: {
        ...item,
        playCountLabel: formatPlayCount(item.playCount),
        durationMinutes: Math.max(1, Math.round(item.duration / 60)),
      },
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("[streaming/id]", error);
    return NextResponse.json(
      { error: "Failed to load streaming item" },
      { status: 500 }
    );
  }
}
