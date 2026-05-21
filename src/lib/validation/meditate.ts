import { z } from "zod";

export const ZEN_JOURNAL_MAX_LENGTH = 50;

export const createMeditationLogSchema = z.object({
  audioId: z.string().uuid().optional(),
  duration: z
    .number()
    .int()
    .min(1, "Duration must be at least 1 second")
    .max(7200, "Duration cannot exceed 2 hours"),
  logType: z.literal("TIMER"),
});

export const createZenJournalSchema = z.object({
  logId: z.string().uuid(),
  content: z
    .string()
    .trim()
    .min(1, "Reflection cannot be empty")
    .max(
      ZEN_JOURNAL_MAX_LENGTH,
      `Reflection cannot exceed ${ZEN_JOURNAL_MAX_LENGTH} characters`
    ),
});

export type CreateMeditationLogInput = z.infer<typeof createMeditationLogSchema>;
export type CreateZenJournalInput = z.infer<typeof createZenJournalSchema>;
