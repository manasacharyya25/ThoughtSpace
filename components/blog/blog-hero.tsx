"use client";

import { BLOG_CATEGORIES } from "@/types/blog";
import type { BlogCategoryId } from "@/types/blog";
import { cn } from "@/lib/utils";

type BlogHeroProps = {
  activeCategory: BlogCategoryId;
  onCategoryChange: (category: BlogCategoryId) => void;
};

export function BlogHero({ activeCategory, onCategoryChange }: BlogHeroProps) {
  return (
    <section className="mx-auto max-w-4xl px-4 pb-12 pt-6 text-center sm:px-6 sm:pb-16 sm:pt-10">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#2F9CFA]/20 bg-white px-4 py-2 text-[0.65rem] font-extrabold uppercase tracking-[1.2px] text-[#2F9CFA] shadow-[0_4px_12px_rgba(47,156,250,0.08)]">
        <span aria-hidden="true">✦</span>
        ThoughtSpace Insights
        <span aria-hidden="true">✦</span>
      </div>

      <h1 className="text-[clamp(2rem,5vw,3.25rem)] font-extrabold leading-[1.08] tracking-[-2px] text-[#1C1D1E]">
        Ideas for{" "}
        <span className="text-[#2F9CFA]">Deeper Connection</span>
      </h1>

      <p className="mx-auto mt-4 max-w-2xl text-[15px] font-medium leading-relaxed text-[#1C1D1E]/60 sm:text-base">
        Essays on anonymity, conversation, and building social spaces that put
        people before profiles.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
        {BLOG_CATEGORIES.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              "rounded-full border px-4 py-2 text-[0.7rem] font-bold transition-all sm:text-xs",
              activeCategory === category.id
                ? "border-[#1C1D1E] bg-[#1C1D1E] text-white shadow-[0_8px_24px_-4px_rgba(28,29,30,0.2)]"
                : "border-[#1C1D1E]/10 bg-white text-[#1C1D1E]/65 hover:border-[#2F9CFA]/30 hover:text-[#2F9CFA]"
            )}
          >
            {category.label}
          </button>
        ))}
      </div>
    </section>
  );
}
