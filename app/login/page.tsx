import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Suspense } from "react";
import { AuthPageShell, AuthScreen } from "@/components/auth";
import { env } from "@/lib/env";

const authSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-colourful-landing",
});

export const metadata: Metadata = {
  title: "Log in",
  description: `Sign in to ${env.NEXT_PUBLIC_APP_NAME} — a high-quality space for genuine, anonymous conversations.`,
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return (
    <div className={`${authSans.variable} min-h-dvh bg-[#FAF8F5]`}>
      <AuthPageShell>
        <Suspense>
          <AuthScreen />
        </Suspense>
      </AuthPageShell>
    </div>
  );
}
