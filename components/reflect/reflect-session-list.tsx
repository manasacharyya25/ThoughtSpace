"use client";

import Link from "next/link";
import { format, isToday, isYesterday } from "date-fns";
import { getMarkerTypeLabel } from "@/lib/reflect/marker-labels";
import { cn } from "@/lib/utils";
import type {
  JournalSessionWithMarkerCounts,
  MarkerCountByType,
} from "@/types/journal";
import { JOURNAL_MARKER_TYPES } from "@/types/journal";

interface ReflectSessionListProps {
  sessions: JournalSessionWithMarkerCounts[];
}

function formatDayLabel(date: Date) {
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "EEEE, MMM d");
}

function formatSessionTime(iso: string) {
  return format(new Date(iso), "h:mm a");
}

function MarkerCountPills({ counts }: { counts: MarkerCountByType }) {
  const entries = JOURNAL_MARKER_TYPES.flatMap((type) => {
    const count = counts[type];
    if (!count) return [];
    return [{ type, count }];
  });

  if (entries.length === 0) return null;

  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {entries.map(({ type, count }) => (
        <span
          key={type}
          className={cn("marker-pill", `marker-pill--${type}`)}
        >
          {getMarkerTypeLabel(type)} {count}
        </span>
      ))}
    </div>
  );
}

function groupSessionsByDay(sessions: JournalSessionWithMarkerCounts[]) {
  const groups = new Map<string, JournalSessionWithMarkerCounts[]>();

  for (const session of sessions) {
    const dayKey = format(new Date(session.startedAt), "yyyy-MM-dd");
    const existing = groups.get(dayKey) ?? [];
    existing.push(session);
    groups.set(dayKey, existing);
  }

  return Array.from(groups.entries()).map(([dayKey, daySessions]) => ({
    dayKey,
    label: formatDayLabel(new Date(dayKey)),
    sessions: daySessions,
  }));
}

export function ReflectSessionList({ sessions }: ReflectSessionListProps) {
  if (sessions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#1C1D1E]/10 bg-white/60 px-4 py-10 text-center">
        <p className="text-sm font-medium text-[#1C1D1E]/70">
          No reflection sessions yet.
        </p>
        <p className="mt-1 text-sm text-[#1C1D1E]/45">
          Start a new session to capture your thoughts.
        </p>
      </div>
    );
  }

  const grouped = groupSessionsByDay(sessions);

  return (
    <div className="space-y-6">
      {grouped.map((group) => (
        <section key={group.dayKey}>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#1C1D1E]/40">
            {group.label}
          </h2>
          <ul className="space-y-3">
            {group.sessions.map((session) => (
              <li key={session.id}>
                <Link
                  href={`/reflect/${session.id}`}
                  className="block rounded-2xl border border-[#1C1D1E]/[0.06] bg-white/85 px-4 py-4 transition-colors hover:border-[#2F9CFA]/20 hover:bg-white"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[#1C1D1E]">
                        {formatSessionTime(session.startedAt)}
                      </p>
                      <p className="mt-1 text-xs text-[#1C1D1E]/45">
                        {session.status === "draft"
                          ? "Draft in progress"
                          : session.endedAt
                            ? `Finished ${formatSessionTime(session.endedAt)}`
                            : "Completed"}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide",
                        session.status === "draft"
                          ? "bg-amber-500/12 text-amber-700"
                          : "bg-[#2F9CFA]/12 text-[#2F9CFA]"
                      )}
                    >
                      {session.status}
                    </span>
                  </div>
                  <MarkerCountPills counts={session.markerCounts} />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
