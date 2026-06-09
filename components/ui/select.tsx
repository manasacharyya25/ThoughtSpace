import { cn } from "@/lib/utils";
import { errorStyles, fieldStyles, labelStyles } from "@/lib/design-system";
import { type SelectHTMLAttributes, forwardRef } from "react";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, children, ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={selectId} className={labelStyles}>
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            fieldStyles,
            "flex h-9 cursor-pointer appearance-none px-3 py-1",
            error && "border-red-500/50 focus-visible:ring-red-500/50",
            className
          )}
          {...props}
        >
          {children}
        </select>
        {error && <p className={errorStyles}>{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
