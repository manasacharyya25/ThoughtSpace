import type { BlogPost } from "@/types/blog";
import type { BlogPostRow } from "@/types/blog-row";

function formatReadTime(minutes: number | null): string {
  if (!minutes || minutes < 1) return "5 min read";
  return `${minutes} min read`;
}

function parseContent(content: string): string[] {
  return content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function mapBlogPostImage(row: BlogPostRow): BlogPost["image"] {
  return {
    src: row.image_url,
    alt: row.image_alt,
    accent: row.image_accent,
    label: row.image_label ?? "",
    ...(row.image_credit
      ? {
          credit: row.image_credit,
          ...(row.image_credit_url ? { creditUrl: row.image_credit_url } : {}),
        }
      : {}),
  };
}

export function mapBlogPostRow(row: BlogPostRow): BlogPost {
  const contentFormat = row.content_format ?? "plain";
  const paragraphs = parseContent(row.content);
  const image = mapBlogPostImage(row);

  if (contentFormat === "tiptap" && row.content_json) {
    return {
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt,
      category: row.category_label,
      categoryId: row.category_id,
      pillarSlug: row.pillar_slug ?? undefined,
      publishedAt: row.published_at ?? row.created_at,
      readTime: formatReadTime(row.read_time_minutes),
      featured: row.featured,
      image,
      contentFormat: "tiptap",
      contentJson: row.content_json,
      content: paragraphs,
    };
  }

  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category_label,
    categoryId: row.category_id,
    pillarSlug: row.pillar_slug ?? undefined,
    publishedAt: row.published_at ?? row.created_at,
    readTime: formatReadTime(row.read_time_minutes),
    featured: row.featured,
    image,
    contentFormat: "plain",
    contentJson: null,
    content: paragraphs,
  };
}

export function blogPostToInsert(post: BlogPost): {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image_url: string;
  image_alt: string;
  image_accent: string;
  image_label: string | null;
  category_id: BlogPost["categoryId"];
  category_label: string;
  pillar_slug: string | null;
  status: "published";
  featured: boolean;
  read_time_minutes: number | null;
  published_at: string;
} {
  const readMinutes = Number.parseInt(post.readTime, 10);

  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content.join("\n\n"),
    image_url: post.image.src,
    image_alt: post.image.alt,
    image_accent: post.image.accent,
    image_label: post.image.label || null,
    category_id: post.categoryId,
    category_label: post.category,
    pillar_slug: post.pillarSlug ?? null,
    status: "published",
    featured: post.featured,
    read_time_minutes: Number.isFinite(readMinutes) ? readMinutes : null,
    published_at: new Date(post.publishedAt).toISOString(),
  };
}
