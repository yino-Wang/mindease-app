import { CategoryPageShell } from "@/components/dashboard/CategoryPageShell";
import { requireAuth } from "@/lib/auth/require-auth";

export default async function MorningsPage() {
  const user = await requireAuth("/mornings");

  return <CategoryPageShell category="MORNINGS" user={user} />;
}
