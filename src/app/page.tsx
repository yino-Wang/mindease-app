import type { Metadata } from "next";
import { AboutPageContent } from "@/components/about/AboutPageContent";
import { DashboardHeader } from "@/components/dashboard/Header";
import { DashboardViewport } from "@/components/dashboard/DashboardViewport";
import { ABOUT_HERO } from "@/lib/about/content";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Welcome | MindEase",
  description: ABOUT_HERO.headline,
};

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <DashboardViewport header={<DashboardHeader userEmail={user?.email} />}>
      <AboutPageContent showSignInCta={!user} />
    </DashboardViewport>
  );
}
