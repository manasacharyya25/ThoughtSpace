import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BlogShellProps = {
  children: ReactNode;
  className?: string;
};

export function BlogShell({ children, className }: BlogShellProps) {
  return (
    <div
      className={cn(
        "relative min-h-dvh overflow-hidden bg-[#FAF8F5] font-[family-name:var(--font-colourful-landing)] text-[#1C1D1E] antialiased",
        className
      )}
    >
      <div
        className="pointer-events-none absolute -left-[20vw] -top-[20vw] z-0 h-[50vw] w-[50vw] rounded-full bg-[#2F9CFA] opacity-50 blur-[100px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-[15vw] -right-[15vw] z-0 h-[45vw] w-[45vw] rounded-full bg-[#FFAB91] opacity-50 blur-[100px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 z-0 h-[35vw] w-[35vw] -translate-x-1/2 rounded-full bg-[#B39DDB] opacity-25 blur-[100px]"
        aria-hidden="true"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
