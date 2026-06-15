"use client";

import { env } from "@/lib/env";
import { scrollToSection } from "@/lib/scroll-to-section";

const navItems = [
  { label: "manifesto", id: "manifesto" },
  { label: "the stream", id: "playground" },
  { label: "match simulator", id: "simulator" },
  { label: "philosophy", id: "faq" },
] as const;

export function LandingNav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-landing-border bg-landing-bg/90 px-6 py-4 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <button
          type="button"
          onClick={() => scrollToSection("top")}
          className="font-landing-serif text-2xl tracking-wider text-gray-100 transition-colors duration-300 hover:text-landing-gold"
        >
          {env.NEXT_PUBLIC_APP_NAME.toLowerCase()}.
        </button>

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

        <button
          type="button"
          onClick={() => scrollToSection("waitlist")}
          className="inline-block rounded-full bg-white px-5 py-2 font-landing-mono text-xs uppercase tracking-wider text-black transition-all duration-300 hover:bg-landing-gold"
        >
          Join Waitlist
        </button>
      </div>
    </nav>
  );
}
