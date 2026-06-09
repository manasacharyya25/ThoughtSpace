import { cn } from "@/lib/utils";
import type { ChatThread } from "@/types";

interface ThreadListProps {
  threads: ChatThread[];
  activeId?: string;
  onSelect?: (id: string) => void;
}

function formatRelative(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function ThreadList({ threads, activeId, onSelect }: ThreadListProps) {
  return (
    <div className="space-y-1">
      {threads.map((thread) => {
        const lastMessage = thread.messages[thread.messages.length - 1];
        return (
          <button
            key={thread.id}
            type="button"
            onClick={() => onSelect?.(thread.id)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg border px-3 py-3 text-left transition-colors",
              activeId === thread.id
                ? "border-border bg-muted"
                : "border-transparent hover:bg-muted"
            )}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-xs font-medium">
              {thread.participant.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-medium">
                  {thread.participant.name}
                </p>
                <span className="shrink-0 text-[10px] text-muted-foreground">
                  {formatRelative(thread.lastMessageAt)}
                </span>
              </div>
              <p className="truncate text-xs text-muted-foreground">
                {lastMessage?.content}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
