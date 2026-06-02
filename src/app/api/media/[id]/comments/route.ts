import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthUser, UnauthorizedError } from "@/lib/auth/session";
import { ensureUser } from "@/lib/auth/ensure-user";
import {
  createVideoComment,
  getVideoComments,
  validateCommentBody,
} from "@/lib/comments/queries";
import { resolveCommentTarget } from "@/lib/comments/resolve-content";

type RouteContext = { params: Promise<{ id: string }> };

const postSchema = z.object({
  body: z.string().min(1).max(500),
});

export async function GET(_request: Request, context: RouteContext) {
  try {
    const authUser = await getAuthUser();
    await ensureUser({ id: authUser.id, email: authUser.email });

    const { id } = await context.params;
    const target = await resolveCommentTarget(id);
    if (!target) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    const comments = await getVideoComments(
      target.contentType,
      target.contentId
    );
    return NextResponse.json({ comments });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("[api/media/comments GET]", error);
    return NextResponse.json(
      { error: "Failed to load comments" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const authUser = await getAuthUser();
    await ensureUser({ id: authUser.id, email: authUser.email });

    const { id } = await context.params;
    const target = await resolveCommentTarget(id);
    if (!target) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    const json = await request.json();
    const parsed = postSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid comment", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const validationError = validateCommentBody(parsed.data.body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const comment = await createVideoComment(
      authUser.id,
      target.contentType,
      target.contentId,
      parsed.data.body
    );

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("[api/media/comments POST]", error);
    return NextResponse.json(
      { error: "Failed to post comment" },
      { status: 500 }
    );
  }
}
