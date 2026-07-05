"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ReflectEditor } from "@/components/reflect/reflect-editor";
import { ReflectReadView } from "@/components/reflect/reflect-read-view";
import { ReflectSummary } from "@/components/reflect/reflect-summary";
import { createClient } from "@/lib/supabase/client";
import {
  completeSession,
  getSession,
  listSessionMarkers,
  saveSession,
} from "@/lib/supabase/journal";
import type { JournalMarker, JournalSession } from "@/types/journal";

interface ReflectSessionPageProps {
  sessionId: string;
}

export function ReflectSessionPage({ sessionId }: ReflectSessionPageProps) {
  const router = useRouter();
  const [session, setSession] = useState<JournalSession | null>(null);
  const [markers, setMarkers] = useState<JournalMarker[]>([]);
  const [loading, setLoading] = useState(true);
  const [finishing, setFinishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const latestContentRef = useRef<{
    contentJson: Record<string, unknown>;
    plainText: string;
  } | null>(null);

  const loadSession = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be signed in to view this session.");
      setLoading(false);
      return;
    }

    const [{ data: sessionData, error: sessionError }, { data: markerData }] =
      await Promise.all([
        getSession(supabase, user.id, sessionId),
        listSessionMarkers(supabase, user.id, sessionId),
      ]);

    if (sessionError) {
      setError(sessionError.message);
      setSession(null);
    } else if (!sessionData) {
      setError("Session not found.");
      setSession(null);
    } else {
      setSession(sessionData);
      setMarkers(markerData);
      latestContentRef.current = {
        contentJson: sessionData.contentJson,
        plainText: sessionData.plainText ?? "",
      };
      setError(null);
    }

    setLoading(false);
  }, [sessionId]);

  useEffect(() => {
    void loadSession();
  }, [loadSession]);

  const handleSave = useCallback(
    async (contentJson: Record<string, unknown>, plainText: string) => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || !session || session.status !== "draft") return;

      const { error: saveSessionError } = await saveSession(
        supabase,
        user.id,
        sessionId,
        contentJson,
        plainText
      );

      if (saveSessionError) {
        setSaveError(saveSessionError.message);
        return;
      }

      setSaveError(null);

      const { data: markerData } = await listSessionMarkers(
        supabase,
        user.id,
        sessionId
      );
      setMarkers(markerData);
    },
    [session, sessionId]
  );

  const handleFinishSession = async () => {
    if (!session || session.status !== "draft") return;

    setFinishing(true);
    setError(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be signed in to finish this session.");
      setFinishing(false);
      return;
    }

    const latestContent = latestContentRef.current ?? {
      contentJson: session.contentJson,
      plainText: session.plainText ?? "",
    };

    const { data, error: completeError } = await completeSession(
      supabase,
      user.id,
      sessionId,
      latestContent.contentJson,
      latestContent.plainText
    );

    if (completeError || !data) {
      setError(completeError?.message ?? "Could not finish session.");
      setFinishing(false);
      return;
    }

    const { data: markerData } = await listSessionMarkers(
      supabase,
      user.id,
      sessionId
    );

    setSession(data);
    setMarkers(markerData);
    setFinishing(false);
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-2xl">
        <div className="h-10 w-40 animate-pulse rounded-xl bg-[#EDF0F1]/80" />
        <div className="mt-6 h-[50vh] animate-pulse rounded-2xl bg-[#EDF0F1]/70" />
      </div>
    );
  }

  if (error && !session) {
    return (
      <div className="mx-auto w-full max-w-2xl">
        <p className="text-sm text-rose-600">{error}</p>
        <Link
          href="/reflect"
          className="mt-4 inline-block text-sm font-semibold text-[#2F9CFA] hover:underline"
        >
          Back to Reflect
        </Link>
      </div>
    );
  }

  if (!session) return null;

  const isCompleted = session.status === "completed";

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-5 flex items-center justify-between gap-3">
        <Link
          href="/reflect"
          className="text-sm font-semibold text-[#2F9CFA] hover:underline"
        >
          Back
        </Link>
        {!isCompleted ? (
          <button
            type="button"
            onClick={() => void handleFinishSession()}
            disabled={finishing}
            className="rounded-xl bg-[#1C1D1E] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {finishing ? "Finishing..." : "Finish session"}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => router.push("/reflect")}
            className="rounded-xl border border-[#1C1D1E]/10 bg-white/80 px-4 py-2 text-sm font-semibold text-[#1C1D1E]/70 hover:text-[#1C1D1E]"
          >
            New session
          </button>
        )}
      </div>

      {saveError ? (
        <p className="mb-4 text-sm text-rose-600">{saveError}</p>
      ) : null}
      {error ? <p className="mb-4 text-sm text-rose-600">{error}</p> : null}

      {isCompleted ? (
        <div className="space-y-6">
          <div>
            <h1 className="text-xl font-bold text-[#1C1D1E]">Session summary</h1>
            <p className="mt-1 text-sm text-[#1C1D1E]/50">
              Grouped markers from this reflection.
            </p>
          </div>
          <ReflectSummary markers={markers} />
          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#1C1D1E]/40">
              Full entry
            </h2>
            <div className="rounded-2xl border border-[#1C1D1E]/[0.06] bg-white/85 px-4 py-4">
              <ReflectReadView doc={session.contentJson} />
            </div>
          </div>
        </div>
      ) : (
        <ReflectEditor
          content={session.contentJson}
          onSave={handleSave}
          onContentChange={(contentJson, plainText) => {
            latestContentRef.current = { contentJson, plainText };
          }}
        />
      )}
    </div>
  );
}
