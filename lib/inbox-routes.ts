export function getInboxConversationId(pathname: string): string | null {
  const match = pathname.match(/^\/inbox\/([^/]+)$/);
  return match?.[1] ?? null;
}

export function isInboxChatRoute(pathname: string): boolean {
  return getInboxConversationId(pathname) !== null;
}

export function inboxConversationPath(conversationId: string): string {
  return `/inbox/${conversationId}`;
}
