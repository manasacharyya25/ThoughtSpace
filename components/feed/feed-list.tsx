import type { Post } from "@/types/post";
import { FeedCard } from "./feed-card";

interface FeedListProps {
  posts: Post[];
}

export function FeedList({ posts }: FeedListProps) {
  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      {posts.map((post, index) => (
        <FeedCard key={post.id} post={post} index={index} />
      ))}
    </div>
  );
}
