export function Explanation() {
  return (
    <section
      id="explanation"
      className="landing-section relative flex flex-col justify-center border-y border-border/50 px-4 py-24 md:py-32"
    >
      <div className="landing-glow landing-glow-center" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
          Connection without the{" "}
          <span className="text-muted-foreground">performance</span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-muted-foreground md:mt-8 md:text-lg">
          Most apps ask you to perform — curated photos, polished profiles,
          endless swiping. We believe the most meaningful connections start with
          a single honest thought. Share what&apos;s on your mind. Find people
          who make you think differently. Let conversation do the rest.
        </p>
      </div>
    </section>
  );
}
