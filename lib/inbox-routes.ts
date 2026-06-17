export function getInboxConversationId(pathname: string): string | null {
  const match = pathname.match(/^\/inbox\/([^/]+)$/);
  if (!match) return null;
  if (match[1] === "accept") return null;
  return match[1];
}

export function getInboxAcceptPendingId(pathname: string): string | null {
  const match = pathname.match(/^\/inbox\/accept\/([^/]+)$/);
  return match?.[1] ?? null;
}

export function isInboxAcceptRoute(pathname: string): boolean {
  return getInboxAcceptPendingId(pathname) !== null;
}

export function isInboxChatRoute(pathname: string): boolean {
  return getInboxConversationId(pathname) !== null || isInboxAcceptRoute(pathname);
}

export function inboxConversationPath(conversationId: string): string {
  return `/inbox/${conversationId}`;
}

export function inboxAcceptPath(pendingId: string): string {
  return `/inbox/accept/${pendingId}`;
}
