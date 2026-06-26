"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { PostAuthorAvatar } from "@/components/feed/post-author-avatar";
import type { BoardParticipant } from "@/types/board";

interface BoardParticipantsSidebarProps {
  myUsername: string | null;
  participants: BoardParticipant[];
  currentUserId: string | undefined;
}

export function BoardParticipantsSidebar({
  myUsername,
  participants,
  currentUserId,
}: BoardParticipantsSidebarProps) {
  const [query, setQuery] = useState("");

  const filteredParticipants = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return participants;
    return participants.filter((participant) =>
      participant.username.toLowerCase().includes(search)
    );
  }, [participants, query]);

  return (
    <aside className="whisper-card hidden h-full min-h-0 flex-col overflow-hidden rounded-[20px] border border-[#1C1D1E]/[0.03] bg-white lg:flex">
      {myUsername ? (
        <div className="border-b border-[#2F9CFA]/15 bg-[#EBF5FF] p-4">
          <div className="flex items-center gap-3">
            <PostAuthorAvatar
              name={myUsername}
              size={36}
              className="ring-2 ring-[#2F9CFA]"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold text-[#1C1D1E]">
                @{myUsername}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wide text-[#2F9CFA]/80">
                In the room
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        <p className="px-2 pb-2 text-[10px] font-extrabold uppercase tracking-[1.2px] text-[#1C1D1E]/40">
          Available now
          <span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#2F9CFA] px-1 text-[9px] font-bold text-white">
            {participants.length}
          </span>
        </p>

        <div className="space-y-1">
          {filteredParticipants.length === 0 ? (
            <p className="px-2 py-4 text-xs font-medium italic text-landing-muted">
              No one else here yet.
            </p>
          ) : (
            filteredParticipants.map((participant) => (
              <div
                key={participant.userId}
                className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-[#FAF8F5]"
              >
                <PostAuthorAvatar name={participant.username} size={36} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-[#1C1D1E]">
                    @{participant.username}
                    {participant.userId === currentUserId ? (
                      <span className="ml-1 font-medium text-[#2F9CFA]">
                        (you)
                      </span>
                    ) : null}
                  </p>
                </div>
                <span
                  className="size-2 shrink-0 rounded-full bg-[#2F9CFA] ring-2 ring-[#EBF5FF]"
                  aria-label="Online"
                />
              </div>
            ))
          )}
        </div>
      </div>

      <div className="border-t border-[#1C1D1E]/[0.06] bg-[#FAF8F5]/60 p-4">
        <label className="relative block">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#1C1D1E]/35"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search people…"
            className="h-10 w-full rounded-xl border border-[#1C1D1E]/[0.06] bg-[#EDF0F1] py-2 pl-9 pr-3 text-xs font-medium text-[#1C1D1E] outline-none placeholder:text-[#1C1D1E]/35 focus:border-[#2F9CFA] focus:bg-white focus:ring-4 focus:ring-[#2F9CFA]/10"
          />
        </label>
      </div>
    </aside>
  );
}
