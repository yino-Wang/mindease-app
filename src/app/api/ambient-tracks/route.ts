import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    const tracks = await prisma.meditationAudio.findMany({
      where: {
        category: { in: ["nature", "zen"] },
      },
      select: {
        id: true,
        name: true,
        url: true,
        category: true,
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ tracks });
  } catch (error) {
    console.error("[ambient-tracks]", error);
    return NextResponse.json(
      { error: "Failed to fetch ambient tracks" },
      { status: 500 }
    );
  }
}
