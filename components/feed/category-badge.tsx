import { cn } from "@/lib/utils";
import type { PostCategory } from "@/types/post";

const categoryStyles: Record<string, string> = {
  reflection: "border-violet-500/20 bg-violet-500/5 text-violet-300/80",
  philosophy: "border-indigo-500/20 bg-indigo-500/5 text-indigo-300/80",
  vulnerability: "border-rose-500/20 bg-rose-500/5 text-rose-300/80",
  curiosity: "border-amber-500/20 bg-amber-500/5 text-amber-300/80",
  growth: "border-emerald-500/20 bg-emerald-500/5 text-emerald-300/80",
  connection: "border-sky-500/20 bg-sky-500/5 text-sky-300/80",
  wonder: "border-purple-500/20 bg-purple-500/5 text-purple-300/80",
  identity: "border-fuchsia-500/20 bg-fuchsia-500/5 text-fuchsia-300/80",
  grief: "border-slate-500/20 bg-slate-500/5 text-slate-300/80",
  joy: "border-yellow-500/20 bg-yellow-500/5 text-yellow-300/80",
};

const defaultStyle =
  "border-border/60 bg-muted/40 text-muted-foreground";

export function getCategoryBadgeClass(category: string): string {
  return categoryStyles[category] ?? defaultStyle;
}

interface CategoryBadgeProps {
  category: PostCategory;
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize tracking-wide",
        getCategoryBadgeClass(category)
      )}
    >
      {category}
    </span>
  );
}
