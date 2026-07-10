import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { SubscribePage } from "@/components/landing/subscribe-page";
import { env } from "@/lib/env";

const subscribeSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-colourful-landing",
});

export const metadata: Metadata = {
  title: "Subscribe",
  description: `Get the ${env.NEXT_PUBLIC_APP_NAME} newsletter — essays, reflections, and quiet prompts each week.`,
};

export default function SubscribeRoute() {
  return (
    <div className={subscribeSans.variable}>
      <SubscribePage />
    </div>
  );
}
