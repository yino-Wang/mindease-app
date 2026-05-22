import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const BUCKET = "meditation-assets";
const COURSE_TITLE = "3-Day Mindfulness Foundation Course";
const LEGACY_COURSE_TITLE = "3-Day Mindfulness Foundation";

const AMBIENT_TRACKS = [
  {
    name: "Deep Ocean",
    category: "nature",
    filename: "ambient/deep-ocean.mp3",
  },
  {
    name: "Forest Rain",
    category: "nature",
    filename: "ambient/forest-rain.mp3",
  },
  {
    name: "Singing Bowl Spectrum",
    category: "zen",
    filename: "ambient/singing-bowl-spectrum.mp3",
  },
  {
    name: "Pink Noise",
    category: "zen",
    filename: "ambient/pink-noise.mp3",
  },
] as const;

/** MVP: use uploaded ambient tracks until TTS guides exist at course/day-N-guide.mp3 */
const COURSE_STEPS = [
  {
    daySequence: 1,
    title: "Day 1: Breath Awareness",
    audioName: "Day 1 — Vocal Guide",
    guideFile: "ambient/1.jpg",
    loopFile: null,
  },
  {
    daySequence: 2,
    title: "Day 2: Body Scan",
    audioName: "Day 2 — Vocal Guide",
    guideFile: "ambient/deep-ocean.mp3",
    loopFile: null,
  },
  {
    daySequence: 3,
    title: "Day 3: Embracing Emotions",
    audioName: "Day 3 — Vocal Guide",
    guideFile: "ambient/singing-bowl-spectrum.mp3",
    loopFile: null,
  },
] as const;

/** weekdayIndex 0 = Sunday … 6 = Saturday (matches Date.getDay()) */
const DAILY_GUIDE_FILES = [
  "ambient/forest-rain.mp3",
  "ambient/deep-ocean.mp3",
  "ambient/singing-bowl-spectrum.mp3",
  "ambient/pink-noise.mp3",
  "ambient/forest-rain.mp3",
  "ambient/deep-ocean.mp3",
  "ambient/singing-bowl-spectrum.mp3",
] as const;

const DAILY_ZEN_THEMES = [
  {
    weekdayIndex: 0,
    name: "Daily Zen — Sunday Stillness",
    theme: "Sunday Stillness",
    duration: 300,
  },
  {
    weekdayIndex: 1,
    name: "Daily Zen — Monday Grounding",
    theme: "Monday Grounding",
    duration: 240,
  },
  {
    weekdayIndex: 2,
    name: "Daily Zen — Tuesday Clarity",
    theme: "Tuesday Clarity",
    duration: 240,
  },
  {
    weekdayIndex: 3,
    name: "Daily Zen — Wednesday Flow",
    theme: "Wednesday Flow",
    duration: 180,
  },
  {
    weekdayIndex: 4,
    name: "Daily Zen — Thursday Release",
    theme: "Thursday Release",
    duration: 240,
  },
  {
    weekdayIndex: 5,
    name: "Daily Zen — Friday Ease",
    theme: "Friday Ease",
    duration: 180,
  },
  {
    weekdayIndex: 6,
    name: "Daily Zen — Saturday Rest",
    theme: "Saturday Rest",
    duration: 300,
  },
] as const;

const SPOTLIGHT_ITEMS = [
  {
    title: "Powerful Message For You",
    description:
      "A premium guided masterclass on grounding breath and quiet confidence. Settle into the body, soften the jaw, and let the day recede.",
    author: "MindEase Guide",
    coverUrl: "/cover/1.jpg",
    videoFile: "ambient/deep-ocean.mp3",
    duration: 720,
    rating: 4.9,
    playCount: 12400,
    sortOrder: 0,
    tags: ["Empowerment", "Breath", "Focus"],
  },
  {
    title: "Forest Threshold",
    description:
      "Walk the tree line at dawn. Layered forest ambience supports a steady attention anchor without visual noise.",
    author: "Sora Lin",
    coverUrl: "/cover/2.jpg",
    videoFile: "ambient/forest-rain.mp3",
    duration: 600,
    rating: 4.8,
    playCount: 9800,
    sortOrder: 1,
    tags: ["Nature", "Calm", "Morning"],
  },
  {
    title: "Desert Stillness",
    description:
      "Wide horizons and slow breath. A cinematic stillness practice for resetting nervous system load after dense work.",
    author: "MindEase Studio",
    coverUrl: "/cover/3.jpg",
    videoFile: "ambient/singing-bowl-spectrum.mp3",
    duration: 540,
    rating: 4.85,
    playCount: 7600,
    sortOrder: 2,
    tags: ["Stillness", "Release", "Evening"],
  },
] as const;

