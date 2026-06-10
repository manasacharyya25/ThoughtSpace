"use client";

import { FeedList } from "@/components/feed";
import { PageHeader } from "@/components/layout/page-header";
import { FadeIn } from "@/components/ui/fade-in";
import { usePosts } from "@/context/posts-context";

export function FeedContent() {
  const { posts } = usePosts();

  return (
    <div className="mx-auto w-full max-w-2xl">
      <FadeIn index={0}>
        <PageHeader
          title="Feed"
          description="Thoughts worth responding to — no faces, no metrics, just minds."
        />
      </FadeIn>
      <FeedList posts={posts} />
    </div>
  );
}
