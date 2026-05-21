import Link from "next/link";
import { redirect } from "next/navigation";
import { CourseSession } from "@/components/courses/CourseSession";
import { ensureUser } from "@/lib/auth/ensure-user";
import { getCourseStepForUser } from "@/lib/courses/queries";
import { createClient } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{ courseId: string; daySequence: string }>;
};

export default async function CourseDayPage({ params }: PageProps) {
  const { courseId, daySequence: daySequenceParam } = await params;
  const daySequence = parseInt(daySequenceParam, 10);

  if (!Number.isFinite(daySequence) || daySequence < 1) {
    redirect("/courses");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect(`/login?next=/courses/${courseId}/day/${daySequence}`);
  }

  await ensureUser({ id: user.id, email: user.email });

  const session = await getCourseStepForUser(
    user.id,
    courseId,
    daySequence
  );

  if (!session) {
    redirect("/courses");
  }

  if (!session.isAccessible) {
    return (
      <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-background px-6">
        <div className="max-w-md text-center">
          <p className="font-serif text-xl text-stone-300">
            This day is still locked
          </p>
          <p className="mt-4 text-sm tracking-wide text-stone-500">
            Complete the previous day to unlock Day {daySequence}.
          </p>
          <Link
            href="/courses"
            className="mt-8 inline-block text-sm tracking-widest text-amber-500/80 uppercase transition-all duration-700 ease-in-out hover:text-amber-400"
          >
            Return to courses
          </Link>
        </div>
      </div>
    );
  }

  const { step } = session;

  return (
    <CourseSession
      courseId={courseId}
      stepId={step.id}
      daySequence={step.daySequence}
      title={step.title}
      guideUrl={step.audio.url}
      bgVideoUrl={step.audio.bgVideoUrl}
      duration={step.audio.duration}
    />
  );
}
