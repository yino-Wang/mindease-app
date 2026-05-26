import { SacredQuoteBanner } from "@/components/dashboard/SacredQuoteBanner";
import { MadeForYouSection } from "@/components/dashboard/sections/MadeForYouSection";
import { TopTierSplitSection } from "@/components/dashboard/sections/TopTierSplitSection";
import { VideoSpotlightSection } from "@/components/dashboard/sections/VideoSpotlightSection";
import type { DashboardContent } from "@/lib/dashboard/types";

type DashboardPageBodyProps = {
  content: DashboardContent;
};

export function DashboardPageBody({ content }: DashboardPageBodyProps) {
  return (
    <>
      <TopTierSplitSection
        topPick={content.topPick}
        zenCalendar={content.zenCalendar}
      />
      <VideoSpotlightSection
        items={content.spotlight}
        seeAllHref="/courses"
      />
      <MadeForYouSection items={content.madeForYou} seeAllHref="/courses" />
      <SacredQuoteBanner quote={content.dailyQuote} />
    </>
  );
}
