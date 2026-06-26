import { normalizeCategory } from "@/lib/category";
import type { Post, PostAuthorPreview, PostRow } from "@/types/post";

function normalizeAuthor(
  author: PostRow["author"]
): PostAuthorPreview | null {
  if (!author) return null;

  const row = Array.isArray(author) ? author[0] : author;
  if (!row?.username) return null;

  return {
    username: row.username,
    gender: row.gender,
    gender_custom: row.gender_custom,
  };
}

export function mapPostRow(row: PostRow): Post {
  return {
    id: row.id,
    author_id: row.author_id,
    content: row.content,
    category: row.category,
    timestamp: row.created_at,
    response_count: row.response_count ?? 0,
    author: normalizeAuthor(row.author),
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
