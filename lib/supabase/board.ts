import type { SupabaseClient } from "@supabase/supabase-js";
import { BOARD_MESSAGE_PAGE_SIZE } from "@/lib/board/constants";
import {
  mapBoardMessageListRow,
  mapBoardMessageRow,
  mapBoardRoomRow,
} from "@/lib/board-mapper";
import type { BoardMessage, BoardMessageRow, BoardRoom } from "@/types/board";

type ProfileJoin = { username: string };

type BoardMessageListRow = BoardMessageRow & {
  profiles: ProfileJoin | ProfileJoin[] | null;
};

function relationOne<T>(relation: T | T[] | null | undefined): T | null {
  if (!relation) return null;
  if (Array.isArray(relation)) return relation[0] ?? null;
  return relation;
}

export async function getBoardRoomBySlug(
  supabase: SupabaseClient,
  slug: string
): Promise<{ data: BoardRoom | null; error: Error | null }> {
  const { data, error } = await supabase
    .from("board_rooms")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  if (!data) {
    return { data: null, error: null };
  }

  return { data: mapBoardRoomRow(data), error: null };
}

export async function listBoardRooms(
  supabase: SupabaseClient
): Promise<{ data: BoardRoom[]; error: Error | null }> {
  const { data, error } = await supabase
    .from("board_rooms")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    return { data: [], error: new Error(error.message) };
  }

  return {
    data: (data ?? []).map(mapBoardRoomRow),
    error: null,
  };
}

export async function listBoardMessages(
  supabase: SupabaseClient,
  roomId: string,
  userId: string,
  limit = BOARD_MESSAGE_PAGE_SIZE
): Promise<{ data: BoardMessage[]; error: Error | null }> {
  const { data, error } = await supabase
    .from("board_messages")
    .select(
      "id, room_id, sender_id, content, created_at, profiles ( username )"
    )
    .eq("room_id", roomId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return { data: [], error: new Error(error.message) };
  }

  const messages = ((data ?? []) as BoardMessageListRow[])
    .map((row) => mapBoardMessageListRow(row, userId))
    .reverse();

  return { data: messages, error: null };
}

export async function sendBoardMessage(
  supabase: SupabaseClient,
  roomId: string,
  senderId: string,
  content: string
): Promise<{ data: BoardMessage | null; error: Error | null }> {
  const { data, error } = await supabase
    .from("board_messages")
    .insert({
      room_id: roomId,
      sender_id: senderId,
      content: content.trim(),
    })
    .select(
      "id, room_id, sender_id, content, created_at, profiles ( username )"
    )
    .single();

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  const row = data as BoardMessageListRow;
  const profile = relationOne(row.profiles);

  return {
    data: mapBoardMessageRow(
      row,
      profile?.username ?? "anonymous",
      senderId
    ),
    error: null,
  };
}
