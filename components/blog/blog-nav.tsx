"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/brand/brand-logo";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about-us" },
  { label: "Blog", href: "/blog" },
] as const;

export function BlogNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-[#1C1D1E]/[0.06] bg-[#FAF8F5]/90 px-4 py-4 backdrop-blur-md sm:px-6">
      <nav
        className="mx-auto flex max-w-5xl items-center justify-between gap-4"
        aria-label="Blog navigation"
      >
        <BrandLogo />

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/blog"
                ? pathname === "/blog" || pathname.startsWith("/blog/")
                : pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-xs font-semibold transition-colors",
                  isActive
                    ? "text-[#2F9CFA]"
                    : "text-[#1C1D1E]/55 hover:text-[#1C1D1E]"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <Link
          href="/login"
          className="colourful-landing-btn-primary shrink-0 rounded-full bg-[#1C1D1E] px-4 py-2 text-[0.65rem] font-bold uppercase tracking-wider text-white no-underline transition-all hover:bg-[#2F9CFA] sm:px-5 sm:text-xs"
        >
          Get Started
        </Link>
      </nav>
    </header>
  );
}
