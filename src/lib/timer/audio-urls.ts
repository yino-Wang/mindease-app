function resolveProjectRef(): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl) {
    try {
      const host = new URL(supabaseUrl).hostname;
      const ref = host.split(".")[0];
      if (ref) return ref;
    } catch {
      // fall through
    }
  }
  return "skfogwhzqooyqtifdouv";
}

export function getChimeAudioUrl(): string {
  if (process.env.NEXT_PUBLIC_CHIME_AUDIO_URL) {
    return process.env.NEXT_PUBLIC_CHIME_AUDIO_URL;
  }
  if (process.env.CHIME_AUDIO_URL) {
    return process.env.CHIME_AUDIO_URL;
  }
  const ref = resolveProjectRef();
  return `https://${ref}.supabase.co/storage/v1/object/public/meditation-assets/ambient/singing-bowl-chime.mp3`;
}
