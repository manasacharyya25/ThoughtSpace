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
  content: string[];
};

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
