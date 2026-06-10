"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { activeConversations, pendingResponses } from "@/data/inbox";
import type {
  ActiveConversation,
  InboxMessage,
  PendingResponse,
} from "@/types/inbox";

interface InboxContextValue {
  pending: PendingResponse[];
  conversations: ActiveConversation[];
  activeId: string | null;
  openConversation: (id: string) => void;
  closeConversation: () => void;
  acceptPending: (pendingId: string) => void;
  sendMessage: (conversationId: string, content: string) => void;
  activeConversation: ActiveConversation | null;
  isConversationUnread: (id: string) => boolean;
  hasUnread: boolean;
  isChatOpen: boolean;
}

const InboxContext = createContext<InboxContextValue | null>(null);

export function InboxProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<PendingResponse[]>(pendingResponses);
  const [conversations, setConversations] =
    useState<ActiveConversation[]>(activeConversations);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [readAt, setReadAt] = useState<Record<string, string>>({});

  const markRead = useCallback(
    (conversationId: string, at?: string) => {
      const conv = conversations.find((c) => c.id === conversationId);
      const timestamp = at ?? conv?.lastMessageAt ?? new Date().toISOString();
      setReadAt((prev) => ({ ...prev, [conversationId]: timestamp }));
    },
    [conversations]
  );

  const openConversation = useCallback(
    (id: string) => {
      setActiveId(id);
      markRead(id);
    },
    [markRead]
  );

  const closeConversation = useCallback(() => {
    setActiveId(null);
  }, []);

  const acceptPending = useCallback(
    (pendingId: string) => {
      const item = pending.find((p) => p.id === pendingId);
      if (!item) return;

      const newConversation: ActiveConversation = {
        id: `conv-${item.id}`,
        partnerInitial: item.fromInitial,
        startedFrom: item.thoughtExcerpt,
        lastMessageAt: item.receivedAt,
        messages: [
          {
            id: `msg-${item.id}`,
            content: item.fullResponse,
            isFromMe: false,
            createdAt: item.receivedAt,
          },
        ],
      };

      setPending((prev) => prev.filter((p) => p.id !== pendingId));
      setConversations((prev) => [newConversation, ...prev]);
      setActiveId(newConversation.id);
      setReadAt((prev) => ({
        ...prev,
        [newConversation.id]: newConversation.lastMessageAt,
      }));
    },
    [pending]
  );

  const sendMessage = useCallback(
    (conversationId: string, content: string) => {
      const trimmed = content.trim();
      if (!trimmed) return;

      const newMessage: InboxMessage = {
        id: `msg-${Date.now()}`,
        content: trimmed,
        isFromMe: true,
        createdAt: new Date().toISOString(),
      };

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId
            ? {
                ...conv,
                messages: [...conv.messages, newMessage],
                lastMessageAt: newMessage.createdAt,
              }
            : conv
        )
      );

      if (activeId === conversationId) {
        setReadAt((prev) => ({
          ...prev,
          [conversationId]: newMessage.createdAt,
        }));
      }
    },
    [activeId]
  );

  const isConversationUnread = useCallback(
    (id: string) => {
      const conv = conversations.find((c) => c.id === id);
      if (!conv) return false;
      const lastRead = readAt[id];
      if (!lastRead) return true;
      return conv.lastMessageAt > lastRead;
    },
    [conversations, readAt]
  );

  const hasUnread = useMemo(
    () =>
      pending.length > 0 ||
      conversations.some((c) => isConversationUnread(c.id)),
    [pending.length, conversations, isConversationUnread]
  );

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeId) ?? null,
    [conversations, activeId]
  );

  const value = useMemo(
    () => ({
      pending,
      conversations,
      activeId,
      openConversation,
      closeConversation,
      acceptPending,
      sendMessage,
      activeConversation,
      isConversationUnread,
      hasUnread,
      isChatOpen: activeId !== null,
    }),
    [
      pending,
      conversations,
      activeId,
      openConversation,
      closeConversation,
      acceptPending,
      sendMessage,
      activeConversation,
      isConversationUnread,
      hasUnread,
    ]
  );

  return (
    <InboxContext.Provider value={value}>{children}</InboxContext.Provider>
  );
}

export function useInbox() {
  const context = useContext(InboxContext);
  if (!context) {
    throw new Error("useInbox must be used within an InboxProvider");
  }
  return context;
}
