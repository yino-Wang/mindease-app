import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

type LoginPageProps = {
  searchParams: Promise<{ next?: string; error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const next = params.next;

  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-background px-6 py-16">
      <main className="flex w-full max-w-md flex-col items-center gap-10">
        <div className="text-center">
          <Link
            href="/"
            className="font-serif text-sm tracking-widest text-stone-500 uppercase transition-colors duration-700 hover:text-stone-300"
          >
            MindEase
          </Link>
          <h1 className="mt-6 font-serif text-3xl font-medium tracking-wide text-stone-200">
            Welcome back
          </h1>
          <p className="mt-3 text-sm leading-relaxed tracking-wide text-stone-500">
            Enter your sanctuary. Breathe. Begin.
          </p>
        </div>

        {params.error === "auth_callback_failed" && (
          <p className="text-sm text-amber-600/90" role="alert">
            Sign-in could not be completed. Please try again.
          </p>
        )}

        {params.error === "profile_setup_failed" && (
          <p className="text-sm text-amber-600/90" role="alert">
            Your account was created, but we could not set up your profile.
            This is usually a database connection or schema issue. Check{" "}
            <code className="text-stone-400">DATABASE_URL</code> on Vercel and
            run <code className="text-stone-400">npm run db:push</code> on your
            Supabase database.
          </p>
        )}

        <LoginForm next={next} />
      </main>
    </div>
  );
}
