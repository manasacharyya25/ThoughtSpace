"use client";

import Link from "next/link";
import { useTrial } from "@/context/trial-context";

export function TrialBadge() {
  const { isGuest } = useTrial();

  if (!isGuest) return null;

  return (
    <div className="sticky top-0 z-20 border-b border-[#2F9CFA]/15 bg-[#EBF5FF]/90 px-4 py-2 text-center backdrop-blur-sm">
      <p className="text-[0.62rem] font-bold uppercase tracking-[0.8px] text-[#1C1D1E]/70">
        Guest mode{" "}
        <span className="font-medium normal-case tracking-normal text-[#1C1D1E]/45">
          ·{" "}
          <Link
            href="/login"
            className="font-semibold text-[#2F9CFA] transition-colors hover:text-[#1a8ae6]"
          >
            Sign up to save
          </Link>
        </span>
      </p>
    </div>
  );
}
