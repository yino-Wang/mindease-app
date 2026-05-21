/** Play media without surfacing NotSupportedError as an unhandled rejection. */
export async function safePlay(
  media: HTMLMediaElement
): Promise<boolean> {
  if (media.error != null) return false;

  try {
    await media.play();
    return true;
  } catch {
    return false;
  }
}
