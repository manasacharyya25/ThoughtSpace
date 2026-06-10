import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="landing-section flex flex-col justify-center px-4 py-24 md:py-32">
      <div className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border border-border/60 px-6 py-16 text-center sm:px-12 md:py-20">
        <div className="landing-glow landing-glow-cta" aria-hidden="true" />

        <div className="relative z-10">
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            Ready to be known for your mind?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-balance text-sm text-muted-foreground md:mt-6 md:text-base">
            Join a space where thoughts lead and connection follows. Your first
            conversation is one honest question away.
          </p>
          <Link href="/onboarding" className="mt-8 inline-block md:mt-10">
            <Button size="lg" className="min-w-[200px] text-sm">
              Start a conversation
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
