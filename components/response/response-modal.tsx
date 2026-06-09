"use client";

import { useEffect, useState } from "react";
import { useResponses } from "@/context/responses-context";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  RESPONSE_MAX_WORDS,
  RESPONSE_MIN_WORDS,
  validateResponse,
} from "@/lib/response-validation";
import { countWords } from "@/lib/words";
import { cn } from "@/lib/utils";
import { ResponseSuccess } from "./response-success";

type ModalStep = "compose" | "sending" | "success";

export function ResponseModal() {
  const { activePost, isModalOpen, closeResponseModal, sendResponse } =
    useResponses();
  const [content, setContent] = useState("");
  const [error, setError] = useState<string>();
  const [touched, setTouched] = useState(false);
  const [step, setStep] = useState<ModalStep>("compose");

  const wordCount = countWords(content);
  const isNearLimit = wordCount > RESPONSE_MAX_WORDS * 0.85;
  const isOverLimit = wordCount > RESPONSE_MAX_WORDS;

  useEffect(() => {
    if (!isModalOpen) {
      setContent("");
      setError(undefined);
      setTouched(false);
      setStep("compose");
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (step !== "success") return;
    const timer = setTimeout(() => closeResponseModal(), 2800);
    return () => clearTimeout(timer);
  }, [step, closeResponseModal]);

  const handleSend = async () => {
    setTouched(true);
    const validationError = validateResponse(content);
    setError(validationError);
    if (validationError) return;

    setStep("sending");
    try {
      await sendResponse(content);
      setStep("success");
    } catch {
      setStep("compose");
      setError("Something went wrong. Please try again.");
    }
  };

  const handleClose = () => {
    if (step === "sending") return;
    closeResponseModal();
  };

  if (!activePost) return null;

  const truncatedPost =
    activePost.content.length > 120
      ? `${activePost.content.slice(0, 120)}…`
      : activePost.content;

  return (
    <Modal
      open={isModalOpen}
      onClose={handleClose}
      title={step === "success" ? undefined : "Private response"}
      description={
        step === "success"
          ? undefined
          : "Only the author will see this. Be thoughtful."
      }
      className="max-w-lg"
    >
      {step === "success" ? (
        <ResponseSuccess />
      ) : (
        <div className="space-y-5">
          <blockquote className="rounded-lg border border-border/50 bg-muted/30 px-4 py-3">
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              &ldquo;{truncatedPost}&rdquo;
            </p>
          </blockquote>

          <div className="space-y-2">
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
              placeholder="Share what this thought stirred in you..."
              rows={6}
              disabled={step === "sending"}
              className={cn(
                "w-full resize-none rounded-md border border-border bg-muted/30 px-3 py-2 text-[15px] leading-[1.7] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-border disabled:opacity-60",
                touched && error && "border-red-500/50"
              )}
            />
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground">
                {RESPONSE_MIN_WORDS}–{RESPONSE_MAX_WORDS} words
              </span>
              <span
                className={cn(
                  "tabular-nums transition-colors",
                  isOverLimit
                    ? "text-red-400"
                    : isNearLimit
                      ? "text-amber-400/80"
                      : "text-muted-foreground"
                )}
              >
                {wordCount} / {RESPONSE_MAX_WORDS}
              </span>
            </div>
            {touched && error && (
              <p className="text-xs text-red-400">{error}</p>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleClose}
              disabled={step === "sending"}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="flex-1"
              onClick={handleSend}
              disabled={step === "sending" || isOverLimit}
            >
              {step === "sending" ? (
                <span className="flex items-center gap-2">
                  <span className="response-spinner h-3.5 w-3.5 rounded-full border-2 border-accent-foreground/30 border-t-accent-foreground" />
                  Sending…
                </span>
              ) : (
                "Send privately"
              )}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
