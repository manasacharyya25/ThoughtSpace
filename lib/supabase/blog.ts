import type { SupabaseClient } from "@supabase/supabase-js";
import { mapBlogPostRow } from "@/lib/blog-mapper";
import type { BlogCategoryId, BlogPost } from "@/types/blog";
import type { BlogPostRow } from "@/types/blog-row";

const BLOG_POST_SELECT = `
  id,
  slug,
  title,
  excerpt,
  content,
  image_url,
  image_alt,
  image_accent,
  image_label,
  category_id,
  category_label,
  pillar_slug,
  status,
  featured,
  read_time_minutes,
  published_at,
  created_at,
  updated_at
`;

export async function listPublishedBlogPosts(
  supabase: SupabaseClient,
  category?: Exclude<BlogCategoryId, "all">
): Promise<{ data: BlogPost[]; error: Error | null }> {
  let query = supabase
    .from("blog_posts")
    .select(BLOG_POST_SELECT)
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (category) {
    query = query.eq("category_id", category);
  }

  const { data, error } = await query;

  if (error) {
    return { data: [], error: new Error(error.message) };
  }

  return {
    data: (data as BlogPostRow[]).map(mapBlogPostRow),
    error: null,
  };
}

export async function getPublishedBlogPostBySlug(
  supabase: SupabaseClient,
  slug: string
): Promise<{ data: BlogPost | null; error: Error | null }> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select(BLOG_POST_SELECT)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  if (!data) {
    return { data: null, error: null };
  }

  return { data: mapBlogPostRow(data as BlogPostRow), error: null };
}

export async function listPublishedBlogSlugs(
  supabase: SupabaseClient
): Promise<{ data: string[]; error: Error | null }> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("slug")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    return { data: [], error: new Error(error.message) };
  }

  return {
    data: (data ?? []).map((row) => row.slug as string),
    error: null,
  };
}

export async function listPublishedBlogPostsByPillar(
  supabase: SupabaseClient,
  pillarSlug: string
): Promise<{ data: BlogPost[]; error: Error | null }> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select(BLOG_POST_SELECT)
    .eq("status", "published")
    .eq("pillar_slug", pillarSlug)
    .order("published_at", { ascending: false });

  if (error) {
    return { data: [], error: new Error(error.message) };
  }

  return {
    data: (data as BlogPostRow[]).map(mapBlogPostRow),
    error: null,
  };
}
