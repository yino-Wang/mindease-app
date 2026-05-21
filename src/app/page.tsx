import { HomeEntrance } from "@/components/home/HomeEntrance";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <HomeEntrance isAuthenticated={!!user} />;
}
