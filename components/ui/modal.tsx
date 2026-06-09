"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Button } from "./button";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  className,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="modal-overlay-animate fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div
        className="modal-backdrop-animate absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          "modal-content-animate relative z-10 w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-2xl shadow-black/40",
          className
        )}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="space-y-1">
            {title && (
              <h2
                id="modal-title"
                className="text-lg font-semibold tracking-tight"
              >
                {title}
              </h2>
            )}
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0"
          >
            ✕
          </Button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}
