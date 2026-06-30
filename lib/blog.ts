import { BLOG_POSTS } from "@/data/blog-posts-static";
import { createPublicClient } from "@/lib/supabase/public";
import {
  getPublishedBlogPostBySlug,
  listPublishedBlogPosts,
  listPublishedBlogPostsByPillar,
  listPublishedBlogSlugs,
} from "@/lib/supabase/blog";
import type { BlogCategoryId, BlogPost } from "@/types/blog";

export const BLOG_PILLAR_SLUGS = [
  "anonymous-chat",
  "omegle-alternative",
  "make-friends-online",
] as const;

function filterStaticPosts(category: BlogCategoryId = "all"): BlogPost[] {
  if (category === "all") return BLOG_POSTS;
  return BLOG_POSTS.filter((post) => post.categoryId === category);
}

export async function getBlogPosts(
  category: BlogCategoryId = "all"
): Promise<BlogPost[]> {
  const supabase = createPublicClient();
  const dbCategory = category === "all" ? undefined : category;
  const { data, error } = await listPublishedBlogPosts(supabase, dbCategory);

  if (error || data.length === 0) {
    return filterStaticPosts(category);
  }

  return data;
}

export async function getBlogPost(slug: string): Promise<BlogPost | undefined> {
  const supabase = createPublicClient();
  const { data, error } = await getPublishedBlogPostBySlug(supabase, slug);

  if (error || !data) {
    return BLOG_POSTS.find((post) => post.slug === slug);
  }

  return data;
}

export async function getBlogSlugs(): Promise<string[]> {
  const supabase = createPublicClient();
  const { data, error } = await listPublishedBlogSlugs(supabase);

  if (error || data.length === 0) {
    return BLOG_POSTS.map((post) => post.slug);
  }

  return data;
}

export async function getBlogPostsByPillar(
  pillarSlug: string
): Promise<BlogPost[]> {
  const supabase = createPublicClient();
  const { data, error } = await listPublishedBlogPostsByPillar(
    supabase,
    pillarSlug
  );

  if (error || data.length === 0) {
    return BLOG_POSTS.filter((post) => post.pillarSlug === pillarSlug);
  }

  return data;
}
