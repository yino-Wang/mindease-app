import { Suspense } from "react";
import { ProfilePageContent } from "@/components/profile/ProfilePageContent";
import { DashboardHeader } from "@/components/dashboard/Header";
import { DashboardViewport } from "@/components/dashboard/DashboardViewport";
import { requireAuth } from "@/lib/auth/require-auth";
import { getProfile } from "@/lib/profile/queries";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await requireAuth("/profile");
  const profile = await getProfile(session.id);

  if (!profile) {
    redirect("/login?next=/profile");
  }

  return (
    <DashboardViewport
      header={
        <DashboardHeader
          userEmail={session.email}
          username={session.username}
          avatarUrl={session.avatarUrl}
          displayName={session.displayName}
        />
      }
    >
      <Suspense
        fallback={
          <div className="mx-auto w-full max-w-6xl py-12 text-center text-sm text-stone-600">
            Loading profile…
          </div>
        }
      >
        <ProfilePageContent profile={profile} />
      </Suspense>
    </DashboardViewport>
  );
}
