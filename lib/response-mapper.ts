import type { PendingResponse } from "@/types/inbox";
import type { PrivateResponse, ResponseRow } from "@/types/response";

export function mapPrivateResponse(
  row: ResponseRow,
  postContent: string
): PrivateResponse {
  return {
    id: row.id,
    postId: row.post_id,
    postContent,
    content: row.content,
    createdAt: row.created_at,
  };
}

function truncateText(text: string, maxLen: number): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxLen) return trimmed;
  return `${trimmed.slice(0, maxLen)}…`;
}

function usernameInitial(username: string | null | undefined): string {
  const letter = username?.trim().charAt(0);
  return letter ? letter.toUpperCase() : "?";
}

type PostJoin = {
  content: string;
  category: string;
  author_id: string;
};

type ProfileJoin = {
  username: string;
};

interface PendingResponseJoinRow {
  id: string;
  content: string;
  created_at: string;
  posts: PostJoin | PostJoin[] | null;
  profiles: ProfileJoin | ProfileJoin[] | null;
}

function relationOne<T>(relation: T | T[] | null | undefined): T | null {
  if (!relation) return null;
  if (Array.isArray(relation)) return relation[0] ?? null;
  return relation;
}

export function mapPendingResponseRow(
  row: PendingResponseJoinRow,
  authorId: string
): PendingResponse | null {
  const post = relationOne(row.posts);
  if (!post || post.author_id !== authorId) return null;

  const profile = relationOne(row.profiles);
  const fullResponse = row.content.trim();
  const preview = truncateText(fullResponse, 100);

  return {
    id: row.id,
    fromInitial: usernameInitial(profile?.username),
    thoughtExcerpt: truncateText(post.content, 80),
    responsePreview: preview,
    fullResponse,
    category: post.category,
    receivedAt: row.created_at,
  };
}
