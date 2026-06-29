import Link from "next/link";
import { getBlogPostsByPillar } from "@/data/blog-posts";

type SeoRelatedArticlesProps = {
  pillarSlug: string;
  pillarTitle: string;
};

export function SeoRelatedArticles({
  pillarSlug,
  pillarTitle,
}: SeoRelatedArticlesProps) {
  const posts = getBlogPostsByPillar(pillarSlug);
  if (posts.length === 0) return null;

  return (
    <section
      aria-labelledby="related-articles"
      className="relative border-t border-[#1C1D1E]/[0.06] px-5 py-16 sm:px-8 sm:py-24"
    >
      <div className="relative mx-auto max-w-4xl">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#1C1D1E]/[0.05] bg-white px-4 py-2 text-[0.65rem] font-extrabold uppercase tracking-[1.4px] text-[#1C1D1E]/55 shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
          <span className="text-[#2F9CFA]">✦</span>
          From the blog
          <span className="text-[#2F9CFA]">✦</span>
        </div>

        <h2
          id="related-articles"
          className="text-[clamp(1.5rem,3.5vw,2rem)] font-extrabold leading-tight tracking-[-1.5px] text-[#1C1D1E]"
        >
          More on{" "}
          <span className="text-[#2F9CFA]">{pillarTitle}</span>
        </h2>

        <ul className="mt-8 divide-y divide-[#1C1D1E]/[0.06]">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex flex-col gap-1 py-5 no-underline sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="text-base font-extrabold text-[#1C1D1E] transition-colors group-hover:text-[#2F9CFA] sm:text-lg">
                  {post.title}
                </span>
                <span className="shrink-0 text-xs font-semibold text-[#1C1D1E]/40">
                  {post.readTime}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-6">
          <Link
            href="/blog"
            className="text-xs font-bold uppercase tracking-wider text-[#2F9CFA] transition-colors hover:text-[#1C1D1E]"
          >
            View all articles →
          </Link>
        </div>
      </div>
    </section>
  );
}
