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
  setActiveId: (id: string | null) => void;
  acceptPending: (pendingId: string) => void;
  sendMessage: (conversationId: string, content: string) => void;
  activeConversation: ActiveConversation | null;
}

const InboxContext = createContext<InboxContextValue | null>(null);

export function InboxProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<PendingResponse[]>(pendingResponses);
  const [conversations, setConversations] =
    useState<ActiveConversation[]>(activeConversations);
  const [activeId, setActiveId] = useState<string | null>(null);

  const acceptPending = useCallback((pendingId: string) => {
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
  }, [pending]);

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
    },
    []
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
      setActiveId,
      acceptPending,
      sendMessage,
      activeConversation,
    }),
    [
      pending,
      conversations,
      activeId,
      acceptPending,
      sendMessage,
      activeConversation,
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
