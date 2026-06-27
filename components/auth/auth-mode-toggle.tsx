"use client";

import { cn } from "@/lib/utils";

export type AuthMode = "login" | "register";

interface AuthModeToggleProps {
  mode: AuthMode;
  onChange: (mode: AuthMode) => void;
  variant?: "dark" | "light";
}

export function AuthModeToggle({
  mode,
  onChange,
  variant = "dark",
}: AuthModeToggleProps) {
  const isLight = variant === "light";

  return (
    <div
      className={cn(
        "relative grid grid-cols-2 rounded-full p-1",
        isLight
          ? "border border-[#1C1D1E]/[0.06] bg-[#EDF0F1]"
          : "border border-white/[0.04] bg-surface/90 shadow-lg shadow-black/20"
      )}
      role="tablist"
      aria-label="Authentication mode"
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-2xl transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          isLight ? "bg-white shadow-sm" : "nav-item-active",
          mode === "register" && "translate-x-full"
        )}
      />

      <button
        type="button"
        role="tab"
        aria-selected={mode === "login"}
        onClick={() => onChange("login")}
        className={cn(
          "relative z-10 rounded-2xl py-2.5 text-sm font-medium transition-[color] duration-300 ease",
          mode === "login"
            ? isLight
              ? "text-[#1C1D1E]"
              : "text-heading"
            : isLight
              ? "text-[#1C1D1E]/45 hover:text-[#1C1D1E]/70"
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
          "relative z-10 rounded-2xl py-2.5 text-sm font-medium transition-[color] duration-300 ease",
          mode === "register"
            ? isLight
              ? "text-[#1C1D1E]"
              : "text-heading"
            : isLight
              ? "text-[#1C1D1E]/45 hover:text-[#1C1D1E]/70"
              : "text-muted-foreground hover:text-foreground"
        )}
      >
        Sign up
      </button>
    </div>
  );
}
