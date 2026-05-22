import { redirect } from "next/navigation";
import { ensureUser } from "@/lib/auth/ensure-user";
import { createClient } from "@/lib/supabase/server";

export async function requireAuth(nextPath: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }

  await ensureUser({ id: user.id, email: user.email });

  return { id: user.id, email: user.email };
}
