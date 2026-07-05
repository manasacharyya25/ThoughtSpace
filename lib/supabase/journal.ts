import type { SupabaseClient } from "@supabase/supabase-js";
import { extractMarkersFromDoc } from "@/lib/reflect/extract-markers-from-doc";
import {
  mapJournalMarkerRow,
  mapJournalMarkerWithSessionRow,
  mapJournalSessionRow,
} from "@/lib/journal-mapper";
import type {
  JournalMarker,
  JournalMarkerRow,
  JournalMarkerType,
  JournalMarkerWithSession,
  JournalSession,
  JournalSessionRow,
  JournalSessionWithMarkerCounts,
  MarkerCountByType,
} from "@/types/journal";

const EMPTY_DOC = { type: "doc", content: [] };

async function syncMarkersForSession(
  supabase: SupabaseClient,
  userId: string,
  sessionId: string,
  contentJson: Record<string, unknown>
): Promise<{ error: Error | null }> {
  const extracted = extractMarkersFromDoc(contentJson);

  const { data: existingRows, error: fetchError } = await supabase
    .from("journal_markers")
    .select("*")
    .eq("session_id", sessionId)
    .eq("user_id", userId);

  if (fetchError) {
    return { error: new Error(fetchError.message) };
  }

  const existingByMarkId = new Map(
    (existingRows as JournalMarkerRow[] | null)?.map((row) => [row.mark_id, row]) ??
      []
  );

  for (const marker of extracted) {
    const existing = existingByMarkId.get(marker.markId);

    if (existing) {
      const { error } = await supabase
        .from("journal_markers")
        .update({
          text: marker.text,
          type: marker.type,
        })
        .eq("id", existing.id)
        .eq("user_id", userId);

      if (error) {
        return { error: new Error(error.message) };
      }
    } else {
      const { error } = await supabase.from("journal_markers").insert({
        session_id: sessionId,
        user_id: userId,
        type: marker.type,
        text: marker.text,
        mark_id: marker.markId,
      });

      if (error) {
        return { error: new Error(error.message) };
      }
    }

    existingByMarkId.delete(marker.markId);
  }

  for (const orphan of existingByMarkId.values()) {
    const { error } = await supabase
      .from("journal_markers")
      .delete()
      .eq("id", orphan.id)
      .eq("user_id", userId);

    if (error) {
      return { error: new Error(error.message) };
    }
  }

  return { error: null };
}

function buildMarkerCounts(
  markers: Pick<JournalMarkerRow, "session_id" | "type">[]
): Map<string, MarkerCountByType> {
  const counts = new Map<string, MarkerCountByType>();

  for (const marker of markers) {
    const sessionCounts = counts.get(marker.session_id) ?? {};
    sessionCounts[marker.type] = (sessionCounts[marker.type] ?? 0) + 1;
    counts.set(marker.session_id, sessionCounts);
  }

  return counts;
}

export async function createSession(
  supabase: SupabaseClient,
  userId: string
): Promise<{ data: JournalSession | null; error: Error | null }> {
  const { data, error } = await supabase
    .from("journal_sessions")
    .insert({
      user_id: userId,
      content_json: EMPTY_DOC,
    })
    .select("*")
    .single();

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  return { data: mapJournalSessionRow(data as JournalSessionRow), error: null };
}

