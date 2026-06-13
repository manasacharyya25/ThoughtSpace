"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useInbox } from "@/context/inbox-context";
import { createClient } from "@/lib/supabase/client";
import { getConversationById } from "@/lib/supabase/conversations";
import { useUser } from "@/hooks/use-user";
import type { ActiveConversation } from "@/types/inbox";
import { ChatWindow } from "./chat-window";

export function InboxChatPage() {
  const router = useRouter();
  const params = useParams();
  const conversationId = params.conversationId as string;
  const { user } = useUser();
  const { conversations, conversationsLoading, markConversationRead } =
    useInbox();
  const [fetchedConversation, setFetchedConversation] =
    useState<ActiveConversation | null>(null);
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const conversation = useMemo(
    () =>
      conversations.find((c) => c.id === conversationId) ?? fetchedConversation,
    [conversations, conversationId, fetchedConversation]
  );

  useEffect(() => {
    if (!conversationId || !conversation) return;
    markConversationRead(conversationId, conversation);
  }, [conversationId, conversation, markConversationRead]);

  useEffect(() => {
    if (!conversationId || !user || conversation || conversationsLoading) {
      return;
    }

    let cancelled = false;

    const load = async () => {
      setFetching(true);
      setFetchError(null);

      const supabase = createClient();
      const { data, error } = await getConversationById(
        supabase,
        conversationId,
        user.id
      );

      if (cancelled) return;

      if (error || !data) {
        setFetchError(error?.message ?? "Conversation not found.");
        setFetching(false);
        return;
      }

      setFetchedConversation(data);
      setFetching(false);
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [conversation, conversationId, conversationsLoading, user]);

  useEffect(() => {
    if (!fetchError) return;
    router.replace("/inbox");
  }, [fetchError, router]);

  const handleBack = () => {
    if (conversation) {
      markConversationRead(conversationId, conversation);
    }
    router.push("/inbox");
  };

  if (fetching || conversationsLoading || !conversation) {
    return (
      <div className="flex h-full min-h-0 items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading conversation…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-2xl flex-col overflow-hidden bg-background">
      <ChatWindow
        conversation={conversation}
        conversationId={conversationId}
        onBack={handleBack}
      />
    </div>
  );
}
