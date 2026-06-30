"use client";

import { useMemo, useState } from "react";
import type { BlogCategoryId, BlogPost } from "@/types/blog";import { BlogArticleList } from "./blog-article-list";
import { BlogHero } from "./blog-hero";
import { BlogNav } from "./blog-nav";
import { LandingFooter } from "@/components/landing/landing-footer";

export function BlogPageContent({ initialPosts }: { initialPosts: BlogPost[] }) {
  const [activeCategory, setActiveCategory] = useState<BlogCategoryId>("all");
  const posts = useMemo(() => {
    if (activeCategory === "all") return initialPosts;
    return initialPosts.filter((post) => post.categoryId === activeCategory);
  }, [activeCategory, initialPosts]);

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
