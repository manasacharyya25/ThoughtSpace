import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatRelativeTime } from "@/lib/time";
import { cn } from "@/lib/utils";
import type { Post } from "@/types/post";
import { CategoryBadge } from "./category-badge";

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
        <Link href="/inbox">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground transition-all duration-200 hover:text-foreground group-hover:translate-x-0.5"
          >
            Respond
            <span
              aria-hidden="true"
              className="ml-1 inline-block transition-transform duration-200 group-hover:translate-x-0.5"
            >
              →
            </span>
          </Button>
        </Link>
      </div>
    </article>
  );
}
