"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  createConversationFromResponse,
  listConversations,
  sendMessage as sendMessageToDb,
} from "@/lib/supabase/conversations";
import {
  getInboxConversationId,
  inboxConversationPath,
} from "@/lib/inbox-routes";
import { acceptResponse, listPendingForAuthor } from "@/lib/supabase/responses";
import { useRealtimeInbox } from "@/hooks/use-realtime-inbox";
import { useUser } from "@/hooks/use-user";
import type {
  ActiveConversation,
  PendingResponse,
} from "@/types/inbox";

interface InboxContextValue {
  pending: PendingResponse[];
  pendingLoading: boolean;
  pendingError: string | null;
  conversations: ActiveConversation[];
  conversationsLoading: boolean;
  conversationsError: string | null;
  activeConversationId: string | null;
  openConversation: (id: string) => void;
  markConversationRead: (id: string) => void;
  acceptPending: (pendingId: string) => Promise<void>;
  sendMessage: (conversationId: string, content: string) => Promise<void>;
  isConversationUnread: (id: string) => boolean;
  hasUnread: boolean;
  refreshPending: () => Promise<void>;
  refreshConversations: () => Promise<void>;
}

const InboxContext = createContext<InboxContextValue | null>(null);

export function InboxProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();
  const [pending, setPending] = useState<PendingResponse[]>([]);
  const [pendingLoading, setPendingLoading] = useState(true);
  const [pendingError, setPendingError] = useState<string | null>(null);
  const [conversations, setConversations] = useState<ActiveConversation[]>([]);
  const [conversationsLoading, setConversationsLoading] = useState(true);
  const [conversationsError, setConversationsError] = useState<string | null>(
    null
  );
  const [readAt, setReadAt] = useState<Record<string, string>>({});

  const activeConversationId = useMemo(
    () => getInboxConversationId(pathname),
    [pathname]
  );

  const refreshPending = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      setPending([]);
      setPendingError(null);
      return;
    }

    const { data, error } = await listPendingForAuthor(supabase, authUser.id);

    if (error) {
      setPendingError(error.message);
      return;
    }

    setPending(data);
    setPendingError(null);
  }, []);

  const refreshConversations = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      setConversations([]);
      setConversationsError(null);
      return;
    }

    const { data, error } = await listConversations(supabase, authUser.id);

    if (error) {
      setConversationsError(error.message);
      return;
    }

    setConversations(data);
    setConversationsError(null);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setPendingLoading(true);
      setConversationsLoading(true);

      const supabase = createClient();
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        if (!cancelled) {
          setPending([]);
          setConversations([]);
          setPendingLoading(false);
          setConversationsLoading(false);
        }
        return;
      }

      const [pendingResult, conversationsResult] = await Promise.all([
        listPendingForAuthor(supabase, authUser.id),
        listConversations(supabase, authUser.id),
      ]);

      if (cancelled) return;

      if (pendingResult.error) {
        setPendingError(pendingResult.error.message);
        setPending([]);
      } else {
        setPending(pendingResult.data);
        setPendingError(null);
      }

      if (conversationsResult.error) {
        setConversationsError(conversationsResult.error.message);
        setConversations([]);
      } else {
        setConversations(conversationsResult.data);
        setConversationsError(null);
      }

      setPendingLoading(false);
      setConversationsLoading(false);
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  useRealtimeInbox({
    userId: user?.id,
    activeId: activeConversationId,
    setConversations,
    setPending,
    setReadAt,
    refreshPending,
    refreshConversations,
  });

  const markConversationRead = useCallback(
    (conversationId: string, at?: string) => {
      const conv = conversations.find((c) => c.id === conversationId);
      const timestamp = at ?? conv?.lastMessageAt ?? new Date().toISOString();
      setReadAt((prev) => ({ ...prev, [conversationId]: timestamp }));
    },
    [conversations]
  );

  const openConversation = useCallback(
    (id: string) => {
      markConversationRead(id);
      router.push(inboxConversationPath(id));
    },
    [markConversationRead, router]
  );

  const acceptPending = useCallback(
    async (pendingId: string) => {
      const supabase = createClient();
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) return;

      const { error: acceptError } = await acceptResponse(supabase, pendingId);

      if (acceptError) {
        setPendingError(acceptError.message);
        return;
      }

      const { data: conversation, error: conversationError } =
        await createConversationFromResponse(supabase, pendingId, authUser.id);

      if (conversationError || !conversation) {
        setPendingError(
          conversationError?.message ?? "Could not start conversation."
        );
        return;
      }

      setPending((prev) => prev.filter((p) => p.id !== pendingId));
      setConversations((prev) => [
        conversation,
        ...prev.filter((c) => c.id !== conversation.id),
      ]);
      markConversationRead(conversation.id);
      setPendingError(null);
      setConversationsError(null);
      router.push(inboxConversationPath(conversation.id));
    },
    [markConversationRead, router]
  );

  const sendMessage = useCallback(
    async (conversationId: string, content: string) => {
      const trimmed = content.trim();
      if (!trimmed) return;

      const supabase = createClient();
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) return;

      const { data: message, error } = await sendMessageToDb(
        supabase,
        conversationId,
        authUser.id,
        trimmed
      );

      if (error || !message) {
        setConversationsError(error?.message ?? "Could not send message.");
        return;
      }

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId
            ? {
                ...conv,
                messages: [...conv.messages, message],
                lastMessageAt: message.createdAt,
              }
            : conv
        )
      );

      if (activeConversationId === conversationId) {
        setReadAt((prev) => ({
          ...prev,
          [conversationId]: message.createdAt,
        }));
      }
      setConversationsError(null);
    },
    [activeConversationId]
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

  const value = useMemo(
    () => ({
      pending,
      pendingLoading,
      pendingError,
      conversations,
      conversationsLoading,
      conversationsError,
      activeConversationId,
      openConversation,
      markConversationRead,
      acceptPending,
      sendMessage,
      isConversationUnread,
      hasUnread,
      refreshPending,
      refreshConversations,
    }),
    [
      pending,
      pendingLoading,
      pendingError,
      conversations,
      conversationsLoading,
      conversationsError,
      activeConversationId,
      openConversation,
      markConversationRead,
      acceptPending,
      sendMessage,
      isConversationUnread,
      hasUnread,
      refreshPending,
      refreshConversations,
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
