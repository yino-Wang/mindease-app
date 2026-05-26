import { prisma } from "@/lib/prisma";

export type ProfileRecord = {
  id: string;
  email: string;
  username: string | null;
  avatarUrl: string | null;
  authMethod: string | null;
};

export function displayName(
  username: string | null | undefined,
  email: string
): string {
  if (username?.trim()) return username.trim();
  const local = email.split("@")[0];
  return local || "Member";
}

export function getInitials(
  username: string | null | undefined,
  email: string
): string {
  const name = displayName(username, email);
  const parts = name.split(/[\s._-]+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

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
