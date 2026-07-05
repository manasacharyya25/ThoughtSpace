"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Sessions", href: "/reflect" },
  { label: "Markers", href: "/reflect/markers" },
] as const;

export function ReflectSubNav() {
  const pathname = usePathname();

  return (
    <nav
      className="mb-5 flex gap-2 rounded-2xl border border-[#1C1D1E]/[0.06] bg-white/70 p-1"
      aria-label="Reflect sections"
    >
      {tabs.map((tab) => {
        const isActive =
          tab.href === "/reflect"
            ? pathname === "/reflect"
            : pathname.startsWith(tab.href);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex-1 rounded-xl px-3 py-2 text-center text-sm font-semibold transition-colors",
              isActive
                ? "bg-[#2F9CFA]/12 text-[#2F9CFA]"
                : "text-[#1C1D1E]/50 hover:text-[#1C1D1E]/75"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
