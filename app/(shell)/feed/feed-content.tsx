"use client";

import { FeedList } from "@/components/feed";
import { PageHeader } from "@/components/layout/page-header";
import { usePosts } from "@/context/posts-context";

export function FeedContent() {
  const { posts } = usePosts();

  return (
    <div className="mx-auto w-full max-w-2xl">
      <PageHeader
        title="Feed"
        description="Thoughts worth responding to — no faces, no metrics, just minds."
      />
      <FeedList posts={posts} />
    </div>
  );
}
