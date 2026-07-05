"use client";

import Link from "next/link";
import { format } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { getMarkerTypeLabel } from "@/lib/reflect/marker-labels";
import { createClient } from "@/lib/supabase/client";
import { listMarkers, toggleMarkerCompleted } from "@/lib/supabase/journal";
import { cn } from "@/lib/utils";
import type { JournalMarkerType, JournalMarkerWithSession } from "@/types/journal";
import { JOURNAL_MARKER_TYPES } from "@/types/journal";

export function ReflectMarkersList() {
  const [markers, setMarkers] = useState<JournalMarkerWithSession[]>([]);
  const [filter, setFilter] = useState<JournalMarkerType | "all">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMarkers = useCallback(async (type?: JournalMarkerType) => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be signed in to view markers.");
      setMarkers([]);
      setLoading(false);
      return;
    }

    const { data, error: fetchError } = await listMarkers(
      supabase,
      user.id,
      type
    );

    if (fetchError) {
      setError(fetchError.message);
      setMarkers([]);
    } else {
      setMarkers(data);
      setError(null);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    setLoading(true);
    void loadMarkers(filter === "all" ? undefined : filter);
  }, [filter, loadMarkers]);

  const handleToggleTodo = async (marker: JournalMarkerWithSession) => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const nextCompleted = !marker.completed;
    const { error: toggleError } = await toggleMarkerCompleted(
      supabase,
      user.id,
      marker.id,
      nextCompleted
    );

    if (toggleError) {
      setError(toggleError.message);
      return;
    }

    setMarkers((current) =>
      current.map((item) =>
        item.id === marker.id ? { ...item, completed: nextCompleted } : item
      )
    );
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
            filter === "all"
              ? "bg-[#2F9CFA]/12 text-[#2F9CFA]"
              : "bg-white/80 text-[#1C1D1E]/50 hover:text-[#1C1D1E]/75"
          )}
        >
          All
        </button>
        {JOURNAL_MARKER_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setFilter(type)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
              filter === type
                ? cn("marker-pill", `marker-pill--${type}`)
                : "bg-white/80 text-[#1C1D1E]/50 hover:text-[#1C1D1E]/75"
            )}
          >
            {getMarkerTypeLabel(type)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-20 animate-pulse rounded-2xl bg-[#EDF0F1]/80"
            />
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-rose-600">{error}</p>
      ) : markers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#1C1D1E]/10 bg-white/60 px-4 py-10 text-center text-sm text-[#1C1D1E]/50">
          No markers yet. Select text while journaling to capture insights, todos,
          and more.
        </div>
      ) : (
        <ul className="space-y-3">
          {markers.map((marker) => (
            <li key={marker.id}>
              <div className="rounded-2xl border border-[#1C1D1E]/[0.06] bg-white/85 px-4 py-4">
                <div className="flex items-start gap-3">
                  {marker.type === "todo" ? (
                    <input
                      type="checkbox"
                      checked={marker.completed}
                      onChange={() => void handleToggleTodo(marker)}
                      className="mt-1 h-4 w-4 rounded border-[#1C1D1E]/20 text-[#2F9CFA] focus:ring-[#2F9CFA]"
                      aria-label={`Mark todo as ${marker.completed ? "incomplete" : "complete"}`}
                    />
                  ) : null}
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "marker-pill",
                          `marker-pill--${marker.type}`
                        )}
                      >
                        {getMarkerTypeLabel(marker.type)}
                      </span>
                      <span className="text-xs text-[#1C1D1E]/40">
                        {format(new Date(marker.sessionStartedAt), "MMM d, h:mm a")}
                      </span>
                    </div>
                    <p
                      className={cn(
                        "text-sm leading-relaxed text-[#1C1D1E]/80",
                        marker.completed && "line-through opacity-60"
                      )}
                    >
                      {marker.text}
                    </p>
                    <Link
                      href={`/reflect/${marker.sessionId}`}
                      className="mt-2 inline-block text-xs font-semibold text-[#2F9CFA] hover:underline"
                    >
                      View session
                    </Link>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
