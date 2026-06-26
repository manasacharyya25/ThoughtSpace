import { Plus_Jakarta_Sans } from "next/font/google";
import { StartResumeScreen } from "@/components/start";

const startSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-colourful-landing",
});

export default function StartLoading() {
  return (
    <div className={startSans.variable}>
      <StartResumeScreen />
    </div>
  );
}
