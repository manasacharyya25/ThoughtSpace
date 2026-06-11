import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthScreen } from "@/components/auth";

export const metadata: Metadata = {
  title: "Log in",
};

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background">
      <div className="landing-glow landing-glow-hero" aria-hidden="true" />
      <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-8 sm:py-12">
        <Suspense>
          <AuthScreen />
        </Suspense>
      </div>
    </div>
  );
}
