"use client";

import { useMemo, useState } from "react";
import { getBlogPosts } from "@/data/blog-posts";
import type { BlogCategoryId } from "@/types/blog";
import { BlogArticleList } from "./blog-article-list";
import { BlogHero } from "./blog-hero";
import { BlogNav } from "./blog-nav";
import { LandingFooter } from "@/components/landing/landing-footer";

export function BlogPageContent() {
  const [activeCategory, setActiveCategory] = useState<BlogCategoryId>("all");
  const posts = useMemo(
    () => getBlogPosts(activeCategory),
    [activeCategory]
  );

  return (
    <>
      <BlogNav />
      <main>
        <BlogHero
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
        <BlogArticleList posts={posts} />
      </main>
      <div className="mx-auto max-w-5xl px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-6">
        <LandingFooter />
      </div>
    </>
  );
}
