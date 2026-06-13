import type { Metadata } from "next";
import { PrivacyPolicyContent } from "@/components/legal/privacy-policy-content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Thought Space collects, uses, and protects your information on ThoughtSpace.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="landing-glow landing-glow-hero" aria-hidden="true" />
      <main className="relative z-10 mx-auto max-w-2xl px-4 py-10 sm:py-14">
        <PrivacyPolicyContent />
      </main>
    </div>
  );
}
