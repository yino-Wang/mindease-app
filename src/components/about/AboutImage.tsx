import Image from "next/image";

type AboutImageProps = {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
};

export function AboutImage({
  src,
  alt,
  priority = false,
  className = "object-cover",
  sizes = "100vw",
}: AboutImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      unoptimized
      sizes={sizes}
      className={className}
    />
  );
}
