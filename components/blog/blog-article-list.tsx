"use client";

import Link from "next/link";
import type { BlogPost } from "@/types/blog";
import { BlogPostImage } from "./blog-post-image";

function BlogArticleRow({ post }: { post: BlogPost }) {
  return (
    <article className="group border-b border-[#1C1D1E]/[0.06] py-10 first:pt-0 last:border-b-0">
      <Link
        href={`/blog/${post.slug}`}
        className="grid gap-8 no-underline sm:grid-cols-[1fr_280px] sm:items-center"
      >
        <div className="space-y-4 text-left">
          <div className="flex items-center gap-2 text-[0.65rem] font-extrabold uppercase tracking-[1px] text-[#2F9CFA]">
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

          <h2 className="text-[clamp(1.25rem,2.5vw,1.75rem)] font-extrabold leading-tight tracking-[-0.5px] text-[#1C1D1E] transition-colors group-hover:text-[#2F9CFA]">
            {post.title}
          </h2>

          <p className="max-w-xl text-sm font-medium leading-relaxed text-[#1C1D1E]/60 sm:text-[15px]">
            {post.excerpt}
          </p>

          <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[#1C1D1E]/40">
            {new Intl.DateTimeFormat("en", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }).format(new Date(post.publishedAt))}{" "}
            · {post.readTime}
          </p>
        </div>

        <BlogPostImage post={post} />
      </Link>
    </article>
  );
}

type BlogArticleListProps = {
  posts: BlogPost[];
};

export function BlogArticleList({ posts }: BlogArticleListProps) {
  return (
    <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6 sm:pb-28">
      <div className="mb-8 flex items-baseline gap-2">
        <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-extrabold tracking-[-1px] text-[#1C1D1E]">
          Our latest articles
        </h2>
        <span className="text-sm font-bold text-[#1C1D1E]/35">
          [{posts.length}]
        </span>
      </div>

      {posts.length === 0 ? (
        <p className="rounded-[20px] border border-[#1C1D1E]/[0.06] bg-white px-6 py-12 text-center text-sm font-medium text-[#1C1D1E]/55">
          No articles in this category yet.
        </p>
      ) : (
        <div>
          {posts.map((post) => (
            <BlogArticleRow key={post.slug} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}
