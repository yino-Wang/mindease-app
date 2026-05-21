export type DayCardStatus = "locked" | "unlocked" | "completed";

export type DayCardState = {
  stepId: string;
  daySequence: number;
  title: string;
  status: DayCardStatus;
  audioId: string;
  guideUrl: string;
  bgVideoUrl: string | null;
  duration: number | null;
};

export type CourseWithSteps = {
  id: string;
  title: string;
  description: string;
  steps: {
    id: string;
    daySequence: number;
    title: string;
    audioId: string;
    audio: {
      id: string;
      url: string;
      bgVideoUrl: string | null;
      duration: number | null;
    };
  }[];
};

export type UserProgressDto = {
  currentSequence: number;
  completedCount: number;
};

export type CourseCatalogDto = {
  course: CourseWithSteps;
  progress: UserProgressDto;
  days: DayCardState[];
};
