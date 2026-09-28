"use client"

import type * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outline"
}

export const Badge = ({ className, variant = "default", ...props }: BadgeProps) => (
  <div
    className={cn(
      "inline-flex select-none items-center rounded border px-2 py-0.5 text-xs",
      variant === "default" ? "border-transparent bg-zinc-800 text-zinc-200" : "border-zinc-700 text-zinc-300",
      className,
    )}
    {...props}
  />
)
