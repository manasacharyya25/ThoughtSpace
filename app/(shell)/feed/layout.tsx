import { Plus_Jakarta_Sans } from "next/font/google";
import "@/components/landing/colourful-landing.css";

const colourfulFeedSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-colourful-landing",
});

export default function FeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${colourfulFeedSans.variable} relative -mx-4 -mt-4 min-h-full w-[calc(100%+2rem)] bg-[#FAF8F5] px-4 pb-2 pt-4 sm:-mx-6 sm:w-[calc(100%+3rem)] sm:px-6 md:-mt-6 md:pb-4`}
    >
      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="whisper-ambient-glow whisper-ambient-glow-blue absolute -left-[20vw] -top-[20vw] h-[50vw] w-[50vw]" />
        <div className="whisper-ambient-glow whisper-ambient-glow-peach absolute -bottom-[15vw] -right-[15vw] h-[45vw] w-[45vw]" />
        <div className="whisper-ambient-glow whisper-ambient-glow-lilac absolute left-1/2 top-1/4 h-[35vw] w-[35vw] -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="relative z-10 w-full min-w-0">{children}</div>
    </div>
  );
}
