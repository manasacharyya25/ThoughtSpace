"use client";

import { usePathname } from "next/navigation";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";
import { useVisualViewportHeight } from "@/hooks/use-visual-viewport-height";
import { isInboxChatRoute } from "@/lib/inbox-routes";
import { BottomNav } from "./bottom-nav";
import { Container } from "./container";
import { LogoutButton } from "./logout-button";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isInboxChat = isInboxChatRoute(pathname);
  const viewportHeight = useVisualViewportHeight();

  useBodyScrollLock(isInboxChat);

  if (isInboxChat) {
    return (
      <div
        className="fixed inset-x-0 top-0 z-40 flex flex-col overflow-hidden bg-background"
        style={{ height: viewportHeight ?? "100dvh" }}
      >
        <div className="app-shell-ambient" aria-hidden="true">
          <div className="app-shell-ambient-glow app-shell-ambient-glow-violet" />
          <div className="app-shell-ambient-glow app-shell-ambient-glow-rose" />
        </div>
        <main className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden">
          {children}
        </main>
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
