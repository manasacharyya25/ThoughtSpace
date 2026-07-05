"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import "@/components/landing/colourful-landing.css";

interface PostReadModalProps {
  open: boolean;
  onClose: () => void;
  content: string;
  contentItalic?: boolean;
}

export function PostReadModal({
  open,
  onClose,
  content,
  contentItalic = false,
}: PostReadModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1C1D1E]/40 p-5 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="echo-modal-panel w-full max-w-lg space-y-5 rounded-[28px] bg-white p-5 sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-label="Read full whisper"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2F9CFA]">
            Read full whisper
          </span>
          <button
            type="button"
            onClick={onClose}
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
          <div className="max-h-[60vh] overflow-y-auto pr-1">
            <p
              className={cn(
                "whisper-post-content text-xs font-medium leading-relaxed text-[#1C1D1E]/75",
                contentItalic && "italic"
              )}
            >
              &ldquo;{content}&rdquo;
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="colourful-landing-btn-primary w-full rounded-2xl border-none bg-[#1C1D1E] py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#2F9CFA]"
        >
          Close
        </button>
      </div>
    </div>,
    document.body
  );
}
