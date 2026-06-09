import Link from "next/link";
import { Button } from "@/components/ui/button";
import { env } from "@/lib/env";

export function LandingNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/50 bg-background/60 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/landing"
          className="text-sm font-medium tracking-tight transition-opacity hover:opacity-70"
        >
          {env.NEXT_PUBLIC_APP_NAME}
        </Link>
        <Link href="/onboarding">
          <Button size="sm">Get started</Button>
        </Link>
      </div>
    </header>
  );
}
