import { prisma } from "@/lib/prisma";

export async function ensureUser(authUser: {
  id: string;
  email?: string | null;
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
    },
    update: {
      email,
    },
  });
}
