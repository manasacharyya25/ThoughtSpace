import Image from "next/image";
import type { BlogPost } from "@/types/blog";
import { cn } from "@/lib/utils";

type BlogPostImageProps = {
  post: BlogPost;
  variant?: "card" | "hero";
  className?: string;
};

export function BlogPostImage({
  post,
  variant = "card",
  className,
}: BlogPostImageProps) {
  const isHero = variant === "hero";
  const credit = post.image.credit?.trim();

  return (
    <figure className={className}>
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-[24px] shadow-[0_24px_48px_-12px_rgba(28,29,30,0.1)]",
          isHero ? "aspect-[21/9] rounded-[28px]" : "aspect-[4/3] sm:aspect-[5/4] sm:max-w-[280px]"
        )}
      >
        <Image
          src={post.image.src}
          alt={post.image.alt}
          fill
          className="object-cover"
          sizes={isHero ? "(max-width: 768px) 100vw, 768px" : "(max-width: 768px) 100vw, 280px"}
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1C1D1E]/25 via-transparent to-transparent"
          aria-hidden="true"
        />
        <div
          className={cn(
            "absolute bottom-4 left-4 rounded-full px-3 py-1 text-[0.6rem] font-extrabold uppercase tracking-wider text-white",
            post.image.accent,
            isHero && "bottom-5 left-5 px-4 py-1.5 text-[0.65rem]"
          )}
        >
          {post.image.label}
        </div>
      </div>

      {isHero && credit ? (
        <figcaption className="mt-2.5 text-right text-xs font-medium text-[#1C1D1E]/45">
          Photo Credit:{" "}
          {post.image.creditUrl ? (
            <a
              href={post.image.creditUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2F9CFA] underline decoration-[#2F9CFA]/30 underline-offset-2 transition-colors hover:text-[#1C1D1E] hover:decoration-[#1C1D1E]/30"
            >
              {credit}
            </a>
          ) : (
            <span>{credit}</span>
          )}
        </figcaption>
      ) : null}
    </figure>
  );
}
