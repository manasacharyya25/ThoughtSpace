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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6 backdrop-blur-sm">
          <div className="echo-modal-panel w-full max-w-lg space-y-6 rounded-2xl bg-[#0c0c0b] p-6">
            <div className="flex items-center justify-between">
              <span className="font-landing-mono text-xs uppercase tracking-widest text-landing-gold">
                Transmit Direct Echo
              </span>
              <button
                type="button"
                onClick={closeResponseModal}
                disabled={sending}
                className="font-landing-mono text-lg text-landing-muted transition-colors hover:text-gray-300"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="rounded-xl border border-landing-border bg-[#121211] p-4">
              <span className="mb-1 block font-landing-mono text-[9px] uppercase text-landing-muted">
                Sonder Prompt:
              </span>
              <p className="text-xs font-light italic text-gray-300">
                {activePost.content}
              </p>
            </div>

            <div className="space-y-2">
              <label className="block font-landing-mono text-xs text-landing-muted">
                Your sincere echo:
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
                  "whisper-cast-textarea w-full rounded-xl p-4 text-sm disabled:opacity-60",
                  touched && error && "border-red-500/50"
                )}
              />
              <div className="flex items-center justify-between font-landing-mono text-[11px] text-landing-muted">
                <span>
                  {RESPONSE_MIN_WORDS}–{RESPONSE_MAX_WORDS} words
                </span>
                <span className={isOverLimit ? "text-red-400" : undefined}>
                  {wordCount} / {RESPONSE_MAX_WORDS}
                </span>
              </div>
              {touched && error && (
                <p className="font-landing-mono text-xs text-red-400">{error}</p>
              )}
            </div>

            <button
              type="button"
              onClick={() => void handleSend()}
              disabled={sending || isOverLimit}
              className="w-full rounded-xl bg-white py-3 font-landing-mono text-xs font-bold uppercase tracking-wider text-black transition-all duration-300 disabled:opacity-50"
            >
              {sending ? "Transmitting…" : "Transmit Response to Poster"}
            </button>
          </div>
        </div>
      )}

      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 flex max-w-sm items-start space-x-3 rounded-xl border border-landing-gold/30 bg-[#121211] px-6 py-4 text-gray-200 shadow-xl">
          <span className="font-bold text-landing-gold">✓</span>
          <div>
            <h5 className="font-landing-mono text-xs font-bold uppercase text-landing-gold">
              Transmitted
            </h5>
            <p className="mt-1 font-landing-mono text-xs text-landing-muted">
              Your response has been sent into their feed. If they accept, a
              secure channel opens.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
