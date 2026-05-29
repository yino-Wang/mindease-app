"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PersonalDetailsSection } from "@/components/profile/PersonalDetailsSection";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import {
  ProfileTabs,
  type ProfileTab,
} from "@/components/profile/ProfileTabs";
import { WatchHistorySection } from "@/components/profile/WatchHistorySection";
import type { ProfileRecord } from "@/lib/profile/queries";
import { displayName, getInitials } from "@/lib/profile/queries";

type ProfilePageContentProps = {
  profile: ProfileRecord;
  initialTab?: ProfileTab;
};

function parseTab(value: string | null): ProfileTab {
  return value === "details" ? "details" : "history";
}

export function ProfilePageContent({
  profile,
  initialTab = "history",
}: ProfilePageContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabFromUrl = parseTab(searchParams.get("tab"));
  const [activeTab, setActiveTab] = useState<ProfileTab>(
    tabFromUrl ?? initialTab
  );

  useEffect(() => {
    setActiveTab(tabFromUrl);
  }, [tabFromUrl]);

  const name = useMemo(
    () => displayName(profile.username, profile.email),
    [profile.username, profile.email]
  );
  const initials = useMemo(
    () => getInitials(profile.username, profile.email),
    [profile.username, profile.email]
  );

  const handleTabChange = useCallback(
    (tab: ProfileTab) => {
      setActiveTab(tab);
      const params = new URLSearchParams(searchParams.toString());
      if (tab === "history") {
        params.delete("tab");
      } else {
        params.set("tab", tab);
      }
      const query = params.toString();
      router.replace(query ? `/profile?${query}` : "/profile", { scroll: false });
    },
    [router, searchParams]
  );

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      <ProfileHeader
        displayName={name}
        avatarUrl={profile.avatarUrl}
        initials={initials}
      />

      <ProfileTabs activeTab={activeTab} onTabChange={handleTabChange} />

      <div
        id={`profile-panel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`profile-tab-${activeTab}`}
        className="pt-6"
      >
        {activeTab === "history" ? (
          <WatchHistorySection />
        ) : (
          <PersonalDetailsSection profile={profile} />
        )}
      </div>
    </div>
  );
}
