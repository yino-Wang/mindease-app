import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const LIBRARY_CATEGORIES = ["MIXER", "MORNINGS", "SLEEP"] as const;

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

const CATEGORY_LIBRARY_SEED = [
  {
    name: "Total Body Relaxation",
    category: "MIXER",
    introduction:
      " A 10 minute meditation to release stress & anxiety, featuring a body scan for total body relaxation and positive affirmations. Great for beginners and all levels. Do this 10 min meditation daily for one week, before moving onto the next meditation.",
    coverUrl: "/images/covers/mixer-1.png",
    url: "https://www.youtube.com/watch?v=H_uc-uQ3Nkc",
    duration: 3600,
    author: "MindEase",
    sortOrder: 1,
  },
  {
    name: " Quiet Your Thoughts & Relax",
    category: "MIXER",
    introduction:
      "This meditation is designed to shift your awareness away from the chaos of life and toward a state of calm, peace, and centeredness.",
    coverUrl: "/images/covers/mixer-2.png",
    url: "https://www.youtube.com/watch?v=sfSDQRdIvTc",
    duration: 2700,
    author: "MindEase",
    sortOrder: 2,
  },
  {
    name: "Heal Your Heart & Release Emotions",
    category: "MIXER",
    introduction:
      "A 10 minute guided meditation to release emotions, featuring a heart chakra healing visualization and positive affirmations. Great for beginners and all levels. Do this 10 min meditation daily for one week, before moving onto the next meditation.",
    coverUrl: "/images/covers/mixer-3.png",
    url: "https://www.youtube.com/watch?v=FmE9w30L8Fk",
    duration: 2400,
    author: "MindEase",
    sortOrder: 3,
  },
  {
    name: "Relaxing Full Body Yoga for Beginners",
    category: "MIXER",
    introduction:
      "This camp is an offering to all those who cannot step out of the home to practice yoga or don't get enough time to take care of themselves. ",
    coverUrl: "/images/covers/mixer-4.png",
    url: "https://www.youtube.com/watch?v=FdyhENXyIQ4&list=PLe1px9-uNQToJhrFIBpVsviZMABuLE5x8",
    duration: 3300,
    author: "MindEase",
    sortOrder: 4,
  },
  {
    name: "10-Minute Guided Meditation: Self-Love",
    category: "MIXER",
    introduction:
      "Daily health, fitness, beauty, style advice, and videos for people who want to achieve their personal best in life.",
    coverUrl: "/images/covers/mixer-5.png",
    url: "https://www.youtube.com/watch?v=vj0JDwQLof4&t=1s",
    duration: 4200,
    author: "MindEase",
    sortOrder: 5,
  },
  {
    name: "Meditation Is Easier Than You Think",
    category: "MORNINGS",
    introduction:
      "In this video, Mingyur Rinpoche explains the essence of meditation and describes some common misunderstandings about practicing meditation. He also shares some tips for bringing meditation into our day-to-day lives. ",
    coverUrl: "/images/covers/m1.png",
    url: "https://www.youtube.com/watch?v=thcEuMDWxoI",
    duration: 720,
    author: "MindEase",
    sortOrder: 1,
  },
  {
    name: "10 Minute Morning Meditation - You'll Have the Most Incredible Day",
    category: "MORNINGS",
    introduction:
      "Listen to this 10-minute guided morning meditation to start your day well, and you'll have the most incredible day today",
    coverUrl: "/images/covers/m2.png",
    url: "https://www.youtube.com/watch?v=qQ4vD5FdOKM",
    duration: 600,
    author: "MindEase",
    sortOrder: 2,
  },
  {
    name: "5 Min Meditation Anyone Can Do Anywhere | Re-Center & Clear Your Mind",
    category: "MORNINGS",
    introduction:
      "This five minute guided meditation is the best way to quickly and effectively find peace, recenter yourself, and clear your mind for anything. It's a perfect tool because the most common internal resistance we all share that works against a consistent meditation practice, is time. But who doesn't have 5 minutes? ",
    coverUrl: "/images/covers/m3.png",
    url: "https://www.youtube.com/watch?v=LDs7jglje_U",
    duration: 840,
    author: "MindEase",
    sortOrder: 3,
  },
  {
    name: "Soothing Breathwork Meditation",
    category: "MORNINGS",
    introduction:
      "This particular breathing pattern is proven to help shift the body out of survival mode and into a more relaxed and calm state of peace and ease. ",
    coverUrl: "/images/covers/m4.png",
    url: "https://www.youtube.com/watch?v=Xw52flWo6-M&list=PLSCtKorB3pjGvw75CHlCtBesHF74Zgn7K",
    duration: 1080,
    author: "MindEase",
    sortOrder: 4,
  },
  {
    name: "Rewire for Success, Love, & Abundance",
    category: "SLEEP",
    introduction:
      "This guided meditation is designed to help you release negative thoughts, emotions, and patterns that are holding you back from living your best life. ",
    coverUrl: "/images/covers/m5.png",
    url: "https://www.youtube.com/watch?v=oX5bHgCN714&list=PLSCtKorB3pjGvw75CHlCtBesHF74Zgn7K&index=2",
    duration: 1500,
    author: "MindEase",
    sortOrder: 1,
  },
  {
    name: "Guided Sleep Meditation & Deep Relaxation",
    category: "SLEEP",
    introduction:
      "Imagine falling gently through stars that never rush. The mind drifts downward while the body stays anchored in bed.",
    coverUrl: "/images/covers/s1.png",
    url: "https://www.youtube.com/watch?v=rvaqPPjtxng",
    duration: 1800,
    author: "MindEase",
    sortOrder: 2,
  },
  {
    name: "Fall Asleep In MINUTES! Sleep Talk-Down Guided Meditation Hypnosis for Sleeping",
    category: "SLEEP",
    introduction:
      "Far waves rise and fall in a rhythm older than worry. Match your breath to the tide until thought thins to foam.",
    coverUrl: "/images/covers/s2.png",
    url: "https://www.youtube.com/watch?v=U6Ay9v7gK9w",
    duration: 2100,
    author: "MindEase",
    sortOrder: 3,
  },
  {
    name: "Full-Body Relaxation and Guided Breathing Meditation | for Bone Deep Sleep – Rest and Restore",
    category: "SLEEP",
    introduction:
      "This guided meditation is designed to help you relax your body and mind, and fall asleep quickly and easily. ",
    coverUrl: "/images/covers/s3.png",
    url: "https://www.youtube.com/watch?v=a1j2Uhzc08s",
    duration: 2400,
    author: "MindEase",
    sortOrder: 4,
  },
  {
    name: "Deep Sleep Hypnosis, Guided Sleep Meditation",
    category: "SLEEP",
    introduction:
      "This guided meditation is designed to help you relax your body and mind, and fall asleep quickly and easily. ",
    coverUrl: "/images/covers/s4.png",
    url: "https://www.youtube.com/watch?v=hwNb49-ofzI",
    duration: 2700,
    author: "MindEase",
    sortOrder: 5,
  },
] as const;

