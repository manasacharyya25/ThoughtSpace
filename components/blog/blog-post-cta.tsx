import Link from "next/link";

export function BlogPostCta() {
  return (
    <div className="mt-12 flex justify-center">
      <Link
        href="/login"
        className="colourful-landing-btn-primary inline-flex items-center justify-center gap-3 rounded-[20px] border-none bg-[#1C1D1E] px-8 py-4 text-sm font-bold text-white no-underline shadow-[0_24px_48px_-12px_rgba(28,29,30,0.08)] hover:bg-[#2F9CFA] hover:shadow-[0_12px_32px_-4px_rgba(47,156,250,0.4)] sm:px-[42px] sm:py-5 sm:text-[1.05rem]"
      >
        <span>Get Started</span>
        <svg
          className="colourful-landing-btn-arrow"
          width={18}
          height={18}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </Link>
    </div>
  );
}
