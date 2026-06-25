export interface BoardRoomRow {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface BoardMessageRow {
  id: string;
  room_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export interface BoardRoom {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  createdAt: string;
}

export interface BoardMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderUsername: string;
  content: string;
  createdAt: string;
  isFromMe: boolean;
}

export interface BoardParticipant {
  userId: string;
  username: string;
}

export interface BoardPresenceMeta {
  userId: string;
  username: string;
}
