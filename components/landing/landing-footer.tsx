import Link from "next/link";
import { env } from "@/lib/env";
import { cn } from "@/lib/utils";

export function LandingFooter({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        "relative z-[5] mt-4 flex shrink-0 items-center justify-between border-t border-[#1C1D1E]/[0.04] py-2",
        className
      )}
    >
      <p className="text-[0.58rem] font-medium leading-none text-[#1C1D1E]/45">
        © 2026 Registered {env.NEXT_PUBLIC_APP_NAME}
      </p>
      <Link
        href="/about-us"
        className="text-[0.58rem] font-semibold leading-none text-[#1C1D1E]/55 transition-colors hover:text-[#2F9CFA]"
      >
        About us
      </Link>
    </footer>
  );
}
