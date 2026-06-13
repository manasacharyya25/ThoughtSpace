"use client";

import { useEffect, useRef, type Dispatch, type SetStateAction } from "react";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { mapInboxMessage } from "@/lib/conversation-mapper";
import { applyIncomingMessage, reorderConversations } from "@/lib/inbox-realtime";
import { createClient } from "@/lib/supabase/client";
import { getConversationById } from "@/lib/supabase/conversations";
import {
  playMessageNotification,
  playPendingNotification,
} from "@/lib/notification-sound";
import type { ActiveConversation, PendingResponse } from "@/types/inbox";
import type { ConversationRow, MessageRow } from "@/types/conversation";
import type { ResponseRow } from "@/types/response";

interface UseRealtimeInboxOptions {
  userId: string | null | undefined;
  activeId: string | null;
  setConversations: Dispatch<SetStateAction<ActiveConversation[]>>;
  setPending: Dispatch<SetStateAction<PendingResponse[]>>;
  setReadAt: Dispatch<SetStateAction<Record<string, string>>>;
  refreshPending: () => Promise<void>;
  refreshConversations: () => Promise<void>;
}

export function useRealtimeInbox({
  userId,
  activeId,
  setConversations,
  setPending,
  setReadAt,
  refreshPending,
  refreshConversations,
}: UseRealtimeInboxOptions) {
  const activeIdRef = useRef(activeId);
  activeIdRef.current = activeId;

  const refreshPendingRef = useRef(refreshPending);
  refreshPendingRef.current = refreshPending;

  const refreshConversationsRef = useRef(refreshConversations);
  refreshConversationsRef.current = refreshConversations;

  const userIdRef = useRef(userId);
  userIdRef.current = userId;

  useEffect(() => {
    if (!userId) return;

    const supabase = createClient();

    const handleMessageInsert = (
      payload: RealtimePostgresChangesPayload<{ [key: string]: unknown }>
    ) => {
      const uid = userIdRef.current;
      if (!uid || payload.eventType !== "INSERT") return;

      const row = payload.new as unknown as MessageRow;
      const message = mapInboxMessage(row, uid);
      const conversationId = row.conversation_id;
      const isIncoming = row.sender_id !== uid;
      const isActiveChat = activeIdRef.current === conversationId;

      setConversations((prev) => {
        const next = applyIncomingMessage(prev, conversationId, message);
        if (!next) {
          void refreshConversationsRef.current();
          return prev;
        }
        return next;
      });

      if (isActiveChat) {
        setReadAt((prev) => ({
          ...prev,
          [conversationId]: message.createdAt,
        }));
      } else if (isIncoming) {
        playMessageNotification();
      }
    };

    const handleConversationInsert = async (
      payload: RealtimePostgresChangesPayload<{ [key: string]: unknown }>
    ) => {
      const uid = userIdRef.current;
      if (!uid || payload.eventType !== "INSERT") return;

      const row = payload.new as unknown as ConversationRow;
      if (row.author_id !== uid && row.responder_id !== uid) return;

      const { data } = await getConversationById(supabase, row.id, uid);
      if (!data) return;

      setConversations((prev) => {
        if (prev.some((c) => c.id === data.id)) return prev;
        return reorderConversations([data, ...prev]);
      });
    };

    const handleResponseInsert = (
      payload: RealtimePostgresChangesPayload<{ [key: string]: unknown }>
    ) => {
      const uid = userIdRef.current;
      if (!uid || payload.eventType !== "INSERT") return;

      const row = payload.new as unknown as ResponseRow;
      if (row.responder_id === uid) return;

      playPendingNotification();
      void refreshPendingRef.current();
    };

    const handleResponseUpdate = (
      payload: RealtimePostgresChangesPayload<{ [key: string]: unknown }>
    ) => {
      if (payload.eventType !== "UPDATE") return;

      const row = payload.new as unknown as ResponseRow;
      if (row.status === "pending") return;

      setPending((prev) => prev.filter((p) => p.id !== row.id));
    };

    const channel = supabase
      .channel(`inbox:${userId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        handleMessageInsert
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "conversations" },
        handleConversationInsert
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "responses" },
        handleResponseInsert
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "responses" },
        handleResponseUpdate
      )
      .subscribe((status) => {
        if (status === "TIMED_OUT" || status === "CHANNEL_ERROR") {
          void refreshPendingRef.current();
          void refreshConversationsRef.current();
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, setConversations, setPending, setReadAt]);
}
