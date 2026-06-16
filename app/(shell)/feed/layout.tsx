import {
  JetBrains_Mono,
  Playfair_Display,
  Plus_Jakarta_Sans,
} from "next/font/google";

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

export default function FeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${landingSerif.variable} ${landingSans.variable} ${landingMono.variable} w-full min-w-0 font-landing-sans`}
    >
      {children}
    </div>
  );
}
