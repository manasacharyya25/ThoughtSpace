import { cn } from "@/lib/utils";
import { errorStyles, fieldStyles, labelStyles } from "@/lib/design-system";
import { type InputHTMLAttributes, forwardRef } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={inputId} className={labelStyles}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            fieldStyles,
            "flex h-9 px-3 py-1",
            error && "border-red-500/50 focus-visible:ring-red-500/50",
            className
          )}
          {...props}
        />
        {error && <p className={errorStyles}>{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
