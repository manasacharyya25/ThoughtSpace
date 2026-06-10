import type { ElementType, ReactNode } from "react";
import { staggerStyle } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface FadeInProps {
  children: ReactNode;
  index?: number;
  className?: string;
  as?: ElementType;
}

export function FadeIn({
  children,
  index = 0,
  className,
  as: Tag = "div",
}: FadeInProps) {
  return (
    <Tag className={cn("fade-in-up", className)} style={staggerStyle(index)}>
      {children}
    </Tag>
  );
}
