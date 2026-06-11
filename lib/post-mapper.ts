import { normalizeCategory } from "@/lib/category";
import type { Post, PostRow } from "@/types/post";

export function mapPostRow(row: PostRow): Post {
  return {
    id: row.id,
    author_id: row.author_id,
    content: row.content,
    category: row.category,
    timestamp: row.created_at,
  };
}

export function toPostInsert(
  authorId: string,
  content: string,
  category: string
) {
  return {
    author_id: authorId,
    content: content.trim(),
    category: normalizeCategory(category),
  };
}
