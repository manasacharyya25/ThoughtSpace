"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useInbox } from "@/context/inbox-context";
import { useTrial } from "@/context/trial-context";
import { createClient } from "@/lib/supabase/client";
import { setInboxChatGateFlag } from "@/lib/trial/storage";
import { getConversationById } from "@/lib/supabase/conversations";
import { useUser } from "@/hooks/use-user";
import type { ActiveConversation } from "@/types/inbox";
import { ChatWindow } from "./chat-window";

export function InboxChatPage() {
  const router = useRouter();
  const params = useParams();
  const conversationId = params.conversationId as string;
  const { user } = useUser();
  const { isGuest } = useTrial();
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
    if (!isGuest) return;
    setInboxChatGateFlag();
    router.replace("/inbox");
  }, [isGuest, router]);

  useEffect(() => {
    if (isGuest || !conversationId || !conversation) return;
    markConversationRead(conversationId, conversation);
  }, [conversation, conversationId, isGuest, markConversationRead]);

  useEffect(() => {
    if (isGuest || !conversationId || !user || conversation || conversationsLoading) {
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
  }, [conversation, conversationId, conversationsLoading, isGuest, user]);

  useEffect(() => {
    if (isGuest || !fetchError) return;
    router.replace("/inbox");
  }, [fetchError, isGuest, router]);

  const handleBack = () => {
    if (conversation) {
      markConversationRead(conversationId, conversation);
    }
    router.push("/inbox");
  };

  if (isGuest) {
    return null;
  }

  if (fetching || conversationsLoading || !conversation) {
    return (
      <div className="inbox-chat mx-auto flex w-full max-w-2xl flex-1 items-center justify-center">
        <p className="text-sm text-[#a1a1aa]">Loading conversation…</p>
      </div>
    );
  }

  return (
    <div className="inbox-chat mx-auto w-full max-w-2xl flex-1">
      <ChatWindow
        conversation={conversation}
        conversationId={conversationId}
        onBack={handleBack}
      />
    </div>
  );
}
