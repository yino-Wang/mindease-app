import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthUser, UnauthorizedError } from "@/lib/auth/session";
import { ensureUser } from "@/lib/auth/ensure-user";
import {
  isValidDateKey,
  upsertCalendarNote,
  validateCalendarNote,
} from "@/lib/zen-calendar/notes";

export const runtime = "nodejs";

const putSchema = z.object({
  date: z.string(),
  body: z.string().max(500),
});

export async function PUT(request: Request) {
  try {
    const authUser = await getAuthUser();
    await ensureUser({ id: authUser.id, email: authUser.email });

    const json = await request.json();
    const parsed = putSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { date, body } = parsed.data;
    if (!isValidDateKey(date)) {
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    }

    const validationError = validateCalendarNote(body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const note = await upsertCalendarNote(authUser.id, date, body);
    return NextResponse.json({ note });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("[api/zen-calendar/notes PUT]", error);
    return NextResponse.json(
      { error: "Failed to save note" },
      { status: 500 }
    );
  }
}
