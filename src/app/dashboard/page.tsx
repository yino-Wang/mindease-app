import { DashboardPageBody } from "@/components/dashboard/DashboardPageBody";
import { DashboardHeader } from "@/components/dashboard/Header";
import { DashboardViewport } from "@/components/dashboard/DashboardViewport";
import { requireAuth } from "@/lib/auth/require-auth";
import { getDashboardContent } from "@/lib/dashboard/queries";

export default async function DashboardPage() {
  const user = await requireAuth("/dashboard");
  const content = await getDashboardContent(user.id);

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
      <DashboardPageBody content={content} />
    </DashboardViewport>
  );
}
