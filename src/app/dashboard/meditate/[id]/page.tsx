import { notFound, redirect } from "next/navigation";
import { StreamingDetailContent } from "@/components/streaming/StreamingDetailContent";
import { ensureUser } from "@/lib/auth/ensure-user";
import { getPlayableMediaById } from "@/lib/media/get-playable-item";
import { createClient } from "@/lib/supabase/server";

type PageProps = { params: Promise<{ id: string }> };

export default async function StreamingDetailPage({ params }: PageProps) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect(`/login?next=/dashboard/meditate/${id}`);
  }

  await ensureUser({ id: user.id, email: user.email });

  const item = await getPlayableMediaById(id);
  if (!item) {
    notFound();
  }

  const durationMinutes = Math.max(1, Math.round(item.duration / 60));

  return (
    <main className="min-h-screen w-full max-w-none">
      <StreamingDetailContent item={item} durationMinutes={durationMinutes} />
    </main>
  );
}
