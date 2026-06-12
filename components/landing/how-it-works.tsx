import { howItWorksSteps } from "@/data/landing";

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="landing-section flex flex-col justify-center px-4 py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center md:mb-20">
          <p className="mb-3 text-sm font-medium tracking-widest text-muted-foreground uppercase">
            How it works
          </p>
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            Three steps to real connection
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {howItWorksSteps.map((item) => (
            <div
              key={item.step}
              className="group relative rounded-2xl border border-border/60 bg-surface/50 p-8 transition-colors hover:border-border hover:bg-surface"
            >
              <h3 className="mt-4 text-xl font-medium tracking-tight">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
