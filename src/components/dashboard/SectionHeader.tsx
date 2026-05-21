import Link from "next/link";
import { FOCUS_RING } from "@/lib/dashboard/styles";

type SectionHeaderProps = {
  title: string;
  seeAllHref?: string;
  seeAllLabel?: string;
};

export function SectionHeader({
  title,
  seeAllHref,
  seeAllLabel = "See all",
}: SectionHeaderProps) {
  return (
    <div className="mb-5 flex items-center justify-between gap-4">
      <h2 className="text-xs font-medium tracking-[0.25em] text-stone-500 uppercase">
        {title}
      </h2>
      {seeAllHref && (
        <Link
          href={seeAllHref}
          className={`text-xs tracking-widest text-stone-500 uppercase transition-all duration-700 ease-in-out hover:text-amber-400/80 motion-reduce:transition-none ${FOCUS_RING}`}
        >
          {seeAllLabel}
        </Link>
      )}
    </div>
  );
}