export async function getSession(
  supabase: SupabaseClient,
  userId: string,
  sessionId: string
): Promise<{ data: JournalSession | null; error: Error | null }> {
  const { data, error } = await supabase
    .from("journal_sessions")
    .select("*")
    .eq("id", sessionId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  if (!data) {
    return { data: null, error: null };
  }

  return { data: mapJournalSessionRow(data as JournalSessionRow), error: null };
}

export async function listSessions(
  supabase: SupabaseClient,
  userId: string
): Promise<{ data: JournalSessionWithMarkerCounts[]; error: Error | null }> {
  const { data: sessions, error: sessionsError } = await supabase
    .from("journal_sessions")
    .select("*")
    .eq("user_id", userId)
    .order("started_at", { ascending: false });

  if (sessionsError) {
    return { data: [], error: new Error(sessionsError.message) };
  }

  const sessionRows = (sessions as JournalSessionRow[] | null) ?? [];

  if (sessionRows.length === 0) {
    return { data: [], error: null };
  }

  const sessionIds = sessionRows.map((session) => session.id);
  const { data: markers, error: markersError } = await supabase
    .from("journal_markers")
    .select("session_id, type")
    .eq("user_id", userId)
    .in("session_id", sessionIds);

  if (markersError) {
    return { data: [], error: new Error(markersError.message) };
  }

  const markerCounts = buildMarkerCounts(
    (markers as Pick<JournalMarkerRow, "session_id" | "type">[] | null) ?? []
  );

  return {
    data: sessionRows.map((row) => ({
      ...mapJournalSessionRow(row),
      markerCounts: markerCounts.get(row.id) ?? {},
    })),
    error: null,
  };
}

export async function saveSession(
  supabase: SupabaseClient,
  userId: string,
  sessionId: string,
  contentJson: Record<string, unknown>,
  plainText: string
): Promise<{ error: Error | null }> {
  const { error: updateError } = await supabase
    .from("journal_sessions")
    .update({
      content_json: contentJson,
      plain_text: plainText,
      updated_at: new Date().toISOString(),
    })
    .eq("id", sessionId)
    .eq("user_id", userId)
    .eq("status", "draft");

  if (updateError) {
    return { error: new Error(updateError.message) };
  }

  return syncMarkersForSession(supabase, userId, sessionId, contentJson);
}

export async function completeSession(
  supabase: SupabaseClient,
  userId: string,
  sessionId: string,
  contentJson: Record<string, unknown>,
  plainText: string
): Promise<{ data: JournalSession | null; error: Error | null }> {
  const endedAt = new Date().toISOString();

  const { error: saveError } = await saveSession(
    supabase,
    userId,
    sessionId,
    contentJson,
    plainText
  );

  if (saveError) {
    return { data: null, error: saveError };
  }

  const { data, error } = await supabase
    .from("journal_sessions")
    .update({
      status: "completed",
      ended_at: endedAt,
      updated_at: endedAt,
    })
    .eq("id", sessionId)
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  return { data: mapJournalSessionRow(data as JournalSessionRow), error: null };
}

export async function listSessionMarkers(
  supabase: SupabaseClient,
  userId: string,
  sessionId: string
): Promise<{ data: JournalMarker[]; error: Error | null }> {
  const { data, error } = await supabase
    .from("journal_markers")
    .select("*")
    .eq("user_id", userId)
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  if (error) {
    return { data: [], error: new Error(error.message) };
  }

  return {
    data: ((data as JournalMarkerRow[] | null) ?? []).map(mapJournalMarkerRow),
    error: null,
  };
}

export async function listMarkers(
  supabase: SupabaseClient,
  userId: string,
  type?: JournalMarkerType
): Promise<{ data: JournalMarkerWithSession[]; error: Error | null }> {
  let query = supabase
    .from("journal_markers")
    .select("*, session:journal_sessions(started_at)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (type) {
    query = query.eq("type", type);
  }

  const { data, error } = await query;

  if (error) {
    return { data: [], error: new Error(error.message) };
  }

  return {
    data: ((data as (JournalMarkerRow & {
      session?: { started_at: string } | { started_at: string }[] | null;
    })[]) ?? []).map(mapJournalMarkerWithSessionRow),
    error: null,
  };
}

export async function toggleMarkerCompleted(
  supabase: SupabaseClient,
  userId: string,
  markerId: string,
  completed: boolean
): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from("journal_markers")
    .update({ completed })
    .eq("id", markerId)
    .eq("user_id", userId)
    .eq("type", "todo");

  if (error) {
    return { error: new Error(error.message) };
  }

  return { error: null };
}
