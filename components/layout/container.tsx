import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "full";
}

const sizes = {
  sm: "max-w-md",
  md: "max-w-3xl",
  lg: "max-w-6xl",
  full: "max-w-full",
};

export function Container({
  size = "lg",
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", sizes[size], className)}
      {...props}
    >
      {children}
    </div>
  );
}
