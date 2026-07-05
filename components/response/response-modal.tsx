"use client";

import { useEffect, useState } from "react";
import { useResponses } from "@/context/responses-context";
import {
  RESPONSE_MAX_WORDS,
  RESPONSE_MIN_WORDS,
  validateResponse,
} from "@/lib/response-validation";
import { countWords } from "@/lib/words";
import { cn } from "@/lib/utils";
import "@/components/landing/colourful-landing.css";

export function ResponseModal() {
  const { activePost, isModalOpen, closeResponseModal, sendResponse } =
    useResponses();
  const [content, setContent] = useState("");
  const [error, setError] = useState<string>();
  const [touched, setTouched] = useState(false);
  const [sending, setSending] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const wordCount = countWords(content);
  const isOverLimit = wordCount > RESPONSE_MAX_WORDS;

  useEffect(() => {
    if (!isModalOpen) {
      setContent("");
      setError(undefined);
      setTouched(false);
      setSending(false);
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (!showToast) return;
    const timer = setTimeout(() => setShowToast(false), 4500);
    return () => clearTimeout(timer);
  }, [showToast]);

  const handleSend = async () => {
    setTouched(true);
    const validationError = validateResponse(content);
    setError(validationError);
    if (validationError) return;

    setSending(true);
    try {
      await sendResponse(content);
      closeResponseModal();
      setShowToast(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  if (!activePost && !showToast) return null;

  return (
    <>
      {activePost && isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C1D1E]/40 p-5 backdrop-blur-sm">
          <div className="echo-modal-panel w-full max-w-lg space-y-5 rounded-[28px] bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2F9CFA]">
                Send a direct response
              </span>
              <button
                type="button"
                onClick={closeResponseModal}
                disabled={sending}
                className="flex h-8 w-8 items-center justify-center rounded-full text-lg text-[#1C1D1E]/40 transition-colors hover:bg-[#EDF0F1] hover:text-[#1C1D1E]"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="rounded-[14px] border border-[#1C1D1E]/[0.06] bg-[#EDF0F1] p-4">
              <span className="mb-1 block text-[9px] font-bold uppercase tracking-wider text-[#1C1D1E]/45">
                Their whisper
              </span>
              <p className="whisper-post-content text-xs font-medium italic leading-relaxed text-[#1C1D1E]/75">
                &ldquo;{activePost.content}&rdquo;
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-[0.65rem] font-extrabold uppercase tracking-[1.2px] text-[#1C1D1E]/50">
                Your response
              </label>
              <textarea
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  if (touched) setError(validateResponse(e.target.value));
                }}
                onBlur={() => {
                  setTouched(true);
                  setError(validateResponse(content));
                }}
                rows={3}
                disabled={sending}
                placeholder="Avoid small talk. Write how you truly connect to this..."
                className={cn(
                  "w-full rounded-[14px] border-2 border-transparent bg-[#EDF0F1] p-4 text-sm font-medium leading-relaxed text-[#1C1D1E] placeholder:text-[#1C1D1E]/35 transition-[border-color,box-shadow,background-color] focus:border-[#2F9CFA] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#2F9CFA]/10 disabled:opacity-60",
                  touched && error && "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/10"
                )}
              />
              <div className="flex items-center justify-between text-[11px] font-medium text-[#1C1D1E]/45">
                <span>
                  {RESPONSE_MIN_WORDS}–{RESPONSE_MAX_WORDS} words
                </span>
                <span className={isOverLimit ? "text-red-500" : undefined}>
                  {wordCount} / {RESPONSE_MAX_WORDS}
                </span>
              </div>
              {touched && error && (
                <p className="text-xs font-medium text-red-500">{error}</p>
              )}
            </div>

            <button
              type="button"
              onClick={() => void handleSend()}
              disabled={sending || isOverLimit}
              className="colourful-landing-btn-primary w-full rounded-2xl border-none bg-[#1C1D1E] py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#2F9CFA] disabled:opacity-50"
            >
              {sending ? "Sending…" : "Send response"}
            </button>
          </div>
        </div>
      )}

      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 flex max-w-sm items-start gap-3 rounded-[20px] border border-[#1C1D1E]/[0.06] bg-white px-5 py-4 shadow-[0_24px_48px_-12px_rgba(28,29,30,0.12)]">
          <span className="font-bold text-[#2F9CFA]">✓</span>
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#2F9CFA]">
              Sent
            </h5>
            <p className="mt-1 text-xs font-medium leading-relaxed text-[#1C1D1E]/55">
              Your response has been sent. If they accept, a secure channel
              opens.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
