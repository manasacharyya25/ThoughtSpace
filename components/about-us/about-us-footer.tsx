"use client";

import { BrandLogo } from "@/components/brand/brand-logo";
import { env } from "@/lib/env";

export function AboutUsFooter() {
  return (
    <footer className="space-y-4 border-t border-landing-border bg-black px-6 py-16 text-center font-landing-mono text-xs text-landing-muted">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
        <BrandLogo href="/" />

        <span>
          © {new Date().getFullYear()} {env.NEXT_PUBLIC_APP_NAME}. Built for
          human minds.
        </span>
      </div>
    </footer>
  );
}
