"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { scrollToSection } from "@/lib/scroll-to-section";

export function Hero() {
  return (
    <section className="landing-section relative flex flex-col items-center justify-center overflow-hidden px-4 pt-14">
      <div className="landing-glow landing-glow-hero" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <p className="mb-6 text-sm font-medium tracking-widest text-muted-foreground uppercase">
          A new way to connect
        </p>

        <h1 className="text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
          Conversations{" "}
          <span className="landing-gradient-text">before</span>
          <br />
          appearances.
        </h1>

        <p className="mx-auto mt-8 max-w-xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg md:mt-10 md:text-xl">
          Meet people through what they think, feel, wonder and experience — not photos,
          profiles or metrices.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row md:mt-12 lg:hidden">
          <Link href="/login">
            <Button size="lg" className="min-w-[180px]">
              Begin your story
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="lg"
            type="button"
            onClick={() => scrollToSection("how-it-works")}
          >
            See how it works
          </Button>
        </div>
      </div>

      <button
        type="button"
        onClick={() => scrollToSection("explanation")}
        className="fixed bottom-6 right-6 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/60 text-muted-foreground/50 backdrop-blur-sm transition-colors hover:border-border hover:text-muted-foreground"
        aria-label="Scroll to next section"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
    </section>
  );
}
