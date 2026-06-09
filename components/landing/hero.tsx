import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-4 pt-14">
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
          Meet people through what they think, feel, and wonder — not what they
          look like. Thoughts first. Connection follows.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row md:mt-12">
          <Link href="/onboarding">
            <Button size="lg" className="min-w-[180px]">
              Begin your story
            </Button>
          </Link>
          <a href="#how-it-works">
            <Button variant="ghost" size="lg">
              See how it works
            </Button>
          </a>
        </div>
      </div>

      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground/40"
        aria-hidden="true"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] tracking-widest uppercase">Scroll</span>
          <div className="h-8 w-px bg-gradient-to-b from-muted-foreground/40 to-transparent" />
        </div>
      </div>
    </section>
  );
}
