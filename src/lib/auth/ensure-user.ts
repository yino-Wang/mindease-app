import { prisma } from "@/lib/prisma";

export async function ensureUser(authUser: {
  id: string;
  email?: string | null;
  authMethod?: "password" | "magic_link";
}) {
  const email = authUser.email;
  if (!email) {
    throw new Error("Authenticated user is missing an email address.");
  }

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
}
