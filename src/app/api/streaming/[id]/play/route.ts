import { NextResponse } from "next/server";
import { getAuthUser, UnauthorizedError } from "@/lib/auth/session";
import { ensureUser } from "@/lib/auth/ensure-user";
import { incrementStreamingPlayCount } from "@/lib/streaming/queries";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: RouteContext) {
  try {
    const authUser = await getAuthUser();
    await ensureUser({ id: authUser.id, email: authUser.email });

    const { id } = await context.params;
    await incrementStreamingPlayCount(id);

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("[streaming/play]", error);
    return NextResponse.json(
      { error: "Failed to record play" },
      { status: 500 }
    );
  }
}
