import Link from "next/link";
import { redirect } from "next/navigation";
import { CourseDayCard } from "@/components/courses/CourseDayCard";
import { CourseProgressBar } from "@/components/courses/CourseProgressBar";
import { DailyZenCard } from "@/components/courses/DailyZenCard";
import { ensureUser } from "@/lib/auth/ensure-user";
import { getCourseCatalog } from "@/lib/courses/queries";
import { getTodayDailyZen } from "@/lib/daily-zen/resolve";
import { createClient } from "@/lib/supabase/server";

export default async function CoursesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect("/login?next=/courses");
  }

  await ensureUser({ id: user.id, email: user.email });

  const [catalog, daily] = await Promise.all([
    getCourseCatalog(user.id),
    getTodayDailyZen(),
  ]);

  if (!catalog) {
    return (
      <div className="flex min-h-full flex-1 flex-col bg-background px-6 py-12">
        <CoursesHeader />
        <main className="mx-auto mt-16 w-full max-w-md text-center">
          <p className="font-serif text-xl text-stone-300">
            Course content is not available yet.
          </p>
          <p className="mt-4 text-sm tracking-wide text-stone-500">
            Run{" "}
            <code className="rounded bg-stone-900 px-2 py-0.5 text-amber-400/80">
              npm run db:seed
            </code>{" "}
            to hydrate the database.
          </p>
        </main>
      </div>
    );
  }

  const { course, progress, days } = catalog;

  return (
    <div className="flex min-h-full flex-1 flex-col bg-background">
      <CoursesHeader />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-8 px-6 pb-16 pt-24">
        {daily && <DailyZenCard daily={daily} />}

        <section className="flex flex-col gap-4">
          <div>
            <h1 className="font-serif text-2xl tracking-wide text-stone-200">
              {course.title}
            </h1>
            <p className="mt-2 text-sm leading-relaxed tracking-wide text-stone-500">
              {course.description}
            </p>
          </div>

          <CourseProgressBar
            totalDays={days.length}
            completedCount={progress.completedCount}
          />
        </section>

        <section
          className="flex flex-col gap-3"
          aria-label="Course days"
        >
          {days.map((day) => (
            <CourseDayCard key={day.stepId} courseId={course.id} day={day} />
          ))}
        </section>
      </main>
    </div>
  );
}

function CoursesHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between border-b border-stone-800/40 bg-background/80 px-6 py-5 backdrop-blur-sm">
      <Link
        href="/"
        className="font-serif text-sm tracking-widest text-stone-500 uppercase transition-all duration-700 ease-in-out hover:text-stone-300"
      >
        MindEase
      </Link>
      <form action="/auth/signout" method="post">
        <button
          type="submit"
          className="text-xs tracking-widest text-stone-500 uppercase transition-all duration-700 ease-in-out hover:text-stone-300"
        >
          Sign out
        </button>
      </form>
    </header>
  );
}
