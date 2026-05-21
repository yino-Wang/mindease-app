import { prisma } from "@/lib/prisma";
import {
  resolvePlayableGuideUrl,
  resolvePlayableVideoUrl,
} from "@/lib/media/resolve-playable-url";
import type {
  CourseCatalogDto,
  CourseWithSteps,
  DayCardState,
  DayCardStatus,
  UserProgressDto,
} from "@/lib/courses/types";

export const FOUNDATION_COURSE_TITLE =
  "3-Day Mindfulness Foundation Course";

const LEGACY_COURSE_TITLE = "3-Day Mindfulness Foundation";

export async function getFoundationCourse(): Promise<CourseWithSteps | null> {
  const course = await prisma.course.findFirst({
    where: {
      OR: [
        { title: FOUNDATION_COURSE_TITLE },
        { title: LEGACY_COURSE_TITLE },
      ],
    },
    include: {
      steps: {
        orderBy: { daySequence: "asc" },
        include: {
          audio: {
            select: {
              id: true,
              url: true,
              bgVideoUrl: true,
              duration: true,
            },
          },
        },
      },
    },
  });

  if (!course) return null;

  return {
    id: course.id,
    title: course.title,
    description: course.description,
    steps: course.steps.map((step) => ({
      id: step.id,
      daySequence: step.daySequence,
      title: step.title,
      audioId: step.audioId,
      audio: step.audio,
    })),
  };
}

export async function getOrInitProgress(
  userId: string,
  courseId: string
): Promise<UserProgressDto> {
  const progress = await prisma.userCourseProgress.upsert({
    where: {
      userId_courseId: { userId, courseId },
    },
    create: {
      userId,
      courseId,
      currentSequence: 1,
    },
    update: {},
    select: { currentSequence: true },
  });

  return {
    currentSequence: progress.currentSequence,
    completedCount: Math.max(0, progress.currentSequence - 1),
  };
}

export async function getCompletedAudioIds(
  userId: string,
  audioIds: string[]
): Promise<Set<string>> {
  if (audioIds.length === 0) return new Set();

  const logs = await prisma.userMeditationLog.findMany({
    where: {
      userId,
      logType: "COURSE",
      audioId: { in: audioIds },
    },
    select: { audioId: true },
  });

  return new Set(
    logs.map((l) => l.audioId).filter((id): id is string => id != null)
  );
}

export function getDayStatus(
  daySequence: number,
  currentSequence: number,
  hasCourseLog: boolean
): DayCardStatus {
  if (daySequence < currentSequence || hasCourseLog) {
    return "completed";
  }
  if (daySequence <= currentSequence) {
    return "unlocked";
  }
  return "locked";
}

export function getDayStates(
  steps: CourseWithSteps["steps"],
  currentSequence: number,
  completedAudioIds: Set<string>
): DayCardState[] {
  return steps.map((step) => {
    const hasCourseLog = completedAudioIds.has(step.audioId);
    const status = getDayStatus(
      step.daySequence,
      currentSequence,
      hasCourseLog
    );

    return {
      stepId: step.id,
      daySequence: step.daySequence,
      title: step.title,
      status,
      audioId: step.audioId,
      guideUrl: step.audio.url,
      bgVideoUrl: step.audio.bgVideoUrl,
      duration: step.audio.duration,
    };
  });
}

export async function getCourseCatalog(
  userId: string
): Promise<CourseCatalogDto | null> {
  const course = await getFoundationCourse();
  if (!course) return null;

  const progress = await getOrInitProgress(userId, course.id);
  const audioIds = course.steps.map((s) => s.audioId);
  const completedAudioIds = await getCompletedAudioIds(userId, audioIds);
  const days = getDayStates(
    course.steps,
    progress.currentSequence,
    completedAudioIds
  );

  const completedCount = days.filter((d) => d.status === "completed").length;

  const daysWithMedia = await Promise.all(
    days.map(async (day) => ({
      ...day,
      guideUrl: await resolvePlayableGuideUrl(day.guideUrl),
      bgVideoUrl: await resolvePlayableVideoUrl(day.bgVideoUrl),
    }))
  );

  return {
    course,
    progress: { ...progress, completedCount },
    days: daysWithMedia,
  };
}

export async function getCourseStepForUser(
  userId: string,
  courseId: string,
  daySequence: number
) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      steps: {
        where: { daySequence },
        include: {
          audio: true,
        },
      },
    },
  });

  if (!course || course.steps.length === 0) return null;

  const progress = await getOrInitProgress(userId, courseId);
  const step = course.steps[0];
  const completedAudioIds = await getCompletedAudioIds(userId, [
    step.audioId,
  ]);
  const status = getDayStatus(
    step.daySequence,
    progress.currentSequence,
    completedAudioIds.has(step.audioId)
  );

  const [guideUrl, bgVideoUrl] = await Promise.all([
    resolvePlayableGuideUrl(step.audio.url),
    resolvePlayableVideoUrl(step.audio.bgVideoUrl),
  ]);

  return {
    course: {
      id: course.id,
      title: course.title,
      description: course.description,
    },
    step: {
      id: step.id,
      daySequence: step.daySequence,
      title: step.title,
      audioId: step.audioId,
      audio: {
        ...step.audio,
        url: guideUrl,
        bgVideoUrl,
      },
    },
    progress,
    status,
    isAccessible: status !== "locked",
  };
}

export async function completeCourseDay(
  userId: string,
  courseId: string,
  stepId: string,
  duration: number
) {
  const step = await prisma.courseStep.findFirst({
    where: { id: stepId, courseId },
    include: { course: true },
  });

  if (!step) {
    return { error: "not_found" as const };
  }

  const progress = await getOrInitProgress(userId, courseId);

  if (step.daySequence > progress.currentSequence) {
    return { error: "locked" as const };
  }

  const existingLog = await prisma.userMeditationLog.findFirst({
    where: {
      userId,
      audioId: step.audioId,
      logType: "COURSE",
    },
  });

  let logId: string;

  if (!existingLog) {
    const log = await prisma.userMeditationLog.create({
      data: {
        userId,
        audioId: step.audioId,
        duration,
        logType: "COURSE",
      },
      select: { id: true },
    });
    logId = log.id;
  } else {
    logId = existingLog.id;
  }

  const newSequence = Math.max(progress.currentSequence, step.daySequence + 1);

  const updated = await prisma.userCourseProgress.update({
    where: {
      userId_courseId: { userId, courseId },
    },
    data: {
      currentSequence: newSequence,
    },
    select: { currentSequence: true },
  });

  return {
    logId,
    progress: {
      currentSequence: updated.currentSequence,
      completedCount: Math.max(0, updated.currentSequence - 1),
    },
  };
}
