import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";

export function BlogNav() {
  return (
    <header className="relative z-50 px-4 py-4 sm:px-6">
      <nav
        className="mx-auto flex max-w-5xl items-center justify-between gap-4"
        aria-label="Blog navigation"
      >
        <BrandLogo />

        <Link
          href="/login"
          className="colourful-landing-btn-primary shrink-0 rounded-full bg-[#1C1D1E] px-4 py-2 text-[0.65rem] font-bold uppercase tracking-wider text-white no-underline transition-all hover:bg-[#2F9CFA] sm:px-5 sm:text-xs"
        >
          Join us
        </Link>
      </nav>
    </header>
  );
}
