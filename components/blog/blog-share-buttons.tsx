import type { ReactNode } from "react";
import { buildBlogShareUrls, type SharePlatform } from "@/lib/share-urls";
import { cn } from "@/lib/utils";

const SHARE_OPTIONS: {
  id: SharePlatform;
  label: string;
  className: string;
  icon: ReactNode;
}[] = [
  {
    id: "x",
    label: "Share on X",
    className: "hover:border-[#1C1D1E]/20 hover:bg-[#1C1D1E] hover:text-white",
    icon: (
      <svg viewBox="0 0 24 24" className="size-full" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    id: "reddit",
    label: "Share on Reddit",
    className: "hover:border-[#FF4500]/30 hover:bg-[#FF4500] hover:text-white",
    icon: (
      <svg viewBox="0 0 24 24" className="size-full" fill="currentColor" aria-hidden="true">
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.03 4.875-6.771 4.875-3.74 0-6.771-2.181-6.771-4.875 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.688-.562-1.249-1.25-1.249zm-.657 3.5c-.828 0-1.5.672-1.5 1.5 0 .829.672 1.5 1.5 1.5.829 0 1.5-.671 1.5-1.5 0-.828-.671-1.5-1.5-1.5z" />
      </svg>
    ),
  },
  {
    id: "facebook",
    label: "Share on Facebook",
    className: "hover:border-[#1877F2]/30 hover:bg-[#1877F2] hover:text-white",
    icon: (
      <svg viewBox="0 0 24 24" className="size-full" fill="currentColor" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    id: "whatsapp",
    label: "Share on WhatsApp",
    className: "hover:border-[#25D366]/30 hover:bg-[#25D366] hover:text-white",
    icon: (
      <svg viewBox="0 0 24 24" className="size-full" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.881 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
];

type BlogShareButtonsProps = {
  url: string;
  title: string;
  variant?: "default" | "compact";
  className?: string;
};

export function BlogShareButtons({
  url,
  title,
  variant = "default",
  className,
}: BlogShareButtonsProps) {
  const shareUrls = buildBlogShareUrls(url, title);
  const isCompact = variant === "compact";

  return (
    <div
      className={cn(
        isCompact ? "" : "mt-12 border-t border-[#1C1D1E]/[0.06] pt-8",
        className
      )}
    >
      {!isCompact ? (
        <p className="text-[0.65rem] font-extrabold uppercase tracking-[1.2px] text-[#1C1D1E]/45">
          Share this article
        </p>
      ) : null}
      <div
        className={cn(
          "flex flex-wrap gap-1.5",
          isCompact ? "justify-end" : "mt-4 gap-2"
        )}
      >
        {SHARE_OPTIONS.map((option) => (
          <a
            key={option.id}
            href={shareUrls[option.id]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={option.label}
            className={cn(
              "inline-flex items-center justify-center rounded-lg border border-[#1C1D1E]/10 bg-white text-[#1C1D1E]/70 shadow-[0_4px_12px_rgba(0,0,0,0.03)] transition-colors",
              isCompact
                ? "size-8 p-1.5"
                : "gap-2 rounded-xl px-4 py-2.5 text-xs font-bold",
              option.className
            )}
          >
            <span className={isCompact ? "size-3.5" : "size-4"}>{option.icon}</span>
            {!isCompact ? (
              <span className="capitalize">
                {option.id === "x" ? "X" : option.id}
              </span>
            ) : null}
          </a>
        ))}
      </div>
    </div>
  );
}
