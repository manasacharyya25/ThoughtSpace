import type { Metadata } from "next";
import { OnboardingFlow } from "@/components/onboarding";

export const metadata: Metadata = {
  title: "Get Started",
};

export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex flex-1 items-center justify-center">
        <OnboardingFlow />
      </div>
    </div>
  );
}
