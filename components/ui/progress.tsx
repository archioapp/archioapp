"use client"

import type * as React from "react"
import { cn } from "@/lib/utils"

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
}

export function Progress({ value = 0, className, ...props }: ProgressProps) {
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      className={cn("relative h-2 w-full overflow-hidden rounded bg-zinc-800", className)}
      {...props}
    >
      <div className="h-full bg-blue-600 transition-all" style={{ width: `${value}%` }} />
    </div>
  )
}
