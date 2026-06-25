"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { parseBoardPresence } from "@/lib/board/presence";
import { DEFAULT_BOARD_ROOM_SLUG } from "@/lib/board/constants";
import { mapBoardMessageRow } from "@/lib/board-mapper";
import { createClient } from "@/lib/supabase/client";
import {
  getBoardRoomBySlug,
  listBoardMessages,
  listBoardRooms,
  sendBoardMessage,
} from "@/lib/supabase/board";
import { getProfileByUserId } from "@/lib/supabase/profiles";
import type {
  BoardMessage,
  BoardMessageRow,
  BoardParticipant,
  BoardPresenceMeta,
  BoardRoom,
} from "@/types/board";
import { useUser } from "@/hooks/use-user";

export function useBoardChat() {
  const { user } = useUser();
  const [rooms, setRooms] = useState<BoardRoom[]>([]);
  const [room, setRoom] = useState<BoardRoom | null>(null);
  const [messages, setMessages] = useState<BoardMessage[]>([]);
  const [participants, setParticipants] = useState<BoardParticipant[]>([]);
  const [myUsername, setMyUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userIdRef = useRef(user?.id);
  userIdRef.current = user?.id;

  const myUsernameRef = useRef(myUsername);
  myUsernameRef.current = myUsername;

  const loadMessages = useCallback(async (boardRoom: BoardRoom, userId: string) => {
    const supabase = createClient();
    const { data, error: messagesError } = await listBoardMessages(
      supabase,
      boardRoom.id,
      userId
    );

    if (messagesError) {
      setError(messagesError.message);
      setMessages([]);
      return;
    }

    setMessages(data);
    setError(null);
  }, []);

  const selectRoom = useCallback(
    async (slug: string) => {
      const userId = userIdRef.current;
      if (!userId) return;

      const supabase = createClient();
      const { data: boardRoom, error: roomError } = await getBoardRoomBySlug(
        supabase,
        slug
      );

      if (roomError || !boardRoom) {
        setError(roomError?.message ?? "Room not found.");
        return;
      }

      setRoom(boardRoom);
      await loadMessages(boardRoom, userId);
    },
    [loadMessages]
  );

  const refresh = useCallback(async () => {
    const userId = userIdRef.current;
    if (!userId) {
      setRooms([]);
      setRoom(null);
      setMessages([]);
      setParticipants([]);
      setMyUsername(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const supabase = createClient();

    const [profile, roomsResult] = await Promise.all([
      getProfileByUserId(supabase, userId),
      listBoardRooms(supabase),
    ]);

    setMyUsername(profile?.username ?? null);

    if (roomsResult.error) {
      setError(roomsResult.error.message);
      setRooms([]);
      setRoom(null);
      setMessages([]);
      setLoading(false);
      return;
    }

    setRooms(roomsResult.data);

    const defaultRoom =
      roomsResult.data.find((item) => item.slug === DEFAULT_BOARD_ROOM_SLUG) ??
      roomsResult.data[0] ??
      null;

    if (!defaultRoom) {
      setError("Live room is unavailable.");
      setRoom(null);
      setMessages([]);
      setLoading(false);
      return;
    }

    setRoom(defaultRoom);
    await loadMessages(defaultRoom, userId);
    setLoading(false);
  }, [loadMessages]);

  useEffect(() => {
    void refresh();
  }, [refresh, user?.id]);

  useEffect(() => {
    if (!room?.id || !user?.id || !myUsername) return;

    const supabase = createClient();
    const roomId = room.id;
    const username = myUsername;

    const syncPresence = (channel: ReturnType<typeof supabase.channel>) => {
      const state = channel.presenceState<BoardPresenceMeta>();
      setParticipants(parseBoardPresence(state));
    };

    const handleInsert = async (
      payload: RealtimePostgresChangesPayload<{ [key: string]: unknown }>
    ) => {
      const uid = userIdRef.current;
      if (!uid || payload.eventType !== "INSERT") return;

      const row = payload.new as unknown as BoardMessageRow;
      if (row.room_id !== roomId) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", row.sender_id)
        .maybeSingle();

      const message = mapBoardMessageRow(
        row,
        profile?.username ?? "anonymous",
        uid
      );

      setMessages((current) => {
        if (current.some((item) => item.id === message.id)) return current;
        return [...current, message];
      });
    };

    const channel = supabase.channel(`board:${roomId}`, {
      config: { presence: { key: user.id } },
    });

    channel
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "board_messages",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          void handleInsert(payload);
        }
      )
      .on("presence", { event: "sync" }, () => syncPresence(channel))
      .on("presence", { event: "join" }, () => syncPresence(channel))
      .on("presence", { event: "leave" }, () => syncPresence(channel))
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            userId: user.id,
            username,
          });
          syncPresence(channel);
        }
      });

    return () => {
      void channel.untrack();
      supabase.removeChannel(channel);
    };
  }, [myUsername, room?.id, user?.id]);

  const sendMessage = useCallback(
    async (content: string) => {
      const userId = userIdRef.current;
      if (!userId || !room?.id) {
        return { error: new Error("You must be signed in to chat.") };
      }

      const supabase = createClient();
      const { data, error: sendError } = await sendBoardMessage(
        supabase,
        room.id,
        userId,
        content
      );

      if (sendError || !data) {
        return { error: sendError ?? new Error("Could not send message.") };
      }

      setMessages((current) => {
        if (current.some((item) => item.id === data.id)) return current;
        return [...current, data];
      });

      return { error: null };
    },
    [room?.id]
  );

  return {
    rooms,
    room,
    messages,
    participants,
    myUsername,
    loading,
    error,
    selectRoom,
    sendMessage,
    refresh,
  };
}
