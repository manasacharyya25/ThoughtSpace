"use client";

import { BottomNav } from "./bottom-nav";
import { Container } from "./container";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 pb-28">
        <Container className="py-6 md:py-8">{children}</Container>
      </main>
      <BottomNav />
    </div>
  );
}
