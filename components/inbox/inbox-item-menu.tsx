"use client";

import { MoreVertical } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface InboxItemMenuAction {
  label: string;
  onClick: () => void;
  destructive?: boolean;
}

interface InboxItemMenuProps {
  actions: InboxItemMenuAction[];
  className?: string;
  align?: "left" | "right";
}

export function InboxItemMenu({
  actions,
  className,
  align = "right",
}: InboxItemMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  if (actions.length === 0) return null;

  return (
    <div ref={containerRef} className={cn("relative shrink-0", className)}>
      <button
        type="button"
        aria-label="More options"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={(event) => {
          event.stopPropagation();
          setOpen((value) => !value);
        }}
        className="rounded-xl p-2 text-[#1C1D1E]/35 transition-colors hover:bg-[#1C1D1E]/5 hover:text-[#1C1D1E]/70"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          className={cn(
            "absolute top-full z-50 mt-1 min-w-[10.5rem] overflow-hidden rounded-xl border border-[#1C1D1E]/10 bg-white py-1 shadow-[0_12px_32px_-8px_rgba(28,29,30,0.18)]",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              role="menuitem"
              onClick={(event) => {
                event.stopPropagation();
                setOpen(false);
                action.onClick();
              }}
              className={cn(
                "flex w-full px-3 py-2 text-left text-xs font-semibold transition-colors hover:bg-[#EDF0F1]",
                action.destructive
                  ? "text-red-600 hover:bg-red-50"
                  : "text-[#1C1D1E]/80"
              )}
            >
              {action.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
