"use client";

import { env } from "@/lib/env";
import { scrollToSection } from "@/lib/scroll-to-section";

const footerLinks = [
  { label: "Manifesto", id: "manifesto" },
  { label: "Sandbox Simulator", id: "simulator" },
  { label: "Whisper Stream", id: "playground" },
  { label: "Waitlist Key", id: "waitlist" },
] as const;

export function AboutUsFooter() {
  return (
    <footer className="space-y-4 border-t border-landing-border bg-black px-6 py-16 text-center font-landing-mono text-xs text-landing-muted">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
        <span className="font-landing-serif text-xl text-gray-400">
          {env.NEXT_PUBLIC_APP_NAME.toLowerCase()}.
        </span>

        <div className="flex flex-wrap justify-center gap-8 text-landing-muted">
          {footerLinks.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => scrollToSection(link.id)}
              className="transition-colors hover:text-gray-300"
            >
              {link.label}
            </button>
          ))}
        </div>

        <span>
          © {new Date().getFullYear()} {env.NEXT_PUBLIC_APP_NAME}. Built for
          human minds.
        </span>
      </div>
    </footer>
  );
}
