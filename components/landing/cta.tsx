import Link from "next/link";
import { Button } from "@/components/ui/button";

function PricingTimeline() {
  return (
    <div className="mx-auto mt-8 max-w-md text-left sm:mt-10">
      <div className="flex justify-between text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
        <span>Trial</span>
        <span>After 30 days</span>
      </div>

      <div className="relative mt-3 flex items-center gap-0">
        <span
          className="h-2.5 w-2.5 shrink-0 rounded-full border border-violet-500/30 bg-violet-500/15 shadow-[0_0_12px_rgba(139,92,246,0.15)]"
          aria-hidden="true"
        />
        <div className="relative mx-2 h-px flex-1">
          <div className="absolute inset-0 bg-border/80" aria-hidden="true" />
          <div
            className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-violet-500/35 via-violet-500/10 to-transparent"
            aria-hidden="true"
          />
        </div>
        <span
          className="h-2.5 w-2.5 shrink-0 rounded-full border border-border bg-muted/50"
          aria-hidden="true"
        />
      </div>

      <div className="mt-3 flex justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-foreground">Free full access</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">30 days</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-foreground">
            $4.99
            <span className="font-normal text-muted-foreground">/mo</span>
          </p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Billed monthly
          </p>
        </div>
      </div>

      <p className="mt-4 text-center text-[11px] text-muted-foreground">
        We&apos;ll remind you before your trial ends.
      </p>
    </div>
  );
}

export function CTA() {
  return (
    <section className="landing-section flex flex-col justify-center px-4 py-24 md:py-32">
      <div className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border border-border/60 px-6 py-16 text-center sm:px-12 md:py-20">
        <div className="landing-glow landing-glow-cta" aria-hidden="true" />

        <div className="relative z-10">
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            Ready to be share what&apos;s on your mind?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-balance text-sm text-muted-foreground md:mt-6 md:text-base">
            Join a space kept intentionally small and protected to preserve
            conversation quality and reduce spam.
          </p>

          <PricingTimeline />

          <Link href="/login" className="mt-8 inline-block md:mt-10">
            <Button size="lg" className="min-w-[200px] text-sm">
              Start free trial
            </Button>
          </Link>
          <p className="mt-3 text-[11px] text-muted-foreground">
            No charge until day 31
          </p>
        </div>
      </div>
    </section>
  );
}
