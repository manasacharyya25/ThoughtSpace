export interface PostReactionRow {
  id: string;
  post_id: string;
  user_id: string;
  emoji: string;
  created_at: string;
}

export interface PostReaction {
  id: string;
  postId: string;
  userId: string;
  emoji: string;
  createdAt: string;
}

export interface PostReactionSummary {
  emojis: string[];
  userEmoji: string | null;
}
