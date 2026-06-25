"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import {
  ReactionNotificationToast,
  type ReactionNotification,
} from "@/components/feed/reaction-notification-toast";
import { usePosts } from "@/context/posts-context";
import { useUser } from "@/hooks/use-user";
import { createClient } from "@/lib/supabase/client";
import { getPostById } from "@/lib/supabase/posts";
import type { PostReactionRow } from "@/types/post-reaction";

const WHISPER_PREVIEW_LENGTH = 56;

function truncateWhisper(text: string, maxLength = WHISPER_PREVIEW_LENGTH): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength - 1).trimEnd()}…`;
}

export function ReactionNotifications() {
  const { user } = useUser();
  const { posts } = usePosts();
  const [activeNotification, setActiveNotification] =
    useState<ReactionNotification | null>(null);

  const postsRef = useRef(posts);
  postsRef.current = posts;

  const queueRef = useRef<ReactionNotification[]>([]);
  const showingRef = useRef(false);
  const seenIdsRef = useRef(new Set<string>());

  const showNext = useCallback(() => {
    const next = queueRef.current.shift();
    if (!next) {
      showingRef.current = false;
      setActiveNotification(null);
      return;
    }

    showingRef.current = true;
    setActiveNotification(next);
  }, []);

  const enqueue = useCallback(
    (notification: ReactionNotification) => {
      if (seenIdsRef.current.has(notification.id)) return;
      seenIdsRef.current.add(notification.id);

      queueRef.current.push(notification);
      if (!showingRef.current) {
        showNext();
      }
    },
    [showNext]
  );

  const handleDone = useCallback(() => {
    setActiveNotification(null);
    showingRef.current = false;
    showNext();
  }, [showNext]);

  useEffect(() => {
    if (!user?.id) {
      queueRef.current = [];
      showingRef.current = false;
      setActiveNotification(null);
      return;
    }

    const supabase = createClient();
    const userId = user.id;

    const handleReactionInsert = async (
      payload: RealtimePostgresChangesPayload<{ [key: string]: unknown }>
    ) => {
      if (payload.eventType !== "INSERT") return;

      const row = payload.new as unknown as PostReactionRow;
      if (row.user_id === userId) return;

      let post = postsRef.current.find((item) => item.id === row.post_id);
      if (!post) {
        const { data } = await getPostById(supabase, row.post_id);
        post = data ?? undefined;
      }

      if (!post || post.author_id !== userId) return;

      enqueue({
        id: row.id,
        emoji: row.emoji,
        whisperText: truncateWhisper(post.content),
      });
    };

    const channel = supabase
      .channel(`post-reactions:${userId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "post_reactions" },
        (payload) => {
          void handleReactionInsert(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [enqueue, user?.id]);

  if (!activeNotification) return null;

  return (
    <ReactionNotificationToast
      key={activeNotification.id}
      notification={activeNotification}
      onDone={handleDone}
    />
  );
}
