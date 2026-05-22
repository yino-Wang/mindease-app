import Image from "next/image";
import Link from "next/link";

type StreamingDetailHeroProps = {
  coverUrl: string;
  title: string;
  backHref?: string;
};

export function StreamingDetailHero({
  coverUrl,
  title,
  backHref = "/dashboard",
}: StreamingDetailHeroProps) {
  return (
    <div className="relative h-[42vh] min-h-[280px] w-full shrink-0">
      <Image
        src={coverUrl}
        alt=""
        fill
        priority
        unoptimized={coverUrl.startsWith("/")}
        className="object-cover"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#0D0E0E] via-[#0D0E0E]/40 to-black/30"
        aria-hidden
      />
      <div className="absolute top-0 right-0 left-0 flex items-center justify-between p-5 sm:p-8">
        <Link
          href={backHref}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-700/60 bg-black/40 text-stone-300 backdrop-blur-md transition-all duration-700 ease-in-out hover:border-amber-500/30 hover:text-amber-300/90"
          aria-label="Back to dashboard"
        >
          ←
        </Link>
        <span className="sr-only">{title}</span>
      </div>
    </div>
  );
}
