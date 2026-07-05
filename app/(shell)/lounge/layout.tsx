import { Plus_Jakarta_Sans } from "next/font/google";
import "@/components/landing/colourful-landing.css";

const colourfulLoungeSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-colourful-landing",
});

export default function LoungeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${colourfulLoungeSans.variable} whisper-feed relative flex h-full min-h-0 flex-1 flex-col bg-[#FAF8F5]`}
    >
      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="whisper-ambient-glow whisper-ambient-glow-blue absolute -left-[20vw] -top-[20vw] h-[50vw] w-[50vw]" />
        <div className="whisper-ambient-glow whisper-ambient-glow-peach absolute -bottom-[15vw] -right-[15vw] h-[45vw] w-[45vw]" />
        <div className="whisper-ambient-glow whisper-ambient-glow-lilac absolute left-1/2 top-1/4 h-[35vw] w-[35vw] -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="relative z-10 flex h-full min-h-0 flex-1 flex-col">
        {children}
      </div>
    </div>
  );
}
