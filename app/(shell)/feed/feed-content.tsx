"use client";

import { useMemo } from "react";
import { FeedList } from "@/components/feed";
import { PageHeader } from "@/components/layout/page-header";
import { FadeIn } from "@/components/ui/fade-in";
import { usePosts } from "@/context/posts-context";
import { useResponses } from "@/context/responses-context";
import { useUser } from "@/hooks/use-user";
import { sortFeedForUser } from "@/lib/feed-sort";

export function FeedContent() {
  const { posts, loading, error } = usePosts();
  const { hasResponded } = useResponses();
  const { user } = useUser();

  const sortedPosts = useMemo(
    () => sortFeedForUser(posts, hasResponded, user?.id),
    [posts, hasResponded, user?.id]
  );

  return (
    <div className="mx-auto w-full max-w-2xl">
      <FadeIn index={0}>
        <PageHeader
          title="Feed"
          description="Thoughts worth responding to — no faces, no metrics, just minds."
        />
      </FadeIn>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading feed…</p>
      ) : error ? (
        <p className="text-sm text-red-400">{error}</p>
      ) : sortedPosts.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground/60">
          No thoughts yet. Be the first to share something meaningful.
        </p>
      ) : (
        <FeedList posts={sortedPosts} />
      )}
    </div>
  );
}
