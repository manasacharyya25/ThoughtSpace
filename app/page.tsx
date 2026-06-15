import type { Metadata } from "next";
import {
  JetBrains_Mono,
  Playfair_Display,
  Plus_Jakarta_Sans,
} from "next/font/google";
import {
  DepartureSection,
  Hero,
  LandingFaq,
  LandingFooter,
  LandingNav,
  ManifestoSection,
  MatchSimulator,
  WaitlistSection,
  WhisperStream,
} from "@/components/landing";

const landingSerif = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-landing-serif",
});

const landingSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-landing-sans",
});

const landingMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-landing-mono",
});

export const metadata: Metadata = {
  title: "Connected Minds, Untethered from Metrics",
  description:
    "No profiles. No followers. Just real dialogue. A thought-first social sanctuary.",
};

export default function HomePage() {
  return (
    <div
      className={`landing-page font-landing-sans antialiased ${landingSerif.variable} ${landingSans.variable} ${landingMono.variable}`}
    >
      <LandingNav />
      <main>
        <Hero />
        <MatchSimulator />
        <WhisperStream />
        <DepartureSection />
        <ManifestoSection />
        <LandingFaq />
        <WaitlistSection />
      </main>
      <LandingFooter />
    </div>
  );
}
