import { cn } from "@/lib/utils";
import { errorStyles, fieldStyles, labelStyles } from "@/lib/design-system";
import { type TextareaHTMLAttributes, forwardRef } from "react";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={textareaId} className={labelStyles}>
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            fieldStyles,
            "min-h-[80px] resize-y px-3 py-2",
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

Textarea.displayName = "Textarea";