const MADE_FOR_YOU_ITEMS = [
  {
    title: "Five-Minute Ocean Reset",
    description:
      "A tailored short loop for mid-day anxiety—gentle waves, no instruction, just arrive and exhale.",
    author: "For you",
    coverUrl: "/cover/2.jpg",
    videoFile: "ambient/deep-ocean.mp3",
    duration: 300,
    rating: 4.7,
    playCount: 4200,
    sortOrder: 0,
    tags: ["Short", "Ocean", "Reset"],
  },
  {
    title: "Rain on Cedar",
    description:
      "Soft rainfall texture for focus sprints. Keeps peripheral attention occupied so the mind can narrow.",
    author: "For you",
    coverUrl: "/cover/1.jpg",
    videoFile: "ambient/forest-rain.mp3",
    duration: 360,
    rating: 4.75,
    playCount: 3100,
    sortOrder: 1,
    tags: ["Rain", "Focus", "Loop"],
  },
  {
    title: "Bowl Spectrum Drift",
    description:
      "Singing bowl harmonics in a slow arc—ideal before sleep or after screen-heavy evenings.",
    author: "For you",
    coverUrl: "/cover/3.jpg",
    videoFile: "ambient/singing-bowl-spectrum.mp3",
    duration: 420,
    rating: 4.8,
    playCount: 2800,
    sortOrder: 2,
    tags: ["Sleep", "Bowl", "Drift"],
  },
  {
    title: "Pink Noise Shelter",
    description:
      "Steady pink noise bed for masking urban sound. Minimal guidance, maximum enclosure.",
    author: "For you",
    coverUrl: "/cover/1.jpg",
    videoFile: "ambient/pink-noise.mp3",
    duration: 480,
    rating: 4.6,
    playCount: 1900,
    sortOrder: 3,
    tags: ["Noise", "Shelter", "Night"],
  },
  {
    title: "Sunday Stillness Loop",
    description:
      "A made-for-you extension of the weekly stillness theme—unhurried, low pulse, room to breathe.",
    author: "For you",
    coverUrl: "/cover/2.jpg",
    videoFile: "ambient/forest-rain.mp3",
    duration: 300,
    rating: 4.72,
    playCount: 1500,
    sortOrder: 4,
    tags: ["Sunday", "Stillness"],
  },
  {
    title: "Late Night Grounding",
    description:
      "Ocean undertow and long exhale cues—built for insomnia edges and racing thought loops.",
    author: "For you",
    coverUrl: "/cover/3.jpg",
    videoFile: "ambient/deep-ocean.mp3",
    duration: 360,
    rating: 4.78,
    playCount: 2200,
    sortOrder: 5,
    tags: ["Night", "Grounding"],
  },
] as const;

function resolveProjectRef(): string {
  const supabaseUrl =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl) {
    try {
      const host = new URL(supabaseUrl).hostname;
      const ref = host.split(".")[0];
      if (ref) return ref;
    } catch {
      // fall through
    }
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (databaseUrl) {
    try {
      const host = new URL(databaseUrl).hostname;
      const match = host.match(/^postgres\.([^.]+)\./);
      if (match?.[1]) return match[1];
    } catch {
      // fall through
    }
  }

  return "skfogwhzqooyqtifdouv";
}

function assetUrl(filename: string): string {
  const projectRef = resolveProjectRef();
  return `https://${projectRef}.supabase.co/storage/v1/object/public/${BUCKET}/${filename}`;
}

async function seedAmbientTracks(): Promise<{ created: number; updated: number }> {
  let created = 0;
  let updated = 0;

  for (const track of AMBIENT_TRACKS) {
    const existing = await prisma.meditationAudio.findFirst({
      where: { name: track.name },
    });

    const url = assetUrl(track.filename);

    if (existing) {
      await prisma.meditationAudio.update({
        where: { id: existing.id },
        data: { url, category: track.category },
      });
      console.log(`  update ambient: ${track.name}`);
      updated++;
      continue;
    }

    await prisma.meditationAudio.create({
      data: {
        name: track.name,
        url,
        category: track.category,
        duration: null,
      },
    });
    console.log(`  create ambient: ${track.name}`);
    created++;
  }

  return { created, updated };
}

