export function isYouTubeUrl(url: string): boolean {
  return /youtube\.com|youtu\.be/i.test(url);
}

export function isDirectMediaFile(url: string): boolean {
  return /\.(mp4|webm|ogg|mp3|m4a)(\?|$)/i.test(url);
}
