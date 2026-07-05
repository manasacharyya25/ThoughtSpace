"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ReflectSessionList } from "@/components/reflect/reflect-session-list";
import { ReflectSubNav } from "@/components/reflect/reflect-sub-nav";
import { createClient } from "@/lib/supabase/client";
import { createSession, listSessions } from "@/lib/supabase/journal";
import type { JournalSessionWithMarkerCounts } from "@/types/journal";

export function ReflectHub() {
  const router = useRouter();
  const [sessions, setSessions] = useState<JournalSessionWithMarkerCounts[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSessions = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be signed in to reflect.");
      setSessions([]);
      setLoading(false);
      return;
    }

    const { data, error: fetchError } = await listSessions(supabase, user.id);

    if (fetchError) {
      setError(fetchError.message);
      setSessions([]);
    } else {
      setSessions(data);
      setError(null);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    void loadSessions();
  }, [loadSessions]);

  const handleNewSession = async () => {
    setCreating(true);
    setError(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be signed in to start a session.");
      setCreating(false);
      return;
    }

    const { data, error: createError } = await createSession(supabase, user.id);

    if (createError || !data) {
      setError(createError?.message ?? "Could not create session.");
      setCreating(false);
      return;
    }

    router.push(`/reflect/${data.id}`);
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-[#1C1D1E]">
          Reflect
        </h1>
        <p className="mt-1 text-sm text-[#1C1D1E]/50">
          Only you can see your reflections.
        </p>
      </header>

      <ReflectSubNav />

      <div className="mb-5">
        <button
          type="button"
          onClick={() => void handleNewSession()}
          disabled={creating}
          className="w-full rounded-2xl bg-[#2F9CFA] px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {creating ? "Starting session..." : "New session"}
        </button>
      </div>

      {error ? <p className="mb-4 text-sm text-rose-600">{error}</p> : null}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-24 animate-pulse rounded-2xl bg-[#EDF0F1]/80"
            />
          ))}
        </div>
      ) : (
        <ReflectSessionList sessions={sessions} />
      )}
    </div>
  );
}
