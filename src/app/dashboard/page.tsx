import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/Header";
import { DashboardViewport } from "@/components/dashboard/DashboardViewport";
import { SacredQuoteBanner } from "@/components/dashboard/SacredQuoteBanner";
import { MadeForYouSection } from "@/components/dashboard/sections/MadeForYouSection";
import { TopTierSplitSection } from "@/components/dashboard/sections/TopTierSplitSection";
import { VideoSpotlightSection } from "@/components/dashboard/sections/VideoSpotlightSection";
import { ensureUser } from "@/lib/auth/ensure-user";
import { getDashboardContent } from "@/lib/dashboard/queries";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect("/login?next=/dashboard");
  }

  await ensureUser({ id: user.id, email: user.email });

  const content = await getDashboardContent(user.id);

  return (
    <DashboardViewport header={<DashboardHeader userEmail={user.email} />}>
      <TopTierSplitSection
        topPick={content.topPick}
        zenCalendar={content.zenCalendar}
      />
      <VideoSpotlightSection
        items={content.spotlight}
        seeAllHref="/courses"
      />
      <MadeForYouSection items={content.madeForYou} seeAllHref="/courses" />
      <SacredQuoteBanner />
    </DashboardViewport>
  );
}
