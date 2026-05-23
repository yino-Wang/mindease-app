import type { Metadata } from "next";
import { AboutPageContent } from "@/components/about/AboutPageContent";
import { DashboardHeader } from "@/components/dashboard/Header";
import { DashboardViewport } from "@/components/dashboard/DashboardViewport";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Welcome | MindEase",
  description:
    "A digital sanctuary forged to slow down the cadence of modern noise.",
};

export default async function AboutPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <DashboardViewport header={<DashboardHeader userEmail={user?.email} />}>
      <AboutPageContent />
    </DashboardViewport>
  );
}
