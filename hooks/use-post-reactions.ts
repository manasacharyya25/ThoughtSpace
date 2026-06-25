"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { summarizePostReactions } from "@/lib/post-reaction-mapper";
import { createClient } from "@/lib/supabase/client";
import {
  listReactionsForPosts,
  togglePostReaction,
} from "@/lib/supabase/post-reactions";
import type { PostReaction, PostReactionSummary } from "@/types/post-reaction";
import { useUser } from "@/hooks/use-user";

const EMPTY_SUMMARY: PostReactionSummary = { emojis: [], userEmoji: null };

export function usePostReactions(postIds: string[]) {
  const { user } = useUser();
  const [reactions, setReactions] = useState<PostReaction[]>([]);
  const [loading, setLoading] = useState(false);

  const postIdsKey = useMemo(
    () => [...new Set(postIds)].sort().join(","),
    [postIds]
  );

  const refresh = useCallback(async () => {
    const ids = postIdsKey ? postIdsKey.split(",") : [];
    if (ids.length === 0) {
      setReactions([]);
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { data, error } = await listReactionsForPosts(supabase, ids);
    if (!error) {
      setReactions(data);
    }
    setLoading(false);
  }, [postIdsKey]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const summaries = useMemo(
    () => summarizePostReactions(reactions, user?.id),
    [reactions, user?.id]
  );

  const getSummary = useCallback(
    (postId: string): PostReactionSummary =>
      summaries.get(postId) ?? EMPTY_SUMMARY,
    [summaries]
  );

  const toggleReaction = useCallback(
    async (postId: string, emoji: string) => {
      if (!user?.id) return;

      const previous = reactions;
      const current = getSummary(postId);
      const optimistic: PostReaction[] = reactions.filter(
        (reaction) =>
          !(reaction.postId === postId && reaction.userId === user.id)
      );

      if (current.userEmoji === emoji) {
        setReactions(optimistic);
      } else {
        const existing = reactions.find(
          (reaction) =>
            reaction.postId === postId && reaction.userId === user.id
        );
        setReactions([
          ...optimistic,
          {
            id: existing?.id ?? `optimistic-${postId}`,
            postId,
            userId: user.id,
            emoji,
            createdAt: existing?.createdAt ?? new Date().toISOString(),
          },
        ]);
      }

      const supabase = createClient();
      const { data, error, removed } = await togglePostReaction(
        supabase,
        postId,
        user.id,
        emoji
      );

      if (error) {
        setReactions(previous);
        return;
      }

      setReactions((currentReactions) => {
        const withoutUser = currentReactions.filter(
          (reaction) =>
            !(reaction.postId === postId && reaction.userId === user.id)
        );

        if (removed || !data) {
          return withoutUser;
        }

        return [...withoutUser, data];
      });
    },
    [getSummary, reactions, user?.id]
  );

  return {
    loading,
    getSummary,
    toggleReaction,
    refresh,
  };
}
