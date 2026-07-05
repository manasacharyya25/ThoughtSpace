import type {
  JournalMarker,
  JournalMarkerRow,
  JournalMarkerWithSession,
  JournalSession,
  JournalSessionRow,
} from "@/types/journal";

export function mapJournalSessionRow(row: JournalSessionRow): JournalSession {
  return {
    id: row.id,
    userId: row.user_id,
    contentJson: row.content_json,
    plainText: row.plain_text,
    status: row.status,
    startedAt: row.started_at,
    endedAt: row.ended_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapJournalMarkerRow(row: JournalMarkerRow): JournalMarker {
  return {
    id: row.id,
    sessionId: row.session_id,
    userId: row.user_id,
    type: row.type,
    text: row.text,
    markId: row.mark_id,
    completed: row.completed,
    createdAt: row.created_at,
  };
}

export function mapJournalMarkerWithSessionRow(
  row: JournalMarkerRow & {
    session?: { started_at: string } | { started_at: string }[] | null;
  }
): JournalMarkerWithSession {
  const session = Array.isArray(row.session) ? row.session[0] : row.session;

  return {
    ...mapJournalMarkerRow(row),
    sessionStartedAt: session?.started_at ?? row.created_at,
  };
}
