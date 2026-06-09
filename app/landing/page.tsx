import type { Metadata } from "next";
import {
  CTA,
  Explanation,
  Hero,
  HowItWorks,
  LandingFooter,
  LandingNav,
  SampleConversations,
} from "@/components/landing";

export const metadata: Metadata = {
  title: "Conversations before appearances",
  description:
    "Connect through thoughts, not photos. A space where minds meet before appearances.",
};

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-background">
      <LandingNav />
      <main>
        <Hero />
        <Explanation />
        <HowItWorks />
        <SampleConversations />
        <CTA />
      </main>
      <LandingFooter />
    </div>
  );
}
