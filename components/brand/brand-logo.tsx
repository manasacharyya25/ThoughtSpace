"use client";

import Link from "next/link";
import { BRAND_WORDMARK } from "@/lib/brand";
import { cn } from "@/lib/utils";
import "@/components/landing/colourful-landing.css";

interface BrandLogoProps {
  href?: string;
  className?: string;
}

export function BrandLogo({ href = "/", className }: BrandLogoProps) {
  return (
    <Link
      href={href}
      className={cn(
        "colourful-landing-brand inline-flex items-center gap-3 no-underline",
        className
      )}
    >
      <div className="colourful-landing-brand-logo flex h-[38px] w-[38px] items-center justify-center rounded-xl bg-[#1C1D1E] text-white transition-[background-color] duration-300">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </div>
      <div className="text-xl font-extrabold tracking-[-0.5px] text-[#1C1D1E]">
        {BRAND_WORDMARK}
      </div>
    </Link>
  );
}