async function seedCourse(): Promise<"created" | "updated"> {
  let course = await prisma.course.findFirst({
    where: {
      OR: [{ title: COURSE_TITLE }, { title: LEGACY_COURSE_TITLE }],
    },
    include: { steps: { orderBy: { daySequence: "asc" } } },
  });

  if (!course) {
    await prisma.course.create({
      data: {
        title: COURSE_TITLE,
        description:
          "A beginner-friendly 3-day introduction to mindfulness. Complete each day to unlock the next.",
        steps: {
          create: COURSE_STEPS.map((step) => ({
            daySequence: step.daySequence,
            title: step.title,
            audio: {
              create: {
                name: step.audioName,
                url: assetUrl(step.guideFile),
                bgVideoUrl: step.loopFile ? assetUrl(step.loopFile) : null,
                category: "course",
                duration: 480,
              },
            },
          })),
        },
      },
    });
    console.log(`  create course: ${COURSE_TITLE} (3 steps)`);
    return "created";
  }

  if (course.title !== COURSE_TITLE) {
    course = await prisma.course.update({
      where: { id: course.id },
      data: { title: COURSE_TITLE },
      include: { steps: { orderBy: { daySequence: "asc" } } },
    });
  }

  await prisma.course.update({
    where: { id: course.id },
    data: {
      description:
        "A beginner-friendly 3-day introduction to mindfulness. Complete each day to unlock the next.",
    },
  });

  for (const stepDef of COURSE_STEPS) {
    const existingStep = course.steps.find(
      (s) => s.daySequence === stepDef.daySequence
    );

    if (existingStep) {
      await prisma.courseStep.update({
        where: { id: existingStep.id },
        data: { title: stepDef.title },
      });
      await prisma.meditationAudio.update({
        where: { id: existingStep.audioId },
        data: {
          name: stepDef.audioName,
          url: assetUrl(stepDef.guideFile),
          bgVideoUrl: stepDef.loopFile ? assetUrl(stepDef.loopFile) : null,
          category: "course",
          duration: 480,
        },
      });
      console.log(`  update step ${stepDef.daySequence}: ${stepDef.title}`);
    } else {
      const audio = await prisma.meditationAudio.create({
        data: {
          name: stepDef.audioName,
          url: assetUrl(stepDef.guideFile),
          bgVideoUrl: stepDef.loopFile ? assetUrl(stepDef.loopFile) : null,
          category: "course",
          duration: 480,
        },
      });
      await prisma.courseStep.create({
        data: {
          courseId: course.id,
          daySequence: stepDef.daySequence,
          title: stepDef.title,
          audioId: audio.id,
        },
      });
      console.log(`  create step ${stepDef.daySequence}: ${stepDef.title}`);
    }
  }

  console.log(`  update course: ${COURSE_TITLE}`);
  return "updated";
}

async function seedDailyZen(): Promise<{ created: number; updated: number }> {
  let created = 0;
  let updated = 0;

  for (const theme of DAILY_ZEN_THEMES) {
    const existing = await prisma.meditationAudio.findFirst({
      where: { name: theme.name },
    });

    const guideFile = DAILY_GUIDE_FILES[theme.weekdayIndex];
    const data = {
      name: theme.name,
      url: assetUrl(guideFile),
      bgVideoUrl: null,
      category: "daily",
      duration: theme.duration,
    };

    if (existing) {
      await prisma.meditationAudio.update({
        where: { id: existing.id },
        data,
      });
      console.log(`  update daily: ${theme.theme}`);
      updated++;
    } else {
      await prisma.meditationAudio.create({ data });
      console.log(`  create daily: ${theme.theme}`);
      created++;
    }
  }

  return { created, updated };
}

async function seedStreamingItems(): Promise<{
  spotlight: number;
  madeForYou: number;
}> {
  let spotlight = 0;
  let madeForYou = 0;

  for (const item of SPOTLIGHT_ITEMS) {
    const existing = await prisma.streamingItem.findFirst({
      where: { sectionType: "SPOTLIGHT", title: item.title },
    });
    const data = {
      sectionType: "SPOTLIGHT",
      title: item.title,
      description: item.description,
      videoUrl: assetUrl(item.videoFile),
      coverUrl: item.coverUrl,
      duration: item.duration,
      rating: item.rating,
      playCount: item.playCount,
      author: item.author,
      tags: item.tags.join(","),
      sortOrder: item.sortOrder,
      published: true,
    };
    if (existing) {
      await prisma.streamingItem.update({ where: { id: existing.id }, data });
      console.log(`  update spotlight: ${item.title}`);
    } else {
      await prisma.streamingItem.create({ data });
      console.log(`  create spotlight: ${item.title}`);
      spotlight++;
    }
  }

  for (const item of MADE_FOR_YOU_ITEMS) {
    const existing = await prisma.streamingItem.findFirst({
      where: { sectionType: "MADE_FOR_YOU", title: item.title },
    });
    const data = {
      sectionType: "MADE_FOR_YOU",
      title: item.title,
      description: item.description,
      videoUrl: assetUrl(item.videoFile),
      coverUrl: item.coverUrl,
      duration: item.duration,
      rating: item.rating,
      playCount: item.playCount,
      author: item.author,
      tags: item.tags.join(","),
      sortOrder: item.sortOrder,
      published: true,
    };
    if (existing) {
      await prisma.streamingItem.update({ where: { id: existing.id }, data });
      console.log(`  update made for you: ${item.title}`);
    } else {
      await prisma.streamingItem.create({ data });
      console.log(`  create made for you: ${item.title}`);
      madeForYou++;
    }
  }

  return { spotlight, madeForYou };
}

async function main() {
  console.log("Seeding MindEase MVP data...\n");

  console.log("Ambient tracks (Zen Timer):");
  const ambient = await seedAmbientTracks();

  console.log("\nStructured course:");
  const course = await seedCourse();

  console.log("\nDaily Zen themes:");
  const daily = await seedDailyZen();

  console.log("\nStreaming catalog (Spotlight + Made For You):");
  const streaming = await seedStreamingItems();

  console.log("\nDone.");
  console.log(
    `  Ambient: ${ambient.created} created, ${ambient.updated} updated`
  );
  console.log(`  Course: ${course}`);
  console.log(
    `  Daily Zen: ${daily.created} created, ${daily.updated} updated`
  );
  console.log(
    `  Streaming: ${streaming.spotlight} spotlight created, ${streaming.madeForYou} made-for-you created`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
