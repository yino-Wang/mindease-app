import { NextRequest, NextResponse } from "next/server";
import { UnauthorizedError, getSessionUserId } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { createZenJournalSchema } from "@/lib/validation/meditate";

export async function POST(request: NextRequest) {
  try {
    const userId = getSessionUserId(request);
    const body = await request.json();
    const parsed = createZenJournalSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { logId, content } = parsed.data;

    const log = await prisma.userMeditationLog.findUnique({
      where: { id: logId },
      include: { journal: true },
    });

    if (!log || log.userId !== userId) {
      return NextResponse.json(
        { error: "Meditation log not found" },
        { status: 404 }
      );
    }

    if (log.journal) {
      return NextResponse.json(
        { error: "Journal entry already exists for this session" },
        { status: 409 }
      );
    }

    const journal = await prisma.userJournal.create({
      data: { logId, content },
      select: { id: true, createdAt: true },
    });

    return NextResponse.json({
      journalId: journal.id,
      createdAt: journal.createdAt,
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("[meditate/journal]", error);
    return NextResponse.json(
      { error: "Failed to save journal entry" },
      { status: 500 }
    );
  }
}
