import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export class EnsureUserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EnsureUserError";
  }
}

function toEnsureUserError(error: unknown): EnsureUserError {
  if (error instanceof EnsureUserError) return error;

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return new EnsureUserError(
      "Could not connect to the database. Check DATABASE_URL and DIRECT_URL in your deployment settings.",
    );
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return new EnsureUserError(
        "An account with this email already exists. Try signing in instead.",
      );
    }
    if (error.code === "P2021") {
      return new EnsureUserError(
        "Database tables are missing. Run `npm run db:push` against your production database.",
      );
    }
  }

  if (error instanceof Error) {
    return new EnsureUserError(error.message);
  }

  return new EnsureUserError("Could not create or update your user profile.");
}

export async function ensureUser(authUser: {
  id: string;
  email?: string | null;
  authMethod?: "password" | "magic_link";
}) {
  const email = authUser.email?.trim();
  if (!email) {
    throw new EnsureUserError(
      "Authenticated user is missing an email address.",
    );
  }

  try {
    await prisma.user.upsert({
      where: { id: authUser.id },
      create: {
        id: authUser.id,
        email,
        authMethod: authUser.authMethod ?? null,
      },
      update: {
        email,
        ...(authUser.authMethod ? { authMethod: authUser.authMethod } : {}),
      },
    });
  } catch (error) {
    throw toEnsureUserError(error);
  }
}
