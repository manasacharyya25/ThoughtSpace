import { env } from "@/lib/env";

export function LandingFooter() {
  return (
    <footer className="border-t border-border/50 px-4 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-xs text-muted-foreground sm:flex-row">
        <span>
          &copy; {new Date().getFullYear()} {env.NEXT_PUBLIC_APP_NAME}
        </span>
        <span className="tracking-wide">
          Conversations before appearances.
        </span>
      </div>
    </footer>
  );
}
