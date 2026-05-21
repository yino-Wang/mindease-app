import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, UnauthorizedError } from "@/lib/auth/session";
import { ensureUser } from "@/lib/auth/ensure-user";
import { completeCourseDay } from "@/lib/courses/queries";
import { completeCourseDaySchema } from "@/lib/validation/courses";

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser();
    await ensureUser({ id: authUser.id, email: authUser.email });

    const body = await request.json();
    const parsed = completeCourseDaySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { courseId, stepId, duration } = parsed.data;
    const result = await completeCourseDay(
      authUser.id,
      courseId,
      stepId,
      duration
    );

    if ("error" in result) {
      if (result.error === "not_found") {
        return NextResponse.json({ error: "Step not found" }, { status: 404 });
      }
      if (result.error === "locked") {
        return NextResponse.json(
          { error: "This day is still locked. Complete the previous day first." },
          { status: 403 }
        );
      }
    }

    return NextResponse.json({
      logId: result.logId,
      progress: result.progress,
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("[courses/progress]", error);
    return NextResponse.json(
      { error: "Failed to update course progress" },
      { status: 500 }
    );
  }
}
