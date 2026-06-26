import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { StartResumeScreen } from "@/components/start";
import { env } from "@/lib/env";

const startSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-colourful-landing",
});

export const metadata: Metadata = {
  title: "Resuming",
  description: `Returning to your ${env.NEXT_PUBLIC_APP_NAME} session.`,
  robots: { index: false, follow: false },
};

export default function StartPage() {
  return (
    <div className={startSans.variable}>
      <StartResumeScreen />
    </div>
  );
}
