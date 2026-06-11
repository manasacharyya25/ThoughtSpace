"use client";

import { useInbox } from "@/context/inbox-context";
import { BottomNav } from "./bottom-nav";
import { Container } from "./container";
import { LogoutButton } from "./logout-button";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { isChatOpen } = useInbox();

  if (isChatOpen) {
    return (
      <div className="relative flex min-h-screen flex-col">
        <div className="app-shell-ambient" aria-hidden="true">
          <div className="app-shell-ambient-glow app-shell-ambient-glow-violet" />
          <div className="app-shell-ambient-glow app-shell-ambient-glow-rose" />
        </div>
        <main className="relative z-10 flex-1">{children}</main>
        <LogoutButton className="bottom-5 right-6" />
      </div>
    );
  }

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
      <LogoutButton className="bottom-5 right-6" />
    </div>
  );
}
