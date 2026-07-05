import type { Metadata } from "next";
import { TermsOfServiceContent } from "@/components/legal/terms-of-service-content";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for ThoughtSpace, operated by Thought Space.",
};

export default function TermsOfServicePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="landing-glow landing-glow-hero" aria-hidden="true" />
      <main className="relative z-10 mx-auto max-w-2xl px-4 py-10 sm:py-14">
        <TermsOfServiceContent />
      </main>
    </div>
  );
}
