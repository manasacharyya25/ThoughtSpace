import Link from "next/link";
import { env } from "@/lib/env";

export function LandingFooter() {
  return (
    <footer className="snap-end border-t border-border/50 px-4 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-xs text-muted-foreground sm:flex-row">
        <span>
          &copy; {new Date().getFullYear()} {env.NEXT_PUBLIC_APP_NAME}
        </span>
        <div className="flex items-center gap-4">
          <Link
            href="/terms-of-service"
            className="transition-colors hover:text-foreground"
          >
            Terms of Service
          </Link>
          <span aria-hidden="true">·</span>
          <Link
            href="/privacy-policy"
            className="transition-colors hover:text-foreground"
          >
            Privacy Policy
          </Link>
          <span className="hidden text-border sm:inline" aria-hidden="true">
            ·
          </span>
          <span className="hidden tracking-wide sm:inline">
            Conversations before appearances.
          </span>
        </div>
      </div>
    </footer>
  );
}
