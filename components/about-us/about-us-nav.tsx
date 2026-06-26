"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";
import { scrollToSection } from "@/lib/scroll-to-section";

const navItems = [
  { label: "manifesto", id: "manifesto" },
  { label: "the stream", id: "playground" },
  { label: "match simulator", id: "simulator" },
  { label: "philosophy", id: "faq" },
] as const;

export function AboutUsNav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-landing-border bg-landing-bg/90 px-6 py-4 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <BrandLogo href="/" />

        <div className="hidden items-center space-x-8 font-landing-mono text-sm text-landing-muted md:flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToSection(item.id)}
              className="transition-colors hover:text-gray-200"
            >
              {item.label}
            </button>
          ))}
        </div>

        <Link
          href="/start"
          className="inline-block rounded-full bg-white px-5 py-2 font-landing-mono text-xs uppercase tracking-wider text-black transition-all duration-300 hover:bg-landing-gold"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
}
