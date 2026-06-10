"use client";

import { cn } from "@/lib/utils";

export type AuthMode = "login" | "register";

interface AuthModeToggleProps {
  mode: AuthMode;
  onChange: (mode: AuthMode) => void;
}

export function AuthModeToggle({ mode, onChange }: AuthModeToggleProps) {
  return (
    <div
      className="relative grid grid-cols-2 rounded-full border border-white/[0.04] bg-surface/90 p-1 shadow-lg shadow-black/20"
      role="tablist"
      aria-label="Authentication mode"
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-2xl nav-item-active",
          "transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          mode === "register" && "translate-x-full"
        )}
      />

      <button
        type="button"
        role="tab"
        aria-selected={mode === "login"}
        onClick={() => onChange("login")}
        className={cn(
          "relative z-10 rounded-2xl py-2.5 text-sm font-medium",
          "transition-[color] duration-300 ease",
          mode === "login"
            ? "text-heading"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Log in
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={mode === "register"}
        onClick={() => onChange("register")}
        className={cn(
          "relative z-10 rounded-2xl py-2.5 text-sm font-medium",
          "transition-[color] duration-300 ease",
          mode === "register"
            ? "text-heading"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Sign up
      </button>
    </div>
  );
}
