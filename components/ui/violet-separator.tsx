import { cn } from "@/lib/utils";

interface VioletSeparatorProps {
  className?: string;
}

export function VioletSeparator({ className }: VioletSeparatorProps) {
  return (
    <div
      className={cn("relative h-px w-full", className)}
      role="separator"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-border/80" />
      <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-violet-500/35 via-violet-500/10 to-transparent" />
    </div>
  );
}
