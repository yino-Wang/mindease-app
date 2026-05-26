import { CategoryPageShell } from "@/components/dashboard/CategoryPageShell";
import { requireAuth } from "@/lib/auth/require-auth";

export default async function SleepPage() {
  const user = await requireAuth("/sleep");

  return <CategoryPageShell category="SLEEP" user={user} />;
}
