"use client";

import { usePathname } from "next/navigation";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";
import { useVisualViewportHeight } from "@/hooks/use-visual-viewport-height";
import { isInboxChatRoute } from "@/lib/inbox-routes";
import { cn } from "@/lib/utils";
import { BottomNav } from "./bottom-nav";
import { Container } from "./container";
import { LogoutButton } from "./logout-button";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isInboxChat = isInboxChatRoute(pathname);
  const isColourfulFeed = pathname === "/feed";
  const isColourfulInboxList = pathname === "/inbox";
  const isColourfulProfile = pathname === "/profile";
  const isColourfulShell =
    isColourfulFeed || isColourfulInboxList || isColourfulProfile;
  const viewportHeight = useVisualViewportHeight();

  useBodyScrollLock(isInboxChat);

  if (isInboxChat) {
    return (
      <div
        className="fixed inset-x-0 top-0 z-40 flex flex-col overflow-hidden bg-[#0b0b0a]"
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
    <div
      className={cn(
        "relative flex h-dvh w-full max-w-[100vw] flex-col overflow-hidden",
        isColourfulShell && "bg-[#FAF8F5]"
      )}
      style={viewportHeight ? { height: viewportHeight } : undefined}
    >
      {!isColourfulShell && (
        <div className="app-shell-ambient" aria-hidden="true">
          <div className="app-shell-ambient-glow app-shell-ambient-glow-violet" />
          <div className="app-shell-ambient-glow app-shell-ambient-glow-rose" />
        </div>
      )}

      <main
        className={cn(
          "relative z-10 w-full min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain md:pb-28",
          isColourfulShell && "bg-[#FAF8F5]"
        )}
      >
        <Container size="md" className="py-4 pb-6 md:py-6 md:pb-8">
          {children}
        </Container>
      </main>
      <BottomNav />
      <LogoutButton className="bottom-5 right-6" />
    </div>
  );
}
