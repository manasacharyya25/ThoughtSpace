import { Plus_Jakarta_Sans } from "next/font/google";
import "@/components/landing/colourful-landing.css";

const colourfulBoardSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-colourful-landing",
});

export default function BoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${colourfulBoardSans.variable} whisper-feed flex h-full min-h-0 flex-1 flex-col`}
    >
      {children}
    </div>
  );
}
