import type { Post } from "@/types/post";

export function sortFeedForUser(
  posts: Post[],
  hasResponded: (postId: string) => boolean,
  currentUserId?: string | null
): Post[] {
  return [...posts].sort((a, b) => {
    const aTreatedAsDone =
      hasResponded(a.id) ||
      (currentUserId != null && a.author_id === currentUserId);
    const bTreatedAsDone =
      hasResponded(b.id) ||
      (currentUserId != null && b.author_id === currentUserId);

    if (aTreatedAsDone !== bTreatedAsDone) {
      return aTreatedAsDone ? 1 : -1;
    }

    if (a.response_count !== b.response_count) {
      return a.response_count - b.response_count;
    }

    return (
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  });
}
