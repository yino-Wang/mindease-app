import { NextResponse } from "next/server";
import { getAuthUser, UnauthorizedError } from "@/lib/auth/session";
import { ensureUser } from "@/lib/auth/ensure-user";
import { getCourseCatalog } from "@/lib/courses/queries";

export const runtime = "nodejs";

export async function GET() {
  try {
    const authUser = await getAuthUser();
    await ensureUser({ id: authUser.id, email: authUser.email });

    const catalog = await getCourseCatalog(authUser.id);

    if (!catalog) {
      return NextResponse.json(
        { error: "Course not found. Run db:seed first." },
        { status: 404 }
      );
    }

    return NextResponse.json(catalog);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("[courses]", error);
    return NextResponse.json(
      { error: "Failed to load courses" },
      { status: 500 }
    );
  }
}
