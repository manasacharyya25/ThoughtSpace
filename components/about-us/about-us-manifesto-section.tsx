"use client";

import { env } from "@/lib/env";
import { scrollToSection } from "@/lib/scroll-to-section";

export function AboutUsManifestoSection() {
  return (
    <section
      id="manifesto"
      className="relative border-b border-landing-border px-6 py-24"
    >
      <div className="mx-auto max-w-3xl space-y-8 text-center">
        <span className="font-landing-mono text-xs uppercase tracking-widest text-landing-gold">
          Our Creed
        </span>
        <blockquote className="font-landing-serif text-2xl italic leading-relaxed text-gray-100 sm:text-4xl">
          &ldquo;We believe that human beings are too complex to be reduced to
          follower counts, and too beautiful to live in fear of likes. True
          connection isn&apos;t about showing off your life; it is about sharing
          your mind.&rdquo;
        </blockquote>
        <div className="mx-auto my-8 h-px w-16 bg-landing-gold" />
        <p className="text-left text-sm font-light leading-relaxed text-landing-muted sm:text-base">
          Every person you pass on the street is living a life as complex and
          chaotic as your own—populated with their own ambitions, friends,
          routines, worries, and inherited foolishness. {env.NEXT_PUBLIC_APP_NAME}{" "}
          is designed to give you a keyhole into that shared human experience. We
          do not require your real name. We do not care what you look like. We
          only care about what keeps you awake at night, what fills you with
          wonder, and what makes you human.
        </p>
        <div className="pt-4">
          <button
            type="button"
            onClick={() => scrollToSection("waitlist")}
            className="inline-block rounded border border-landing-gold px-8 py-3 font-landing-mono text-xs uppercase tracking-wider text-landing-gold transition-all duration-300 hover:bg-landing-gold hover:text-black"
          >
            Stand With Us
          </button>
        </div>
      </div>
    </section>
  );
}
