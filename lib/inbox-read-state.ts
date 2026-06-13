import type { ActiveConversation } from "@/types/inbox";

const READ_AT_KEY = "spaces:inbox:readAt";
const SEEN_PENDING_KEY = "spaces:inbox:seenPending";

function storageKey(prefix: string, userId: string) {
  return `${prefix}:${userId}`;
}

export function loadReadAt(userId: string): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(storageKey(READ_AT_KEY, userId));
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, string>;
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

export function saveReadAt(userId: string, readAt: Record<string, string>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      storageKey(READ_AT_KEY, userId),
      JSON.stringify(readAt)
    );
  } catch {
    // ignore quota errors
  }
}

export function loadSeenPendingIds(userId: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(storageKey(SEEN_PENDING_KEY, userId));
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as string[];
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

export function saveSeenPendingIds(userId: string, ids: Set<string>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      storageKey(SEEN_PENDING_KEY, userId),
      JSON.stringify([...ids])
    );
  } catch {
    // ignore quota errors
  }
}

export function getConversationReadTimestamp(
  conv: ActiveConversation
): string {
  const lastMessage = conv.messages.at(-1);
  return lastMessage?.createdAt ?? conv.lastMessageAt;
}

export function isTimestampUnread(
  lastActivityAt: string,
  lastReadAt: string | undefined
): boolean {
  if (!lastReadAt) return true;
  return (
    new Date(lastActivityAt).getTime() > new Date(lastReadAt).getTime()
  );
}

export function isConversationUnreadState(
  conv: ActiveConversation,
  readAt: Record<string, string>
): boolean {
  const lastMessage = conv.messages.at(-1);
  if (lastMessage?.isFromMe) return false;

  const activityAt =
    lastMessage?.createdAt ?? conv.lastMessageAt;
  return isTimestampUnread(activityAt, readAt[conv.id]);
}
