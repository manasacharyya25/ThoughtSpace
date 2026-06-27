import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { OnboardingFlow } from "@/components/onboarding";
import { env } from "@/lib/env";

const onboardingSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-colourful-landing",
});

export const metadata: Metadata = {
  title: "Get Started",
  description: `Set up your ${env.NEXT_PUBLIC_APP_NAME} profile — a few questions to help us match you with thoughtful conversations.`,
  robots: { index: false, follow: true },
};

export default function OnboardingPage() {
  return (
    <div className={`${onboardingSans.variable} min-h-dvh bg-[#FAF8F5]`}>
      <OnboardingFlow />
    </div>
  );
}
