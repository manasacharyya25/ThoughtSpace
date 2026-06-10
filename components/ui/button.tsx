import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-[background-color,border-color,color] duration-300 ease focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/10 disabled:pointer-events-none disabled:opacity-50";

const variants = {
  default:
    "bg-accent text-accent-foreground border border-transparent hover:bg-accent/90",
  outline:
    "border border-border bg-transparent text-foreground hover:border-white/10 hover:bg-muted/40",
  ghost:
    "border border-transparent text-foreground hover:bg-muted/40",
};

const sizes = {
  default: "h-9 px-4 py-2 text-sm",
  sm: "h-8 px-3 text-xs",
  lg: "h-11 px-6 text-sm",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
