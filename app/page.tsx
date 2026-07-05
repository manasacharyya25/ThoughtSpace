import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ColourfulLanding } from "@/components/landing";

const colourfulLandingSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-colourful-landing",
});

export const metadata: Metadata = {
  title: "Connected Minds, Untethered from Metrics",
  description:
    "A thought-first social sanctuary.",
};

export default function HomePage() {
  return (
    <div className={colourfulLandingSans.variable}>
      <ColourfulLanding />
    </div>
  );
}