const SPOTLIGHT_ITEMS = [
  {
    title: "Daily Calm",
    description:
      "Tamara Levitt guides this 10 minute Daily Calm mindfulness meditation to powerfully restore and re-connect with the present.",
    author: "MindEase Guide",
    coverUrl: "/cover/DailyCalm.png",
    mediaUrl: "https://www.youtube.com/watch?v=ZToicYcHIOU",
    duration: 720,
    rating: 4.9,
    playCount: 12400,
    sortOrder: 0,
    tags: ["Empowerment", "Breath", "Focus"],
  },
  {
    title: "10-Minute Guided Meditation: Self-Love",
    description:
      "Daily health, fitness, beauty, style advice, and videos for people who want to achieve their personal best in life.",
    author: "Sora Lin",
    coverUrl: "/cover/Self-Love.png",
    mediaUrl: "https://www.youtube.com/watch?v=vj0JDwQLof4",
    duration: 600,
    rating: 4.8,
    playCount: 9800,
    sortOrder: 1,
    tags: ["Nature", "Calm", "Morning"],
  },
  {
    title: "Mindfulness Meditation",
    description:
      "Wide horizons and slow breath. A cinematic stillness practice for resetting nervous system load after dense work.",
    author: "MindEase Studio",
    coverUrl: "/cover/Mindfulness.png",
    mediaUrl: "https://www.youtube.com/watch?v=lVx3mFxML80",
    duration: 540,
    rating: 4.85,
    playCount: 7600,
    sortOrder: 2,
    tags: ["Stillness", "Release", "Evening"],
  },
] as const;

