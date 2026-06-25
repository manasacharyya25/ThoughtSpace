import type { RealtimePresenceState } from "@supabase/supabase-js";
import type { BoardParticipant, BoardPresenceMeta } from "@/types/board";

export function parseBoardPresence(
  state: RealtimePresenceState<BoardPresenceMeta>
): BoardParticipant[] {
  const participants = new Map<string, BoardParticipant>();

  for (const presences of Object.values(state)) {
    for (const presence of presences) {
      if (!presence.userId || !presence.username) continue;
      participants.set(presence.userId, {
        userId: presence.userId,
        username: presence.username,
      });
    }
  }

  return Array.from(participants.values()).sort((a, b) =>
    a.username.localeCompare(b.username)
  );
}
