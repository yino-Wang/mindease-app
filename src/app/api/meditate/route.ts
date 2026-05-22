import { NextResponse } from "next/server";
import { z } from "zod";
import { LIBRARY_CATEGORIES } from "@/lib/meditate/categories";
import { getLibraryItemsByCategory } from "@/lib/meditate/queries";

const querySchema = z.object({
  category: z.enum(LIBRARY_CATEGORIES),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse({
    category: searchParams.get("category")?.toUpperCase(),
  });

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid category",
        valid: [...LIBRARY_CATEGORIES],
      },
      { status: 400 }
    );
  }

  try {
    const items = await getLibraryItemsByCategory(parsed.data.category);
    return NextResponse.json({ items });
  } catch (error) {
    console.error("[api/meditate]", error);
    return NextResponse.json(
      { error: "Failed to load library" },
      { status: 500 }
    );
  }
}
