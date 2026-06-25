"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BoardChatPanel } from "@/components/board/board-chat-panel";
import { BoardParticipantsSidebar } from "@/components/board/board-participants-sidebar";
import { BoardRoomSidebar } from "@/components/board/board-room-sidebar";
import { BOARD_MESSAGE_MAX_LENGTH } from "@/lib/board/constants";
import { getBoardRoomAccent } from "@/lib/board/room-accents";
import { validateBoardMessage } from "@/lib/board/validation";
import { useBoardChat } from "@/hooks/use-board-chat";
import { useUser } from "@/hooks/use-user";
import { cn } from "@/lib/utils";
import "@/components/landing/colourful-landing.css";

function BoardHeader({ onBack }: { onBack: () => void }) {
  return (
    <header className="flex shrink-0 items-center gap-3 border-b border-[#1C1D1E]/[0.06] bg-white px-4 py-3 sm:px-5">
      <button
        type="button"
        onClick={onBack}
        aria-label="Exit live board"
        className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-[#1C1D1E]/10 bg-white text-[#1C1D1E] transition-colors hover:border-[#2F9CFA]/25 hover:bg-[#EDF0F1]"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-4"
          aria-hidden="true"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <div className="min-w-0">
        <h1 className="text-[clamp(1.35rem,3vw,2rem)] font-extrabold leading-[1.08] tracking-[-1px] text-[#1C1D1E]">
          Live Board
        </h1>
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#1C1D1E]/45 sm:text-xs">
          Open room chat
        </p>
      </div>
    </header>
  );
}

function BoardLoadingState() {
  return (
    <div className="flex flex-1 items-center justify-center py-16 text-xs font-medium text-landing-muted">
      Opening the live room…
    </div>
  );
}

function BoardErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16 text-center text-xs font-medium text-landing-muted">
      {message}
    </div>
  );
}

export function BoardChat() {
  const router = useRouter();
  const { user } = useUser();
  const {
    rooms,
    room,
    messages,
    participants,
    myUsername,
    loading,
    error,
    selectRoom,
    sendMessage,
  } = useBoardChat();

  const [draft, setDraft] = useState("");
  const [formError, setFormError] = useState<string>();
  const [sending, setSending] = useState(false);

  const remainingChars = BOARD_MESSAGE_MAX_LENGTH - draft.length;

  const handleSend = async () => {
    const validationError = validateBoardMessage(draft);
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setSending(true);
    setFormError(undefined);

    const trimmed = draft.trim();
    setDraft("");

    const { error: sendError } = await sendMessage(trimmed);

    setSending(false);

    if (sendError) {
      setDraft(trimmed);
      setFormError(sendError.message);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col bg-white">
      <BoardHeader onBack={() => router.push("/feed")} />

      {loading ? (
        <BoardLoadingState />
      ) : error || !room ? (
        <BoardErrorState message={error ?? "Live room is unavailable right now."} />
      ) : (
        <>
          <div className="flex gap-2 overflow-x-auto border-b border-[#1C1D1E]/[0.06] bg-white px-4 py-2 lg:hidden">
            {rooms.map((item, index) => {
              const isActive = item.id === room.id;
              const accent = getBoardRoomAccent(index);

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => void selectRoom(item.slug)}
                  className={cn(
                    "shrink-0 rounded-full border px-3 py-1.5 text-[10px] font-bold transition-colors",
                    isActive
                      ? cn(accent.activeBg, accent.activeBorder, "text-[#1C1D1E]")
                      : "border-[#1C1D1E]/10 bg-[#EDF0F1] text-[#1C1D1E]/55"
                  )}
                >
                  {item.name}
                </button>
              );
            })}
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)_240px]">
            <BoardRoomSidebar
              rooms={rooms}
              activeRoomId={room.id}
              onSelectRoom={(slug) => void selectRoom(slug)}
            />

            <BoardChatPanel
              roomName={room.name}
              participantCount={participants.length}
              messages={messages}
              draft={draft}
              formError={formError}
              sending={sending}
              remainingChars={remainingChars}
              onDraftChange={(value) => {
                setDraft(value);
                if (formError) setFormError(undefined);
              }}
              onSend={() => void handleSend()}
            />

            <BoardParticipantsSidebar
              myUsername={myUsername}
              participants={participants}
              currentUserId={user?.id}
            />
          </div>
        </>
      )}
    </div>
  );
}
