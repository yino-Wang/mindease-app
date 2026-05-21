/** Low-saturation nature covers for dashboard carousel cards (Unsplash). */

export const NATURE_COVERS = [
  {
    url: "/cover/1.jpg",
    alt: "Misty pine forest",
  },
  {
    url: "/cover/2.jpg",
    alt: "Calm grey ocean",
  },
  {
    url: "/cover/3.jpg",
    alt: "Soft desert sand ripples",
  },
] as const;

export function getNatureCover(index: number) {
  return NATURE_COVERS[index % NATURE_COVERS.length];
}

export function getNatureCoverUrl(index: number): string {
  return getNatureCover(index).url;
}

export function getNatureCoverAlt(index: number): string {
  return getNatureCover(index).alt;
}
