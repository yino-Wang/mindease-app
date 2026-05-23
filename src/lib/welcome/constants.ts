export const WELCOME_HEADLINE =
  "A digital sanctuary forged to slow down the cadence of modern noise.";

function resolveProjectRef(): string {
  const databaseUrl = process.env.DATABASE_URL;
  if (databaseUrl) {
    try {
      const host = new URL(databaseUrl).hostname;
      const match = host.match(/^postgres\.([^.]+)\./);
      if (match?.[1]) return match[1];
    } catch {
    }
  }
  return "skfogwhzqooyqtifdouv";
}

export function getWelcomeVideoUrl(): string {
  const override = process.env.NEXT_PUBLIC_WELCOME_VIDEO_URL?.trim();
  if (override) return override;
  const ref = resolveProjectRef();
  return `https://${ref}.supabase.co/storage/v1/object/public/meditation-assets/ambient/welcome-nature.mp4`;
}
