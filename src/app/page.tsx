import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-background px-6">
      <main className="flex max-w-md flex-col items-center gap-10 text-center">
        <h1 className="font-serif text-4xl font-medium tracking-wide text-stone-200">
          MindEase
        </h1>
        <p className="text-base leading-relaxed tracking-wide text-stone-400">
          A minimalist sanctuary for breath, stillness, and calm.
        </p>
        {user ? (
          <Link
            href="/timer"
            className="sacred-glow rounded-full border border-amber-500/30 bg-amber-500/10 px-8 py-3 font-serif text-lg tracking-widest text-amber-400/90 transition-all duration-700 ease-in-out hover:border-amber-500/50 hover:bg-amber-500/20 hover:text-amber-300"
          >
            Enter Zen Timer
          </Link>
        ) : (
          <Link
            href="/login"
            className="sacred-glow rounded-full border border-amber-500/30 bg-amber-500/10 px-8 py-3 font-serif text-lg tracking-widest text-amber-400/90 transition-all duration-700 ease-in-out hover:border-amber-500/50 hover:bg-amber-500/20 hover:text-amber-300"
          >
            Sign in to begin
          </Link>
        )}
      </main>
    </div>
  );
}
