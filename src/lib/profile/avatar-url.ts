export function isAllowedAvatarPublicUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
    if (!supabaseUrl) return false;
    const supabaseHost = new URL(supabaseUrl).host;
    if (parsed.host !== supabaseHost) return false;
    return (
      parsed.pathname.includes("/storage/v1/object/public/avatars/") ||
      parsed.pathname.includes("/storage/v1/object/public/meditation-assets/")
    );
  } catch {
    return false;
  }
}
