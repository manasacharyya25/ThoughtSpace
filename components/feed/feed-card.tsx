import { formatRelativeTime } from "@/lib/time";
import { cn } from "@/lib/utils";
import type { Post } from "@/types/post";
import { CategoryBadge } from "./category-badge";
import { RespondButton } from "./respond-button";

interface FeedCardProps {
  post: Post;
  index?: number;
}

export function FeedCard({ post, index = 0 }: FeedCardProps) {
  return (
    <article
      className={cn("feed-card feed-card-animate group")}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-start justify-between gap-4">
        <CategoryBadge category={post.category} />
        <time
          dateTime={post.timestamp}
          className="shrink-0 text-[11px] text-muted-foreground/60 transition-colors group-hover:text-muted-foreground"
        >
          {formatRelativeTime(post.timestamp)}
        </time>
      </div>

      <p className="mt-4 text-[15px] leading-[1.7] text-foreground/90 transition-colors group-hover:text-foreground">
        {post.content}
      </p>

      <div className="mt-6 flex items-center justify-end border-t border-border/40 pt-4">
        <RespondButton post={post} />
      </div>
    </article>
  );
}
