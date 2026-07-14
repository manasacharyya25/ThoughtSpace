import { Plus_Jakarta_Sans } from "next/font/google";
import { ColourfulLanding } from "@/components/landing";
import { socialMetadata } from "@/lib/seo/social-metadata";

const colourfulLandingSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-colourful-landing",
});

export const metadata = socialMetadata({
  title: "Connected Minds, Untethered from Metrics",
  description: "A thought-first social sanctuary.",
  path: "/",
});

export default function HomePage() {
  return (
    <div className={colourfulLandingSans.variable}>
      <ColourfulLanding />
    </div>
  );
}
