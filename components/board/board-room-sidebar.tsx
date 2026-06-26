"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { COMING_SOON_ROOMS, getBoardRoomAccent } from "@/lib/board/room-accents";
import { cn } from "@/lib/utils";
import type { BoardRoom } from "@/types/board";

interface BoardRoomSidebarProps {
  rooms: BoardRoom[];
  activeRoomId: string | null;
  onSelectRoom: (slug: string) => void;
}

export function BoardRoomSidebar({
  rooms,
  activeRoomId,
  onSelectRoom,
}: BoardRoomSidebarProps) {
  const [query, setQuery] = useState("");

  const filteredRooms = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return rooms;
    return rooms.filter((room) => room.name.toLowerCase().includes(search));
  }, [query, rooms]);

  return (
    <aside className="whisper-card hidden h-full min-h-0 flex-col overflow-hidden rounded-[20px] border border-[#1C1D1E]/[0.03] bg-white lg:flex">
      <div className="border-b border-[#1C1D1E]/[0.06] bg-[#FAF8F5]/60 p-4">
        <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[1.2px] text-[#2F9CFA]">
          Rooms
        </p>
        <label className="relative block">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#1C1D1E]/35"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search room…"
            className="h-10 w-full rounded-xl border border-[#1C1D1E]/[0.06] bg-[#EDF0F1] py-2 pl-9 pr-3 text-xs font-medium text-[#1C1D1E] outline-none placeholder:text-[#1C1D1E]/35 focus:border-[#2F9CFA] focus:bg-white focus:ring-4 focus:ring-[#2F9CFA]/10"
          />
        </label>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        <p className="px-2 pb-2 text-[10px] font-extrabold uppercase tracking-[1.2px] text-[#1C1D1E]/40">
          Your chatrooms
        </p>
        <div className="space-y-1.5">
          {filteredRooms.map((room, index) => {
            const isActive = room.id === activeRoomId;
            const accent = getBoardRoomAccent(index);

            return (
              <button
                key={room.id}
                type="button"
                onClick={() => onSelectRoom(room.slug)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors",
                  isActive
                    ? cn(accent.activeBg, accent.activeBorder, "shadow-sm")
                    : "border-transparent bg-transparent hover:bg-[#EBF5FF]/50"
                )}
              >
                <span
                  className={cn(
                    "size-2.5 shrink-0 rounded-sm",
                    isActive ? accent.dot : "bg-[#1C1D1E]/12"
                  )}
                  aria-hidden="true"
                />
                <span
                  className={cn(
                    "truncate text-xs font-bold",
                    isActive ? "text-[#1C1D1E]" : "text-[#1C1D1E]/65"
                  )}
                >
                  {room.name}
                </span>
              </button>
            );
          })}
        </div>

        <p className="mb-2 mt-5 px-2 text-[10px] font-extrabold uppercase tracking-[1.2px] text-[#1C1D1E]/40">
          Other rooms
        </p>
        <div className="space-y-1.5">
          {COMING_SOON_ROOMS.map((name) => (
            <div
              key={name}
              className="flex items-center gap-3 rounded-xl border border-transparent bg-[#EDF0F1]/60 px-3 py-2.5"
            >
              <span className="size-2.5 shrink-0 rounded-sm bg-[#1C1D1E]/10" />
              <span className="truncate text-xs font-medium text-[#1C1D1E]/50">
                {name}
              </span>
              <span className="ml-auto rounded-full bg-[#EBF5FF] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#2F9CFA]">
                Soon
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
