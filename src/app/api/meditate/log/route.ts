import { NextRequest, NextResponse } from "next/server";
import { UnauthorizedError, getSessionUserId } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { createMeditationLogSchema } from "@/lib/validation/meditate";

export async function POST(request: NextRequest) {
  try {
    const userId = getSessionUserId(request);
    const body = await request.json();
    const parsed = createMeditationLogSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { audioId, duration, logType } = parsed.data;

    if (audioId) {
      const audio = await prisma.meditationAudio.findUnique({
        where: { id: audioId },
      });
      if (!audio) {
        return NextResponse.json(
          { error: "Audio track not found" },
          { status: 404 }
        );
      }
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json(
        { error: "User not found. Ensure DEV_USER_ID exists in users table." },
        { status: 404 }
      );
    }

    const log = await prisma.userMeditationLog.create({
      data: {
        userId,
        audioId: audioId ?? null,
        duration,
        logType,
      },
      select: {
        id: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      logId: log.id,
      createdAt: log.createdAt,
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("[meditate/log]", error);
    return NextResponse.json(
      { error: "Failed to create meditation log" },
      { status: 500 }
    );
  }
}
