"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { createResponse, listMyResponses } from "@/lib/supabase/responses";
import { mapPrivateResponse } from "@/lib/response-mapper";
import type { Post } from "@/types/post";
import type { PrivateResponse } from "@/types/response";
import { usePosts } from "@/context/posts-context";
import { useTrialOptional } from "@/context/trial-context";

interface ResponsesContextValue {
  responses: PrivateResponse[];
  loading: boolean;
  activePost: Post | null;
  isModalOpen: boolean;
  openResponseModal: (post: Post) => void;
  closeResponseModal: () => void;
  sendResponse: (content: string) => Promise<void>;
  hasResponded: (postId: string) => boolean;
}

const ResponsesContext = createContext<ResponsesContextValue | null>(null);

export function ResponsesProvider({ children }: { children: ReactNode }) {
  const { bumpResponseCount } = usePosts();
  const trial = useTrialOptional();
  const [responses, setResponses] = useState<PrivateResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePost, setActivePost] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        if (!cancelled) {
          setResponses([]);
          setLoading(false);
        }
        return;
      }

      const { data, error } = await listMyResponses(supabase, user.id);

      if (cancelled) return;

      if (!error) {
        setResponses(data);
      }
      setLoading(false);
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const openResponseModal = useCallback(
    (post: Post) => {
      if (trial && !trial.guardReply()) {
        return;
      }
      setActivePost(post);
      setIsModalOpen(true);
    },
    [trial]
  );

  const closeResponseModal = useCallback(() => {
    setIsModalOpen(false);
    setActivePost(null);
  }, []);

  const sendResponse = useCallback(
    async (content: string) => {
      if (!activePost) return;

      if (trial && !trial.guardReply()) {
        throw new Error("Guest reply limit reached.");
      }

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("You must be signed in to respond.");
      }

      const { data, error } = await createResponse(
        supabase,
        activePost.id,
        user.id,
        content
      );

      if (error || !data) {
        throw error ?? new Error("Could not send response.");
      }

      const response = mapPrivateResponse(data, activePost.content);
      setResponses((prev) => [response, ...prev]);
      bumpResponseCount(activePost.id);
      trial?.notifyReplySuccess();
    },
    [activePost, bumpResponseCount, trial]
  );

  const hasResponded = useCallback(
    (postId: string) => responses.some((r) => r.postId === postId),
    [responses]
  );

  const value = useMemo(
    () => ({
      responses,
      loading,
      activePost,
      isModalOpen,
      openResponseModal,
      closeResponseModal,
      sendResponse,
      hasResponded,
    }),
    [
      responses,
      loading,
      activePost,
      isModalOpen,
      openResponseModal,
      closeResponseModal,
      sendResponse,
      hasResponded,
    ]
  );

  return (
    <ResponsesContext.Provider value={value}>
      {children}
    </ResponsesContext.Provider>
  );
}

export function useResponses() {
  const context = useContext(ResponsesContext);
  if (!context) {
    throw new Error("useResponses must be used within a ResponsesProvider");
  }
  return context;
}
