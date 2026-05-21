import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const BUCKET = "meditation-assets";
const COURSE_TITLE = "3-Day Mindfulness Foundation";

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

const COURSE_STEPS = [
  {
    daySequence: 1,
    title: "Day 1: Awakening Breath",
    audioName: "Day 1 — Vocal Guide",
    guideFile: "course/day-1-guide.mp3",
    loopFile: "course/day-1-loop.mp4",
  },
  {
    daySequence: 2,
    title: "Day 2: Body Awareness",
    audioName: "Day 2 — Vocal Guide",
    guideFile: "course/day-2-guide.mp3",
    loopFile: "course/day-2-loop.mp4",
  },
  {
    daySequence: 3,
    title: "Day 3: Present Moment",
    audioName: "Day 3 — Vocal Guide",
    guideFile: "course/day-3-guide.mp3",
    loopFile: "course/day-3-loop.mp4",
  },
] as const;

function resolveProjectRef(): string {
  const supabaseUrl = process.env.SUPABASE_URL;
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

async function seedAmbientTracks(): Promise<{ created: number; skipped: number }> {
  let created = 0;
  let skipped = 0;

  for (const track of AMBIENT_TRACKS) {
    const existing = await prisma.meditationAudio.findFirst({
      where: { name: track.name },
    });

    if (existing) {
      console.log(`  skip ambient: ${track.name}`);
      skipped++;
      continue;
    }

    await prisma.meditationAudio.create({
      data: {
        name: track.name,
        url: assetUrl(track.filename),
        category: track.category,
        duration: null,
      },
    });
    console.log(`  create ambient: ${track.name}`);
    created++;
  }

  return { created, skipped };
}

async function seedCourse(): Promise<"created" | "skipped"> {
  const existing = await prisma.course.findFirst({
    where: { title: COURSE_TITLE },
  });

  if (existing) {
    console.log(`  skip course: ${COURSE_TITLE}`);
    return "skipped";
  }

  await prisma.course.create({
    data: {
      title: COURSE_TITLE,
      description:
        "A beginner-friendly 3-day introduction to mindfulness breathing. Complete each day to unlock the next.",
      steps: {
        create: COURSE_STEPS.map((step) => ({
          daySequence: step.daySequence,
          title: step.title,
          audio: {
            create: {
              name: step.audioName,
              url: assetUrl(step.guideFile),
              bgVideoUrl: assetUrl(step.loopFile),
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

async function main() {
  console.log("Seeding MindEase MVP data...\n");

  console.log("Ambient tracks (Zen Timer):");
  const ambient = await seedAmbientTracks();

  console.log("\nStructured course:");
  const course = await seedCourse();

  console.log("\nDone.");
  console.log(
    `  Ambient: ${ambient.created} created, ${ambient.skipped} skipped`
  );
  console.log(`  Course: ${course}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
