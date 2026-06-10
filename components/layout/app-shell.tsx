"use client";

import { BottomNav } from "./bottom-nav";
import { Container } from "./container";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="app-shell-ambient" aria-hidden="true">
        <div className="app-shell-ambient-glow app-shell-ambient-glow-violet" />
        <div className="app-shell-ambient-glow app-shell-ambient-glow-rose" />
      </div>

      <main className="relative z-10 flex-1 pb-28">
        <Container className="py-4 md:py-6">{children}</Container>
      </main>
      <BottomNav />
    </div>
  );
}
