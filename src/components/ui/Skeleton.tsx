import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rounded" | "rectangular";
}

export function Skeleton({
  className,
  variant = "rounded",
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-slate-200/70",
        variant === "text" && "h-3.5 w-full rounded-md",
        variant === "circular" && "rounded-full",
        variant === "rounded" && "rounded-xl",
        variant === "rectangular" && "rounded-none",
        className
      )}
      {...props}
    />
  );
}
