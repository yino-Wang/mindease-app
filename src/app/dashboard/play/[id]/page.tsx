import { notFound, redirect } from "next/navigation";
import { CinemaPlayer } from "@/components/streaming/CinemaPlayer";
import { ensureUser } from "@/lib/auth/ensure-user";
import { getPlayableMediaById } from "@/lib/media/get-playable-item";
import { createClient } from "@/lib/supabase/server";

type PageProps = { params: Promise<{ id: string }> };

export default async function StreamingPlayPage({ params }: PageProps) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect(`/login?next=/dashboard/play/${id}`);
  }

  await ensureUser({ id: user.id, email: user.email });

  const item = await getPlayableMediaById(id);
  if (!item) {
    notFound();
  }

  return (
    <main className="h-full w-full">
      <CinemaPlayer
        id={item.id}
        title={item.title}
        mediaUrl={item.videoUrl}
        coverUrl={item.coverUrl}
        sectionType={item.sectionType}
      />
    </main>
  );
}
