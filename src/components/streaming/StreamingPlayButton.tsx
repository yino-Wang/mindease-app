import Link from "next/link";

type StreamingPlayButtonProps = {
  href: string;
  label?: string;
};

export function StreamingPlayButton({
  href,
  label = "Play",
}: StreamingPlayButtonProps) {
  return (
    <Link
      href={href}
      className="sacred-glow flex w-full max-w-md items-center justify-center rounded-full border border-amber-500/40 bg-amber-500/20 py-4 font-serif text-lg tracking-widest text-amber-200 transition-all duration-700 ease-in-out hover:bg-amber-500/30 motion-reduce:transition-none"
    >
      {label}
    </Link>
  );
}
