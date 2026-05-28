import { DailyPickArticlePage } from "@/components/daily-pick/DailyPickArticlePage";
import { DashboardHeader } from "@/components/dashboard/Header";
import { DashboardViewport } from "@/components/dashboard/DashboardViewport";
import { requireAuth } from "@/lib/auth/require-auth";
import { getDailyPickArticleWithContent } from "@/lib/daily-pick/resolve";

export default async function DailyPickPage() {
  const user = await requireAuth("/daily-pick");
  const article = await getDailyPickArticleWithContent();

  return (
    <DashboardViewport
      header={
        <DashboardHeader
          userEmail={user.email}
          username={user.username}
          avatarUrl={user.avatarUrl}
          displayName={user.displayName}
        />
      }
    >
      <DailyPickArticlePage article={article} />
    </DashboardViewport>
  );
}
