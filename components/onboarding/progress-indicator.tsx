import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressIndicator({
  currentStep,
  totalSteps,
}: ProgressIndicatorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span>
          Step {currentStep + 1} of {totalSteps}
        </span>
        <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}%</span>
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-all duration-500",
              i <= currentStep ? "bg-foreground/80" : "bg-border/60"
            )}
          />
        ))}
      </div>
    </div>
  );
}
