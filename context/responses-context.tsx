"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Post } from "@/types/post";
import type { PrivateResponse } from "@/types/response";

interface ResponsesContextValue {
  responses: PrivateResponse[];
  activePost: Post | null;
  isModalOpen: boolean;
  openResponseModal: (post: Post) => void;
  closeResponseModal: () => void;
  sendResponse: (content: string) => Promise<void>;
  hasResponded: (postId: string) => boolean;
}

const ResponsesContext = createContext<ResponsesContextValue | null>(null);

export function ResponsesProvider({ children }: { children: ReactNode }) {
  const [responses, setResponses] = useState<PrivateResponse[]>([]);
  const [activePost, setActivePost] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openResponseModal = useCallback((post: Post) => {
    setActivePost(post);
    setIsModalOpen(true);
  }, []);

  const closeResponseModal = useCallback(() => {
    setIsModalOpen(false);
    setActivePost(null);
  }, []);

  const sendResponse = useCallback(
    async (content: string) => {
      if (!activePost) return;

      await new Promise((resolve) => setTimeout(resolve, 1200));

      const response: PrivateResponse = {
        id: `response-${Date.now()}`,
        postId: activePost.id,
        postContent: activePost.content,
        content: content.trim(),
        createdAt: new Date().toISOString(),
      };

      setResponses((prev) => [response, ...prev]);
    },
    [activePost]
  );

  const hasResponded = useCallback(
    (postId: string) => responses.some((r) => r.postId === postId),
    [responses]
  );

  const value = useMemo(
    () => ({
      responses,
      activePost,
      isModalOpen,
      openResponseModal,
      closeResponseModal,
      sendResponse,
      hasResponded,
    }),
    [
      responses,
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
