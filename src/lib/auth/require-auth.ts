import { redirect } from "next/navigation";
import { ensureUser } from "@/lib/auth/ensure-user";
import { displayName } from "@/lib/profile/utils";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export type AuthSessionUser = {
  id: string;
  email: string;
  username: string | null;
  avatarUrl: string | null;
  authMethod: string | null;
  displayName: string;
};

export async function requireAuth(nextPath: string): Promise<AuthSessionUser> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }

  await ensureUser({ id: user.id, email: user.email });

  const profile = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      email: true,
      username: true,
      avatarUrl: true,
      authMethod: true,
    },
  });

  if (!profile) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }

  return {
    ...profile,
    displayName: displayName(profile.username, profile.email),
  };
}
