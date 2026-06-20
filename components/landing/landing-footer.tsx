import Link from "next/link";
import { env } from "@/lib/env";

export function LandingFooter({ variant = "mobile" }: { variant?: "mobile" | "desktop" }) {
  const copyright = (
    <p className="text-[0.58rem] font-medium text-[#1C1D1E]/45">
      © 2026 Registered {env.NEXT_PUBLIC_APP_NAME}
    </p>
  );
  const aboutLink = (
    <Link
      href="/about-us"
      className="text-[0.58rem] font-semibold text-[#1C1D1E]/55 transition-colors hover:text-[#2F9CFA]"
    >
      About us
    </Link>
  );

  if (variant === "desktop") {
    return (
      <footer className="relative z-[5] mt-6 flex shrink-0 items-center justify-between border-t border-[#1C1D1E]/[0.04] py-2.5">
        {copyright}
        {aboutLink}
      </footer>
    );
  }

  return (
    <footer className="relative z-[5] mt-8 shrink-0 border-t border-[#1C1D1E]/[0.04] px-2 pb-4 pt-5 text-center sm:mt-10 md:mt-12">
      {copyright}
      <div className="mt-1.5">{aboutLink}</div>
    </footer>
  );
}
