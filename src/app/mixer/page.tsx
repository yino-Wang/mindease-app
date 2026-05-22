import { CategoryPageShell } from "@/components/dashboard/CategoryPageShell";
import { requireAuth } from "@/lib/auth/require-auth";

export default async function MixerPage() {
  const user = await requireAuth("/mixer");

  return <CategoryPageShell category="MIXER" userEmail={user.email} />;
}
