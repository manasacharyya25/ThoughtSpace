export const JOURNAL_MARKER_TYPES = [
  "insight",
  "todo",
  "grateful",
  "reminder",
] as const;

export type JournalMarkerType = (typeof JOURNAL_MARKER_TYPES)[number];

export type JournalSessionStatus = "draft" | "completed";

export interface JournalSessionRow {
  id: string;
  user_id: string;
  content_json: Record<string, unknown>;
  plain_text: string | null;
  status: JournalSessionStatus;
  started_at: string;
  ended_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface JournalMarkerRow {
  id: string;
  session_id: string;
  user_id: string;
  type: JournalMarkerType;
  text: string;
  mark_id: string;
  completed: boolean;
  created_at: string;
}

export interface JournalSession {
  id: string;
  userId: string;
  contentJson: Record<string, unknown>;
  plainText: string | null;
  status: JournalSessionStatus;
  startedAt: string;
  endedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface JournalMarker {
  id: string;
  sessionId: string;
  userId: string;
  type: JournalMarkerType;
  text: string;
  markId: string;
  completed: boolean;
  createdAt: string;
}

export interface JournalMarkerWithSession extends JournalMarker {
  sessionStartedAt: string;
}

export type MarkerCountByType = Partial<Record<JournalMarkerType, number>>;

export interface JournalSessionWithMarkerCounts extends JournalSession {
  markerCounts: MarkerCountByType;
}
