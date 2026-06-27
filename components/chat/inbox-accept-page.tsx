"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { useInbox } from "@/context/inbox-context";

export function InboxAcceptPage() {
  const router = useRouter();
  const params = useParams();
  const pendingId = params.pendingId as string;
  const { acceptPending, pending } = useInbox();
  const startedRef = useRef(false);

  const pendingItem = useMemo(
    () => pending.find((item) => item.id === pendingId),
    [pending, pendingId]
  );

  useEffect(() => {
    if (!pendingId || startedRef.current) return;
    startedRef.current = true;

    let cancelled = false;

    const run = async () => {
      const conversation = await acceptPending(pendingId);
      if (cancelled) return;
      if (!conversation) {
        router.replace("/inbox");
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [acceptPending, pendingId, router]);

  return (
    <div className="inbox-chat mx-auto flex w-full max-w-2xl flex-1 flex-col">
      <header className="inbox-chat-header">
        <button
          type="button"
          onClick={() => router.replace("/inbox")}
          aria-label="Back to inbox"
          className="inbox-chat-back"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {pendingItem ? (
          <>
            <div className="inbox-chat-avatar">{pendingItem.fromInitial}</div>
            <p className="inbox-chat-title">
              <span className="inbox-chat-title-gold">Opening</span> channel…
            </p>
          </>
        ) : (
          <p className="inbox-chat-title">
            <span className="inbox-chat-title-gold">Opening</span> channel…
          </p>
        )}
      </header>

      <div className="inbox-chat-messages flex flex-col items-center justify-center">
        <p className="font-landing-mono text-xs text-[#a1a1aa]">
          Connecting you anonymously…
        </p>
        {pendingItem && (
          <p className="mt-4 max-w-sm px-4 text-center font-landing-mono text-[10px] text-[#6b6b6b]">
            On your whisper: &ldquo;{pendingItem.thoughtExcerpt}&rdquo;
          </p>
        )}
      </div>
    </div>
  );
}
