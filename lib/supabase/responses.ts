import type { SupabaseClient } from "@supabase/supabase-js";
import {
  mapPendingResponseRow,
  mapPrivateResponse,
} from "@/lib/response-mapper";
import type { PendingResponse } from "@/types/inbox";
import type { PrivateResponse, ResponseRow } from "@/types/response";

export function isDuplicateResponseError(
  error: { code?: string } | null
): boolean {
  return error?.code === "23505";
}

function relationContent(
  relation: { content: string } | { content: string }[] | null | undefined
): string {
  if (!relation) return "";
  if (Array.isArray(relation)) return relation[0]?.content ?? "";
  return relation.content;
}

export async function listMyResponses(
  supabase: SupabaseClient,
  userId: string
): Promise<{ data: PrivateResponse[]; error: Error | null }> {
  const { data, error } = await supabase
    .from("responses")
    .select(
      "id, post_id, content, created_at, status, responder_id, posts ( content )"
    )
    .eq("responder_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return { data: [], error: new Error(error.message) };
  }

  const responses = (data ?? []).map((row) =>
    mapPrivateResponse(
      {
        id: row.id,
        post_id: row.post_id,
        responder_id: row.responder_id,
        content: row.content,
        status: row.status as ResponseRow["status"],
        created_at: row.created_at,
      },
      relationContent(row.posts)
    )
  );

  return { data: responses, error: null };
}

export async function createResponse(
  supabase: SupabaseClient,
  postId: string,
  responderId: string,
  content: string
): Promise<{ data: ResponseRow | null; error: Error | null }> {
  const { data, error } = await supabase
    .from("responses")
    .insert({
      post_id: postId,
      responder_id: responderId,
      content: content.trim(),
    })
    .select("*")
    .single();

  if (error) {
    if (isDuplicateResponseError(error)) {
      return {
        data: null,
        error: new Error("You already responded to this thought."),
      };
    }
    return { data: null, error: new Error(error.message) };
  }

  return { data: data as ResponseRow, error: null };
}

export async function listPendingForAuthor(
  supabase: SupabaseClient,
  authorId: string
): Promise<{ data: PendingResponse[]; error: Error | null }> {
  const { data, error } = await supabase
    .from("responses")
    .select(
      `
      id,
      content,
      created_at,
      posts ( id, content, category, author_id ),
      profiles ( username )
    `
    )
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    return { data: [], error: new Error(error.message) };
  }

  const pending = (data ?? [])
    .map((row) => mapPendingResponseRow(row, authorId))
    .filter((item): item is PendingResponse => item !== null);

  return { data: pending, error: null };
}

export async function acceptResponse(
  supabase: SupabaseClient,
  responseId: string
): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from("responses")
    .update({ status: "accepted" })
    .eq("id", responseId)
    .eq("status", "pending");

  if (error) {
    return { error: new Error(error.message) };
  }

  return { error: null };
}
