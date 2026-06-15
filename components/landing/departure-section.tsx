import { env } from "@/lib/env";

export function DepartureSection() {
  return (
    <section className="border-b border-landing-border bg-black px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div>
            <span className="font-landing-mono text-xs uppercase tracking-widest text-landing-gold">
              A Necessary Departure
            </span>
            <h2 className="font-landing-serif mt-3 mb-6 text-3xl leading-tight text-gray-100 sm:text-5xl">
              Why we built <br />
              <span className="italic text-landing-gold">a sanctuary</span>.
            </h2>
            <p className="mb-6 text-base font-light leading-relaxed text-landing-muted">
              Modern social apps aren&apos;t designed to bring us closer;
              they&apos;re designed to keep us scrolling. By reducing human beings
              to metrics—follower counts, likes, curated grids—they amplify
              loneliness while masquerading as connection.
            </p>
            <p className="text-base font-light leading-relaxed text-landing-muted">
              {env.NEXT_PUBLIC_APP_NAME} exists to dismantle the performance.
              There are no avatars to judge, no comment sections to perform for,
              and no algorithms to outrage you. Just two individuals, matching on
              shared questions of life, finding solace in honest conversation.
            </p>

            <div className="mt-8 flex items-center space-x-4 rounded-xl border border-landing-border bg-landing-card/40 p-4">
              <div className="rounded-lg bg-landing-gold/10 p-2 text-landing-gold">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-landing-mono text-sm text-gray-200">
                  The 100-percent privacy rule
                </h4>
                <p className="mt-1 text-xs text-landing-muted">
                  We save zero chat histories on central servers once chats end.
                  When you close your connection, your words dissipate
                  beautifully into the atmosphere.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-xl border border-landing-border bg-landing-card/30 p-6">
              <div className="absolute left-0 top-0 h-full w-1 bg-red-400" />
              <h3 className="mb-4 font-landing-mono text-xs uppercase tracking-widest text-red-400">
                The Outward Loop (Legacy Social)
              </h3>
              <ul className="space-y-4">
                {[
                  "Curating a perfect aesthetic to earn validation from strangers.",
                  "Comparing your internal chaos to everyone else's highlight reels.",
                  "Broadcasting to an audience of hundreds, yet speaking to nobody.",
                ].map((text) => (
                  <li
                    key={text}
                    className="flex items-start text-sm text-landing-muted"
                  >
                    <span className="mr-2 font-bold text-red-400">✕</span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative overflow-hidden rounded-xl border border-landing-border bg-landing-card/30 p-6">
              <div className="absolute left-0 top-0 h-full w-1 bg-green-400" />
              <h3 className="mb-4 font-landing-mono text-xs uppercase tracking-widest text-landing-gold">
                The Inward Connection ({env.NEXT_PUBLIC_APP_NAME})
              </h3>
              <ul className="space-y-4">
                {[
                  "Total freedom to be unpolished, raw, and genuinely real.",
                  "Finding comfort in realizing others share your silent uncertainties.",
                  "Deep, immersive one-to-one focus with the magic of active listening.",
                ].map((text) => (
                  <li key={text} className="flex items-start text-sm text-gray-300">
                    <span className="mr-2 font-bold text-green-400">✓</span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
