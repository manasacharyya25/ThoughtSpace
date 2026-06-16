"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useInbox } from "@/context/inbox-context";
import { cn } from "@/lib/utils";
import {
  FeedIcon,
  InboxIcon,
  ProfileIcon,
} from "./nav-icons";

const navItems = [
  { label: "Feed", href: "/feed", icon: FeedIcon },
  { label: "Inbox", href: "/inbox", icon: InboxIcon, showUnread: true },
  { label: "Profile", href: "/profile", icon: ProfileIcon },
] as const;

function NavBar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { hasUnread } = useInbox();

  return (
    <nav
      className={cn(
        "flex items-center gap-1 rounded-md border border-white/[0.04] bg-surface/90 px-2 py-2 shadow-2xl shadow-black/40 backdrop-blur-xl md:bg-surface/40",
        className
      )}
      aria-label="Main navigation"
    >
      {navItems.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href === "/inbox" && pathname.startsWith("/inbox/"));
        const Icon = item.icon;
        const showDot =
          "showUnread" in item && item.showUnread && hasUnread && !isActive;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative flex min-w-[72px] flex-col items-center justify-center gap-1 rounded-md px-3 py-2 transition-[background-color,border-color,color] duration-300 ease sm:min-w-[80px] sm:px-4",
              isActive
                ? "nav-item-active text-heading"
                : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
            )}
          >
            <span className="relative flex shrink-0 items-center justify-center">
              <Icon className="h-5 w-5" />
              {showDot && (
                <span
                  className="absolute -right-1 -top-1 h-1.5 w-1.5 rounded-full bg-rose-500"
                  aria-label="Unread messages"
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
