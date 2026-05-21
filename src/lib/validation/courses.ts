import { z } from "zod";

export const completeCourseDaySchema = z.object({
  courseId: z.string().uuid(),
  stepId: z.string().uuid(),
  duration: z
    .number()
    .int()
    .min(1, "Duration must be at least 1 second")
    .max(7200, "Duration cannot exceed 2 hours"),
});

export type CompleteCourseDayInput = z.infer<typeof completeCourseDaySchema>;
