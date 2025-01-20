import Image from "next/image";

export function ImdbImage({
  width,
  height,
  poster,
  alt,
  className,
}: { width: number; height: number; poster?: string | null; alt: string; className?: string }) {
  const src = poster ? `https://image.tmdb.org/t/p/w${width}${poster}` : "/images/placeholder.jpg";
  return <Image src={src} alt={alt} width={width} height={height} className={className} />;
}
