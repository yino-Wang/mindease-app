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

const CATEGORY_LIBRARY_SEED = [
  {
    name: "Ocean Rain Layer",
    category: "MIXER",
    introduction:
      "Wave undertones meet rainfall in a slow stereo weave. Blend layers until the mind feels docked beside a night sea.",
    coverUrl: "/images/covers/mixer-1.jpg",
    url: "https://www.youtube.com/watch?v=ZToicYcHIOU",
    duration: 3600,
    author: "MindEase",
    sortOrder: 1,
  },
  {
    name: "Forest Bowl Spectrum",
    category: "MIXER",
    introduction:
      "Singing bowls shimmer over distant birdsong. Tune the mix until metal and moss share the same breath.",
    coverUrl: "/images/covers/mixer-2.jpg",
    url: "https://www.youtube.com/watch?v=vj0JDwQLof4",
    duration: 2700,
    author: "MindEase",
    sortOrder: 2,
  },
  {
    name: "Pink Haze Drone",
    category: "MIXER",
    introduction:
      "Pink noise cushions thought without stealing attention. Let the drone hold you while finer sounds float above.",
    coverUrl: "/images/covers/mixer-3.jpg",
    url: "https://www.youtube.com/watch?v=lVx3mFxML80",
    duration: 2400,
    author: "MindEase",
    sortOrder: 3,
  },
  {
    name: "Ember Wind Chimes",
    category: "MIXER",
    introduction:
      "Chimes answer a low wind bed like sparks in dark air. Balance brightness and depth until the room feels warmer.",
    coverUrl: "/images/covers/mixer-4.jpg",
    url: "https://www.youtube.com/watch?v=TPC_36ZHOjo",
    duration: 3300,
    author: "MindEase",
    sortOrder: 4,
  },
  {
    name: "Deep Current Loop",
    category: "MIXER",
    introduction:
      "Sub-bass currents roll beneath a velvet surface. Mix for headphones and feel the body rocked in safe, slow motion.",
    coverUrl: "/images/covers/mixer-5.jpg",
    url: "https://www.youtube.com/watch?v=d4S4twjeWTs",
    duration: 4200,
    author: "MindEase",
    sortOrder: 5,
  },
  {
    name: "Sunrise Gratitude Gate",
    category: "MORNINGS",
    introduction:
      "Greet the first light with palms open and shoulders soft. Name one blessing before the day rushes in.",
    coverUrl: "/images/covers/mornings-1.jpg",
    url: "https://www.youtube.com/watch?v=aEqlQvczMJQ",
    duration: 720,
    author: "MindEase",
    sortOrder: 1,
  },
  {
    name: "Golden Breath Awakening",
    category: "MORNINGS",
    introduction:
      "Draw golden air through the ribs and pour it slowly out. Wake the body as if light were pouring inward.",
    coverUrl: "/images/covers/mornings-2.jpg",
    url: "https://www.youtube.com/watch?v=TR11LU9ziCU",
    duration: 600,
    author: "MindEase",
    sortOrder: 2,
  },
  {
    name: "Dawn Intention Walk",
    category: "MORNINGS",
    introduction:
      "Walk inward before your feet touch the street. Set one intention the heart can carry past breakfast.",
    coverUrl: "/images/covers/mornings-3.jpg",
    url: "https://www.youtube.com/watch?v=FGO8IWiusJo",
    duration: 840,
    author: "MindEase",
    sortOrder: 3,
  },
  {
    name: "Soft Horizon Open",
    category: "MORNINGS",
    introduction:
      "Expand the chest toward a horizon only you can see. Let morning be spacious, not something to conquer.",
    coverUrl: "/images/covers/mornings-4.jpg",
    url: "https://www.youtube.com/watch?v=vtOAnC73xtk",
    duration: 900,
    author: "MindEase",
    sortOrder: 4,
  },
  {
    name: "First Light Body Scan",
    category: "MORNINGS",
    introduction:
      "Scan from crown to soles while the room brightens. Notice warmth gathering where sleep once held you.",
    coverUrl: "/images/covers/mornings-5.jpg",
    url: "https://www.youtube.com/watch?v=5Uf_o_8AasI",
    duration: 1080,
    author: "MindEase",
    sortOrder: 5,
  },
  {
    name: "Moonlit Release",
    category: "SLEEP",
    introduction:
      "Exhale the day like smoke into a cool night sky. Each breath lengthens until eyelids feel weighted with kindness.",
    coverUrl: "/images/covers/sleep-1.jpg",
    url: "https://www.youtube.com/watch?v=18Z_mX0O-lA",
    duration: 1500,
    author: "MindEase",
    sortOrder: 1,
  },
  {
    name: "Starfield Descent",
    category: "SLEEP",
    introduction:
      "Imagine falling gently through stars that never rush. The mind drifts downward while the body stays anchored in bed.",
    coverUrl: "/images/covers/sleep-2.jpg",
    url: "https://www.youtube.com/watch?v=ZTo7qF26xV0",
    duration: 1800,
    author: "MindEase",
    sortOrder: 2,
  },
  {
    name: "Tidal Lullaby",
    category: "SLEEP",
    introduction:
      "Far waves rise and fall in a rhythm older than worry. Match your breath to the tide until thought thins to foam.",
    coverUrl: "/images/covers/sleep-3.jpg",
    url: "https://www.youtube.com/watch?v=28Psc_n6LCE",
    duration: 2100,
    author: "MindEase",
    sortOrder: 3,
  },
  {
    name: "Velvet Night Garden",
    category: "SLEEP",
    introduction:
      "Walk a dream garden where petals glow without sound. Rest here until sleep gathers you like dew.",
    coverUrl: "/images/covers/sleep-4.jpg",
    url: "https://www.youtube.com/watch?v=6Xp3O8w8a0Y",
    duration: 2400,
    author: "MindEase",
    sortOrder: 4,
  },
  {
    name: "Deep Rest Bell",
    category: "SLEEP",
    introduction:
      "A distant bell tells the body it is safe to power down. Let the final tone dissolve into darkness behind the eyes.",
    coverUrl: "/images/covers/sleep-5.jpg",
    url: "https://www.youtube.com/watch?v=ZToicYcHIOU",
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
    title: "10-Minute Guided Meditation: Self-Love | SELF",
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

  return { created, updated, removed: legacyTimer.count };
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
    `  Category library: ${library.created} created, ${library.updated} updated, ${library.removed} TIMER removed`
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
