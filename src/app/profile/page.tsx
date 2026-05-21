import Link from "next/link";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/Header";
import { createClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/profile");
  }

  return (
    <>
      <DashboardHeader userEmail={user.email} />
      <main className="flex min-h-[60vh] w-full max-w-lg flex-col items-center justify-center gap-8 px-6 pt-36 pb-16 text-center lg:mx-auto lg:pt-32">
        <h1 className="font-serif text-3xl tracking-wide text-stone-200">
          Profile
        </h1>
        <p className="text-sm leading-relaxed tracking-wide text-stone-500">
          Your sanctuary profile is coming soon. For now, continue your practice
          from the dashboard.
        </p>
        {user.email && (
          <p className="text-xs tracking-widest text-stone-600">{user.email}</p>
        )}
        <Link
          href="/dashboard"
          className="sacred-glow rounded-full border border-amber-500/30 bg-amber-500/10 px-8 py-3 font-serif text-sm tracking-widest text-amber-400/90 transition-all duration-700 ease-in-out hover:border-amber-500/50 hover:bg-amber-500/20"
        >
          Back to Dashboard
        </Link>
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="text-xs tracking-widest text-stone-500 uppercase transition-all duration-700 hover:text-stone-300"
          >
            Sign out
          </button>
        </form>
      </main>
    </>
  );
}
