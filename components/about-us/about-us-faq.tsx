import { faqItems } from "@/data/landing-simulator";
import { env } from "@/lib/env";

export function AboutUsFaq() {
  return (
    <section id="faq" className="border-b border-landing-border px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <div className="mb-16 text-center">
          <span className="font-landing-mono text-xs uppercase tracking-widest text-landing-gold">
            Inquire Deeper
          </span>
          <h2 className="font-landing-serif mt-2 mb-4 text-3xl text-gray-100 sm:text-5xl">
            How {env.NEXT_PUBLIC_APP_NAME} Works
          </h2>
        </div>

        <div className="space-y-8">
          {faqItems.map((item) => (
            <div
              key={item.question}
              className="rounded-lg border border-landing-border bg-[#0c0c0b] p-6"
            >
              <h4 className="font-landing-serif mb-2 text-lg text-gray-200">
                {item.question}
              </h4>
              <p className="text-sm font-light leading-relaxed text-landing-muted">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
