import type {
  PostReaction,
  PostReactionRow,
  PostReactionSummary,
} from "@/types/post-reaction";

export function mapPostReactionRow(row: PostReactionRow): PostReaction {
  return {
    id: row.id,
    postId: row.post_id,
    userId: row.user_id,
    emoji: row.emoji,
    createdAt: row.created_at,
  };
}

export function summarizePostReactions(
  reactions: PostReaction[],
  currentUserId: string | undefined
): Map<string, PostReactionSummary> {
  const byPost = new Map<
    string,
    { emojiOrder: string[]; seen: Set<string>; userEmoji: string | null }
  >();

  for (const reaction of reactions) {
    let entry = byPost.get(reaction.postId);
    if (!entry) {
      entry = { emojiOrder: [], seen: new Set(), userEmoji: null };
      byPost.set(reaction.postId, entry);
    }

    if (!entry.seen.has(reaction.emoji)) {
      entry.seen.add(reaction.emoji);
      entry.emojiOrder.push(reaction.emoji);
    }

    if (currentUserId && reaction.userId === currentUserId) {
      entry.userEmoji = reaction.emoji;
    }
  }

  const summaries = new Map<string, PostReactionSummary>();
  for (const [postId, entry] of byPost) {
    summaries.set(postId, {
      emojis: entry.emojiOrder,
      userEmoji: entry.userEmoji,
    });
  }

  return summaries;
}
