import Link from "next/link";

type StreamingPlayButtonProps = {
  href: string;
  label?: string;
  className?: string;
};

export function StreamingPlayButton({
  href,
  label = "Play",
  className = "",
}: StreamingPlayButtonProps) {
  return (
    <Link
      href={href}
      className={`sacred-glow flex w-full items-center justify-center rounded-full border border-amber-500/40 bg-amber-500/20 py-5 font-serif text-xl tracking-widest text-amber-200 transition-all duration-700 ease-in-out hover:bg-amber-500/30 motion-reduce:transition-none lg:text-2xl ${className}`}
    >
      {label}
    </Link>
  );
}
