export type BlogCategoryId =
  | "all"
  | "connection"
  | "philosophy"
  | "privacy"
  | "product";

export type BlogPostImage = {
  src: string;
  alt: string;
  accent: string;
  label: string;
  credit?: string;
  creditUrl?: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categoryId: Exclude<BlogCategoryId, "all">;
  pillarSlug?: string;
  publishedAt: string;
  readTime: string;
  featured: boolean;
  image: BlogPostImage;
  contentFormat: "plain" | "tiptap";
  contentJson?: Record<string, unknown> | null;
  content: string[];
};

/** Static seed data omits format fields; mapped to BlogPost at export. */
export type BlogPostSource = Omit<BlogPost, "contentFormat" | "contentJson">;

export function toBlogPost(post: BlogPostSource): BlogPost {
  return {
    ...post,
    contentFormat: "plain",
    contentJson: null,
  };
}

export const BLOG_CATEGORIES: {
  id: BlogCategoryId;
  label: string;
}[] = [
  { id: "all", label: "All" },
  { id: "connection", label: "Connection" },
  { id: "philosophy", label: "Philosophy" },
  { id: "privacy", label: "Privacy" },
  { id: "product", label: "Product" },
];