const MADE_FOR_YOU_ITEMS = [
  {
    title: "20 Minute Guided Meditation For The Heart",
    description:
      "Listen to this 20 minute guided meditation each day and explore the love and compassion within our hearts to find a state of relaxation and inner peace. ",
    author: "For you",
    coverUrl: "/cover/Heart.png",
    mediaUrl: "https://www.youtube.com/watch?v=TPC_36ZHOjo",
    duration: 300,
    rating: 4.7,
    playCount: 4200,
    sortOrder: 0,
    tags: ["Short", "Ocean", "Reset"],
  },
  {
    title: "Meditation For Inner Peace",
    description:
      "Dive into meditation this Spring, go inward to focus on what feels good in mind and body. Want to have a good body? Tend to the mind. This 10 min practice is a simple meditation that will create the foundation for transformational practice. Compliment your yoga asana practice with this 10 Min Meditation For Inner Peace.",
    author: "For you",
    coverUrl: "/cover/Inner Peace.png",
    mediaUrl: "https://www.youtube.com/watch?v=d4S4twjeWTs",
    duration: 360,
    rating: 4.75,
    playCount: 3100,
    sortOrder: 1,
    tags: ["Rain", "Focus", "Loop"],
  },
  {
    title: "10-Minute Meditation For Sleep",
    description:
      "If you are feeling restless, listen to this guided meditation to ease your mind and body into falling asleep. ",
    author: "For you",
    coverUrl: "/cover/3.jpg",
    mediaUrl: "https://www.youtube.com/watch?v=aEqlQvczMJQ",
    duration: 420,
    rating: 4.8,
    playCount: 2800,
    sortOrder: 2,
    tags: ["Sleep", "Bowl", "Drift"],
  },
  {
    title: "A Guided Meditation on the Body",
    description:
      "A Guided Meditation on the Body, Space, and Awareness with Yongey Mingyur Rinpoche",
    author: "For you",
    coverUrl: "/cover/body.png",
    mediaUrl: "https://www.youtube.com/watch?v=TR11LU9ziCU",
    duration: 480,
    rating: 4.6,
    playCount: 1900,
    sortOrder: 3,
    tags: ["Noise", "Shelter", "Night"],
  },
  {
    title: "Guided Morning Meditation ",
    description:
      "This 10 minute mindful meditation will give you the mental clarity and space necessary to ground yourself with beautiful focus and set your day on the perfect track for success and fulfillment. ",
    author: "For you",
    coverUrl: "/cover/morning.png",
    mediaUrl: "https://www.youtube.com/watch?v=FGO8IWiusJo",
    duration: 300,
    rating: 4.72,
    playCount: 1500,
    sortOrder: 4,
    tags: ["Sunday", "Stillness"],
  },
  {
    title: "Powerful Guided Meditation",
    description:
      "A 10 minute guided meditation for healing, letting go, and inner peace. Heal your heart & emotional wounds with positive energy visualization, energy healing heart chakra tapping, and positive affirmations. This healing meditation will help you cultivate gratitude, self forgiveness, and perspective for your journey. Great for beginners and all levels.",
    author: "For you",
    coverUrl: "/cover/Powerful.png",
    mediaUrl: "https://www.youtube.com/watch?v=vtOAnC73xtk",
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

/** Pass through YouTube/external URLs; only map bare paths to Supabase Storage. */
function resolveStreamingMediaUrl(source: string): string {
  if (/^https?:\/\//i.test(source)) {
    return source;
  }
  return assetUrl(source);
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

function publicCoverExists(coverUrl: string | null | undefined): boolean {
  const trimmed = coverUrl?.trim();
  if (!trimmed) return false;
  const relative = trimmed.startsWith("/") ? trimmed.slice(1) : trimmed;
  return fs.existsSync(path.join(process.cwd(), "public", relative));
}

/** Drop library rows not in seed, missing cover file, or empty coverUrl. */
async function cleanupCategoryLibrary(): Promise<number> {
  const seedNamesByCategory = new Map<string, Set<string>>();
  for (const item of CATEGORY_LIBRARY_SEED) {
    if (
      !(LIBRARY_CATEGORIES as readonly string[]).includes(item.category)
    ) {
      continue;
    }
    if (!seedNamesByCategory.has(item.category)) {
      seedNamesByCategory.set(item.category, new Set());
    }
    seedNamesByCategory.get(item.category)!.add(item.name);
  }

  const libraryRows = await prisma.meditationAudio.findMany({
    where: { category: { in: [...LIBRARY_CATEGORIES] } },
    select: { id: true, name: true, category: true, coverUrl: true },
  });

  let removed = 0;
  for (const row of libraryRows) {
    const inSeed = seedNamesByCategory.get(row.category)?.has(row.name) ?? false;
    const hasCover = publicCoverExists(row.coverUrl);
    if (!inSeed || !hasCover) {
      await prisma.meditationAudio.delete({ where: { id: row.id } });
      const reason = !inSeed ? "not in seed" : "blank or missing cover";
      console.log(`  remove library [${row.category}]: ${row.name} (${reason})`);
      removed++;
    }
  }

  return removed;
}

async function seedCategoryLibrary(): Promise<{
  created: number;
  updated: number;
  removed: number;
}> {
  let created = 0;
  let updated = 0;

  const legacyTimer = await prisma.meditationAudio.deleteMany({
    where: { category: "TIMER" },
  });
  if (legacyTimer.count > 0) {
    console.log(`  remove legacy TIMER library: ${legacyTimer.count} rows`);
  }

  const cleaned = await cleanupCategoryLibrary();

  for (const item of CATEGORY_LIBRARY_SEED) {
    const existing = await prisma.meditationAudio.findFirst({
      where: { name: item.name, category: item.category },
    });

    const data = {
      name: item.name,
      url: item.url,
      bgVideoUrl: null,
      category: item.category,
      introduction: item.introduction,
      coverUrl: item.coverUrl,
      author: item.author,
      sortOrder: item.sortOrder,
      published: true,
      duration: item.duration,
    };

    if (existing) {
      await prisma.meditationAudio.update({
        where: { id: existing.id },
        data,
      });
      console.log(`  update library [${item.category}]: ${item.name}`);
      updated++;
    } else {
      await prisma.meditationAudio.create({ data });
      console.log(`  create library [${item.category}]: ${item.name}`);
      created++;
    }
  }

  return { created, updated, removed: legacyTimer.count + cleaned };
}

const STREAMING_SECTIONS = ["SPOTLIGHT", "MADE_FOR_YOU"] as const;

/** Remove spotlight / made-for-you rows that are no longer in seed. */
async function cleanupStreamingCatalog(): Promise<number> {
  const seedTitlesBySection = new Map<string, Set<string>>([
    ["SPOTLIGHT", new Set(SPOTLIGHT_ITEMS.map((item) => item.title))],
    ["MADE_FOR_YOU", new Set(MADE_FOR_YOU_ITEMS.map((item) => item.title))],
  ]);

  const rows = await prisma.streamingItem.findMany({
    where: { sectionType: { in: [...STREAMING_SECTIONS] } },
    select: { id: true, title: true, sectionType: true },
  });

  let removed = 0;
  for (const row of rows) {
    const inSeed =
      seedTitlesBySection.get(row.sectionType)?.has(row.title) ?? false;
    if (!inSeed) {
      await prisma.streamingItem.delete({ where: { id: row.id } });
      console.log(
        `  remove streaming [${row.sectionType}]: ${row.title} (not in seed)`
      );
      removed++;
    }
  }

  return removed;
}

async function seedStreamingItems(): Promise<{
  spotlight: number;
  madeForYou: number;
  removed: number;
}> {
  let spotlight = 0;
  let madeForYou = 0;

  const removed = await cleanupStreamingCatalog();

  for (const item of SPOTLIGHT_ITEMS) {
    const existing = await prisma.streamingItem.findFirst({
      where: { sectionType: "SPOTLIGHT", title: item.title },
    });
    const data = {
      sectionType: "SPOTLIGHT",
      title: item.title,
      description: item.description,
      videoUrl: resolveStreamingMediaUrl(item.mediaUrl),
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
      videoUrl: resolveStreamingMediaUrl(item.mediaUrl),
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

  return { spotlight, madeForYou, removed };
}

async function main() {
  console.log("Seeding MindEase MVP data...\n");

  console.log("Ambient tracks (Zen Timer):");
  const ambient = await seedAmbientTracks();

  console.log("\nStructured course:");
  const course = await seedCourse();

  console.log("\nDaily Zen themes:");
  const daily = await seedDailyZen();

  console.log("\nCategory libraries (MIXER / MORNINGS / SLEEP):");
  const library = await seedCategoryLibrary();

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
    `  Category library: ${library.created} created, ${library.updated} updated, ${library.removed} removed`
  );
  console.log(
    `  Streaming: ${streaming.spotlight} spotlight created, ${streaming.madeForYou} made-for-you created, ${streaming.removed} removed`
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
