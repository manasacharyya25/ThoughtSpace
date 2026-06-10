import { sampleConversations } from "@/data/landing";

export function SampleConversations() {
  return (
    <section
      id="sample-conversations"
      className="landing-section relative flex flex-col justify-center overflow-hidden px-4 py-24 md:py-32"
    >
      <div className="landing-glow landing-glow-bottom" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-16 text-center md:mb-20">
          <p className="mb-3 text-sm font-medium tracking-widest text-muted-foreground uppercase">
            Real thoughts
          </p>
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            This is what connection sounds like
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground md:text-base">
            No faces. No bios. Just minds meeting through words.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {sampleConversations.map((conversation) => (
            <article
              key={conversation.id}
              className="flex flex-col rounded-2xl border border-border/60 bg-surface/40 p-6 backdrop-blur-sm transition-colors hover:border-border/80 hover:bg-surface/60"
            >
              <p className="text-sm font-medium leading-relaxed text-foreground/90">
                &ldquo;{conversation.prompt}&rdquo;
              </p>

              <div className="mt-6 flex flex-col gap-3">
                {conversation.replies.map((reply) => (
                  <div
                    key={reply.text}
                    className="flex items-start gap-3 rounded-lg border border-border/40 bg-muted/30 px-3 py-2.5"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border/60 bg-surface text-[10px] font-medium text-muted-foreground">
                      {reply.initial}
                    </span>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {reply.text}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
