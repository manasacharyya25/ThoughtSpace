"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useInbox } from "@/context/inbox-context";
import { cn } from "@/lib/utils";
import {
  FeedIcon,
  InboxIcon,
  LiveIcon,
  ProfileIcon,
} from "./nav-icons";

const navItems = [
  { label: "Feed", href: "/feed", icon: FeedIcon },
  { label: "Inbox", href: "/inbox", icon: InboxIcon, showUnread: true },
  { label: "Live", href: "/board", icon: LiveIcon },
  { label: "Profile", href: "/profile", icon: ProfileIcon },
] as const;

function InboxNavBadges({
  showConversationUnread,
  showPending,
}: {
  showConversationUnread: boolean;
  showPending: boolean;
}) {
  if (!showConversationUnread && !showPending) return null;

  if (showConversationUnread && !showPending) {
    return (
      <span
        className="absolute -right-1 -top-1 h-1.5 w-1.5 rounded-full bg-rose-500 ring-2 ring-surface"
        aria-label="Unread conversations"
      />
    );
  }

  if (showPending && !showConversationUnread) {
    return (
      <span
        className="absolute -right-1 -top-1 h-1.5 w-1.5 rounded-full bg-[#2F9CFA] ring-2 ring-white"
        aria-label="Unaccepted responses"
      />
    );
  }

  return (
    <span
      className="absolute -right-2 -top-1 flex items-center"
      aria-label="Unread conversations and unaccepted responses"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[#2F9CFA] ring-2 ring-white" />
      <span className="-ml-1 h-1.5 w-1.5 rounded-full bg-rose-500 ring-2 ring-surface" />
    </span>
  );
}

function NavBar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { hasUnreadConversations, hasUnacceptedPending } = useInbox();
  const isColourfulShell =
    pathname === "/feed" ||
    pathname.startsWith("/feed/") ||
    pathname === "/inbox" ||
    pathname === "/profile";

  return (
    <nav
      className={cn(
        "flex items-center gap-1 rounded-2xl border px-2 py-2 backdrop-blur-xl",
        isColourfulShell
          ? "border-[#1C1D1E]/[0.06] bg-white/90 shadow-[0_24px_48px_-12px_rgba(28,29,30,0.08)]"
          : "border-white/[0.04] bg-surface/90 shadow-2xl shadow-black/40 md:bg-surface/40",
        className
      )}
      aria-label="Main navigation"
    >
      {navItems.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href === "/inbox" && pathname.startsWith("/inbox/"));
        const Icon = item.icon;
        const showInboxBadges =
          "showUnread" in item && item.showUnread && !isActive;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative flex min-w-[64px] flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 transition-[background-color,border-color,color,box-shadow] duration-300 ease sm:min-w-[72px] sm:px-3",
              isActive
                ? "bg-[#2F9CFA]/12 text-[#2F9CFA] shadow-[inset_0_0_0_1px_rgba(47,156,250,0.25)]"
                : isColourfulShell
                  ? "text-[#1C1D1E]/45 hover:bg-[#EDF0F1] hover:text-[#1C1D1E]/70"
                  : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
            )}
          >
            <span className="relative flex shrink-0 items-center justify-center">
              <Icon className="h-5 w-5" />
              {showInboxBadges && (
                <InboxNavBadges
                  showConversationUnread={hasUnreadConversations}
                  showPending={hasUnacceptedPending}
                />
              )}
            </span>
            <span className="shrink-0 text-[10px] font-medium leading-none tracking-wide sm:text-[11px]">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

export function BottomNav() {
  return (
    <>
      {/* Mobile: pinned in the flex shell */}
      <div className="relative z-50 flex w-full shrink-0 justify-center px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-2 md:hidden">
        <NavBar />
      </div>

      {/* Desktop: floating bar over content */}
      <div className="pointer-events-none fixed inset-x-0 bottom-5 z-50 hidden justify-center px-4 md:flex">
        <NavBar className="pointer-events-auto" />
      </div>
    </>
  );
}
