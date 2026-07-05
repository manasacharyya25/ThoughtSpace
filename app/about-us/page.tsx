import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import {
  AboutUsDepartureSection,
  AboutUsFaq,
  AboutUsFooter,
  AboutUsHero,
  AboutUsManifestoSection,
  AboutUsMatchSimulator,
  AboutUsNav,
  AboutUsWhisperStream,
} from "@/components/about-us";
import "@/components/about-us/about-us.css";
import "@/components/landing/colourful-landing.css";

const aboutUsSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-colourful-landing",
});

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about ThoughtSpace — manifesto, match simulator, and whisper stream.",
};

export default function AboutUsPage() {
  return (
    <div
      className={`about-us-page relative min-h-dvh antialiased ${aboutUsSans.variable}`}
    >
      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -left-[20vw] -top-[20vw] h-[50vw] w-[50vw] rounded-full bg-[#2F9CFA] opacity-65 blur-[100px]" />
        <div className="absolute -bottom-[15vw] -right-[15vw] h-[45vw] w-[45vw] rounded-full bg-[#FFAB91] opacity-65 blur-[100px]" />
        <div className="absolute left-1/2 top-1/4 z-[1] h-[35vw] w-[35vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#B39DDB] opacity-30 blur-[100px]" />
      </div>

      <div className="relative z-10">
        <AboutUsNav />
        <main>
          <AboutUsHero />
          <AboutUsWhisperStream />
          <AboutUsDepartureSection />
          <AboutUsManifestoSection />
          {/*<AboutUsMatchSimulator /> */}
        </main>
        <AboutUsFooter />
      </div>
    </div>
  );
}
