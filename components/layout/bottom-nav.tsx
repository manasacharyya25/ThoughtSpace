"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useInbox } from "@/context/inbox-context";
import { cn } from "@/lib/utils";
import {
  CreatePostIcon,
  FeedIcon,
  InboxIcon,
  ProfileIcon,
} from "./nav-icons";

const navItems = [
  { label: "Feed", href: "/feed", icon: FeedIcon },
  { label: "Inbox", href: "/inbox", icon: InboxIcon, showUnread: true },
  { label: "Profile", href: "/profile", icon: ProfileIcon },
  { label: "Post", href: "/create-post", icon: CreatePostIcon },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const { hasUnread } = useInbox();

  return (
    <nav
      className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-2xl border border-white/[0.04] bg-surface/90 px-2 py-2 shadow-2xl shadow-black/40 backdrop-blur-xl"
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
                "relative flex min-w-[72px] flex-col items-center gap-1 rounded-2xl px-3 py-2 transition-[background-color,border-color,color] duration-300 ease sm:min-w-[80px] sm:px-4",
                isActive
                  ? "nav-item-active text-heading"
                  : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
              )}
            >
              <span className="relative">
                <Icon className="h-5 w-5" />
                {showDot && (
                  <span
                    className="absolute -right-1 -top-1 h-1.5 w-1.5 rounded-full bg-rose-500"
                    aria-label="Unread messages"
                  />
                )}
              </span>
              <span className="text-[10px] font-medium tracking-wide sm:text-[11px]">
                {item.label}
              </span>
            </Link>
          );
        })}
    </nav>
  );
}
