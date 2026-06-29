import Link from "next/link";
import type { BlogPost } from "@/types/blog";
import { getSeoLandingPage } from "@/lib/seo-landing";
import { BlogNav } from "./blog-nav";
import { BlogPostCta } from "./blog-post-cta";
import { BlogPostImage } from "./blog-post-image";
import { LandingFooter } from "@/components/landing/landing-footer";

type BlogPostViewProps = {
  post: BlogPost;
};

export function BlogPostView({ post }: BlogPostViewProps) {
  const pillar = post.pillarSlug ? getSeoLandingPage(post.pillarSlug) : undefined;

  return (
    <>
      <BlogNav />
      <article className="mx-auto max-w-3xl px-4 pb-16 pt-6 sm:px-6 sm:pb-24 sm:pt-10">
        <Link
          href="/blog"
          className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1C1D1E]/45 transition-colors hover:text-[#2F9CFA]"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back to blog
        </Link>

        {pillar && (
          <Link
            href={`/${pillar.slug}`}
            className="mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2F9CFA]/70 transition-colors hover:text-[#2F9CFA]"
          >
            ← {pillar.keywordTitle}
          </Link>
        )}

        <div className="mb-8 flex items-center gap-2 text-[0.65rem] font-extrabold uppercase tracking-[1px] text-[#2F9CFA]">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
          {post.category}
        </div>

        <h1 className="text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold leading-[1.1] tracking-[-1.5px] text-[#1C1D1E]">
          {post.title}
        </h1>

        <p className="mt-4 text-sm font-medium text-[#1C1D1E]/45">
          {new Intl.DateTimeFormat("en", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }).format(new Date(post.publishedAt))}{" "}
          · {post.readTime}
        </p>

        <div className="mt-8">
          <BlogPostImage post={post} variant="hero" />
        </div>

        <div className="prose-blog mt-10 space-y-6">
          {post.content.map((paragraph) => (
            <p
              key={paragraph.slice(0, 48)}
              className="text-[15px] font-medium leading-[1.85] text-[#1C1D1E]/72 sm:text-base"
            >
              {paragraph}
            </p>
          ))}
        </div>

        <BlogPostCta />
      </article>

      <div className="mx-auto max-w-3xl px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-6">
        <LandingFooter />
      </div>
    </>
  );
}
