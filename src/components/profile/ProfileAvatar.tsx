import Image from "next/image";

type ProfileAvatarProps = {
  avatarUrl: string | null;
  initials: string;
  size?: "md" | "lg";
};

const sizeClasses = {
  md: "h-20 w-20 text-lg",
  lg: "h-28 w-28 text-2xl",
};

export function ProfileAvatar({
  avatarUrl,
  initials,
  size = "md",
}: ProfileAvatarProps) {
  const className = `sacred-glow relative shrink-0 overflow-hidden rounded-full border border-stone-800/80 bg-stone-900/60 ${sizeClasses[size]}`;

  if (avatarUrl) {
    return (
      <div className={className}>
        <Image
          src={avatarUrl}
          alt=""
          fill
          unoptimized
          className="object-cover"
          sizes={size === "lg" ? "112px" : "80px"}
        />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center font-semibold tracking-widest text-amber-400/90 ${className}`}
    >
      {initials}
    </div>
  );
}
