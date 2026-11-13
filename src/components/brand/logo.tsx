import Link from "next/link";
import { cn } from "@/lib/utils";

export function BrandMark({
  className,
  tone = "brand",
}: {
  className?: string;
  tone?: "brand" | "onDark" | "onLight";
}) {
  const gold = "#c9a35a";
  const tile = tone === "onDark" ? "rgba(255,255,255,0.12)" : tone === "onLight" ? "rgba(19,30,38,0.06)" : "#131e26";
  const door = tone === "onLight" ? "#ffffff" : "#131e26";

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-9 shrink-0", className)}
      aria-hidden
    >
      <rect width="64" height="64" rx="16" fill={tile} />
      <path
        fill={gold}
        d="M32 12.5L50 26.2V28H46.5V49.5H38.5V36.5H25.5V49.5H17.5V28H14V26.2L32 12.5Z"
      />
      <path
        fill={door}
        d="M32 34.5c-3.2 0-5.2 2-5.2 5.2V49.5h10.4V39.7c0-3.2-2-5.2-5.2-5.2Z"
      />
      <circle cx="32" cy="41.2" r="1.1" fill={gold} />
    </svg>
  );
}

export function BrandLogo({
  href = "/",
  className,
  markClassName,
  wordmark = true,
  tone = "brand",
  size = "md",
}: {
  href?: string | null;
  className?: string;
  markClassName?: string;
  wordmark?: boolean;
  tone?: "brand" | "onDark" | "onLight";
  size?: "sm" | "md" | "lg";
}) {
  const markSize =
    size === "sm" ? "size-8" : size === "lg" ? "size-11" : "size-9";
  const textSize =
    size === "sm"
      ? "text-lg"
      : size === "lg"
        ? "text-2xl"
        : "text-xl";

  const content = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <BrandMark className={cn(markSize, markClassName)} tone={tone} />
      {wordmark && (
        <span
          className={cn(
            "font-display font-semibold tracking-tight",
            textSize,
            tone === "onDark" && "text-white"
          )}
        >
          Dar<span className="text-gold">Estate</span>
        </span>
      )}
    </span>
  );

  if (!href) return content;
  return (
    <Link href={href} className="inline-flex items-center" aria-label="DarEstate — Accueil">
      {content}
    </Link>
  );
}
