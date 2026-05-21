import Image from "next/image";
import { SafeAmbientVideo } from "@/components/media/SafeAmbientVideo";
import { CARD_MEDIA_ASPECT } from "@/lib/dashboard/styles";
import { getNatureCover } from "@/lib/dashboard/cover-images";

type DashboardCardCoverProps = {
  coverIndex: number;
  alt: string;
  videoUrl?: string | null;
  showVideo?: boolean;
  priority?: boolean;
};

export function DashboardCardCover({
  coverIndex,
  alt,
  videoUrl,
  showVideo = true,
  priority = false,
}: DashboardCardCoverProps) {
  const cover = getNatureCover(coverIndex);

  return (
    <div className={`relative overflow-hidden ${CARD_MEDIA_ASPECT}`}>
      <Image
        src={cover.url}
        alt={cover.alt || alt}
        fill
        sizes="320px"
        priority={priority}
        className="object-cover opacity-85 transition-opacity duration-700 group-hover:opacity-95 motion-reduce:transition-none"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"
        aria-hidden
      />
      {showVideo && videoUrl ? (
        <SafeAmbientVideo
          src={videoUrl}
          autoPlay
          className="absolute inset-0 h-full w-full object-cover opacity-90 transition-opacity duration-700 group-hover:opacity-100 motion-reduce:transition-none"
        />
      ) : null}
    </div>
  );
}
