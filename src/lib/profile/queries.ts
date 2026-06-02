import "server-only";
import { prisma } from "@/lib/prisma";

export type ProfileRecord = {
  id: string;
  email: string;
  username: string | null;
  avatarUrl: string | null;
  authMethod: string | null;
};

export async function getProfile(userId: string): Promise<ProfileRecord | null> {
  const row = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      username: true,
      avatarUrl: true,
      authMethod: true,
    },
  });
  return row;
}
