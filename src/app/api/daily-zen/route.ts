import { NextResponse } from "next/server";
import { getAuthUser, UnauthorizedError } from "@/lib/auth/session";
import { ensureUser } from "@/lib/auth/ensure-user";
import { getTodayDailyZen } from "@/lib/daily-zen/resolve";

export const runtime = "nodejs";

export async function GET() {
  try {
    const authUser = await getAuthUser();
    await ensureUser({ id: authUser.id, email: authUser.email });

    const today = await getTodayDailyZen();

    if (!today) {
      return NextResponse.json(
        { error: "Daily Zen not found. Run db:seed first." },
        { status: 404 }
      );
    }

    return NextResponse.json(today);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("[daily-zen]", error);
    return NextResponse.json(
      { error: "Failed to load daily zen" },
      { status: 500 }
    );
  }
}
