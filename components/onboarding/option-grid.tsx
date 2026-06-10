import { cn } from "@/lib/utils";

interface OptionGridProps {
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  columns?: 2 | 3;
}

export function OptionGrid({
  options,
  value,
  onChange,
  columns = 2,
}: OptionGridProps) {
  return (
    <div
      className={cn(
        "grid gap-2",
        columns === 3 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2"
      )}
    >
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={cn(
            "soft-interactive rounded-xl border px-3 py-3 text-left text-sm",
            value === option
              ? "border-white/10 bg-muted/50 text-heading"
              : "border-border bg-muted/20 text-muted-foreground hover:border-white/10 hover:bg-muted/40 hover:text-foreground"
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
