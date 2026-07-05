import type { SupabaseClient } from "@supabase/supabase-js";
import { mapActiveConversation, mapInboxMessage } from "@/lib/conversation-mapper";
import type { ActiveConversation, InboxMessage } from "@/types/inbox";
import type { ConversationRow, MessageRow } from "@/types/conversation";

type ProfileJoin = { username: string };
type PostJoin = { content: string };

type ConversationListRow = ConversationRow & {
  posts: PostJoin | PostJoin[] | null;
  author: ProfileJoin | ProfileJoin[] | null;
  responder: ProfileJoin | ProfileJoin[] | null;
  messages: MessageRow[] | null;
};

function relationOne<T>(relation: T | T[] | null | undefined): T | null {
  if (!relation) return null;
  if (Array.isArray(relation)) return relation[0] ?? null;
  return relation;
}

function mapConversationListRow(
  row: ConversationListRow,
  userId: string
): ActiveConversation | null {
  const post = relationOne(row.posts);
  const author = relationOne(row.author);
  const responder = relationOne(row.responder);

  if (!post) return null;

  return mapActiveConversation(
    {
      id: row.id,
      response_id: row.response_id,
      post_id: row.post_id,
      author_id: row.author_id,
      responder_id: row.responder_id,
      created_at: row.created_at,
      last_message_at: row.last_message_at,
    },
    post.content,
    author?.username ?? "",
    responder?.username ?? "",
    row.messages ?? [],
    userId
  );
}

const conversationSelect = `
  id,
  response_id,
  post_id,
  author_id,
  responder_id,
  created_at,
  last_message_at,
  posts ( content ),
  author:profiles!conversations_author_id_fkey ( username ),
  responder:profiles!conversations_responder_id_fkey ( username ),
  messages ( id, conversation_id, sender_id, content, created_at )
`;

export async function getConversationById(
  supabase: SupabaseClient,
  conversationId: string,
  userId: string
): Promise<{ data: ActiveConversation | null; error: Error | null }> {
  const { data, error } = await supabase
    .from("conversations")
    .select(conversationSelect)
    .eq("id", conversationId)
    .maybeSingle();

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  if (!data) {
    return { data: null, error: null };
  }

  return {
    data: mapConversationListRow(data as ConversationListRow, userId),
    error: null,
  };
}

export async function listConversations(
  supabase: SupabaseClient,
  userId: string
): Promise<{ data: ActiveConversation[]; error: Error | null }> {
  const { data, error } = await supabase
    .from("conversations")
    .select(conversationSelect)
    .or(`author_id.eq.${userId},responder_id.eq.${userId}`)
    .order("last_message_at", { ascending: false });

  if (error) {
    return { data: [], error: new Error(error.message) };
  }

  const conversations = (data ?? [])
    .map((row) => mapConversationListRow(row as ConversationListRow, userId))
    .filter((item): item is ActiveConversation => item !== null);

  return { data: conversations, error: null };
}

interface ResponseAcceptRow {
  id: string;
  content: string;
  responder_id: string;
  post_id: string;
  status: string;
  posts: { author_id: string; content: string } | { author_id: string; content: string }[] | null;
}

export async function createConversationFromResponse(
  supabase: SupabaseClient,
  responseId: string,
  authorId: string
): Promise<{ data: ActiveConversation | null; error: Error | null }> {
  const { data: existing } = await supabase
    .from("conversations")
    .select("id")
    .eq("response_id", responseId)
    .maybeSingle();

  if (existing) {
    return getConversationById(supabase, existing.id, authorId);
  }

  const { data: response, error: responseError } = await supabase
    .from("responses")
    .select(
      "id, content, responder_id, post_id, status, posts ( author_id, content )"
    )
    .eq("id", responseId)
    .single();

  if (responseError || !response) {
    return {
      data: null,
      error: new Error(responseError?.message ?? "Response not found."),
    };
  }

  const row = response as ResponseAcceptRow;
  const post = relationOne(row.posts);

  if (!post || post.author_id !== authorId) {
    return { data: null, error: new Error("Not allowed to accept this response.") };
  }

  if (row.status !== "accepted") {
    return { data: null, error: new Error("Response must be accepted first.") };
  }

  const { data: conversation, error: conversationError } = await supabase
    .from("conversations")
    .insert({
      response_id: responseId,
      post_id: row.post_id,
      author_id: post.author_id,
      responder_id: row.responder_id,
    })
    .select(
      `
      id,
      response_id,
      post_id,
      author_id,
      responder_id,
      created_at,
      last_message_at
    `
    )
    .single();

  if (conversationError || !conversation) {
    return {
      data: null,
      error: new Error(conversationError?.message ?? "Could not create conversation."),
    };
  }

  return getConversationById(supabase, conversation.id, authorId);
}

export async function sendMessage(
  supabase: SupabaseClient,
  conversationId: string,
  senderId: string,
  content: string
): Promise<{ data: InboxMessage | null; error: Error | null }> {
  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      content: content.trim(),
    })
    .select("*")
    .single();

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  return {
    data: mapInboxMessage(data as MessageRow, senderId),
    error: null,
  };
}

export async function deleteConversation(
  supabase: SupabaseClient,
  conversationId: string
): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from("conversations")
    .delete()
    .eq("id", conversationId);

  if (error) {
    return { error: new Error(error.message) };
  }

  return { error: null };
}
