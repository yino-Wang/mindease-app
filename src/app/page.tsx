import { redirect } from "next/navigation";
import { WelcomeSanctuary } from "@/components/welcome/WelcomeSanctuary";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return <WelcomeSanctuary />;
}
