import { env } from "@/lib/env";

export function AboutUsDepartureSection() {
  return (
    <section id="sanctuary" className="border-b border-landing-border bg-black px-6 py-24">
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
            Some thoughts are too personal for timelines, yet too important to carry alone.
            </p>
            <p className="mb-6 text-base font-light leading-relaxed text-landing-muted">
            We believe that beneath our different lives lie the same questions, emotions and quiet struggles. 
            The shared human experience isn&apos;t something to perform—it&apos;s something to explore together.
            </p>
            <p className="text-base font-light leading-relaxed text-landing-muted">
            That&apos;s why we built {env.NEXT_PUBLIC_APP_NAME}: a community where meaningful one-to-one conversations 
            can unfold without the distractions of profiles, followers or algorithms. Just two thoughtful people 
            meeting through curiosity, honesty and the desire to better understand themselves and each other.
            </p>
          </div>

          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-xl border border-landing-border bg-landing-card/30 p-6">
              <div className="absolute left-0 top-0 h-full w-1 bg-green-400" />
              <h3 className="mb-4 font-landing-mono text-xs uppercase tracking-widest text-landing-gold">
                The {env.NEXT_PUBLIC_APP_NAME} Experience
              </h3>
              <ul className="space-y-4">
                {[
                  "A space to explore the thoughts, emotions and questions that often go unspoken.",
                  "Thoughtful people exploring the shared human experience together.",
                  "Conversations rooted in curiosity, empathy and genuine understanding.",
                  "A calmer corner of the internet where connection matters more than performance.",
                  "Comfort in discovering that your quietest thoughts are often shared by others.",
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
