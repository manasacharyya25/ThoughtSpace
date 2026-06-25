import type {
  BoardMessage,
  BoardMessageRow,
  BoardRoom,
  BoardRoomRow,
} from "@/types/board";

function relationOne<T>(relation: T | T[] | null | undefined): T | null {
  if (!relation) return null;
  if (Array.isArray(relation)) return relation[0] ?? null;
  return relation;
}

export function mapBoardRoomRow(row: BoardRoomRow): BoardRoom {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    createdAt: row.created_at,
  };
}

export function mapBoardMessageRow(
  row: BoardMessageRow,
  username: string,
  currentUserId: string
): BoardMessage {
  return {
    id: row.id,
    roomId: row.room_id,
    senderId: row.sender_id,
    senderUsername: username,
    content: row.content,
    createdAt: row.created_at,
    isFromMe: row.sender_id === currentUserId,
  };
}

type BoardMessageListRow = BoardMessageRow & {
  profiles: { username: string } | { username: string }[] | null;
};

export function mapBoardMessageListRow(
  row: BoardMessageListRow,
  currentUserId: string
): BoardMessage {
  const profile = relationOne(row.profiles);
  return mapBoardMessageRow(
    row,
    profile?.username ?? "anonymous",
    currentUserId
  );
}
