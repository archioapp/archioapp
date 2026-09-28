"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "secondary"
  size?: "sm" | "md" | "icon"
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition focus:outline-none",
          variant === "default" && "bg-blue-600 text-white hover:bg-blue-700",
          variant === "ghost" && "hover:bg-zinc-800/50",
          variant === "secondary" && "bg-zinc-800 text-zinc-100 hover:bg-zinc-700",
          size === "sm" && "h-8 px-3",
          size === "md" && "h-10 px-4",
          size === "icon" && "h-9 w-9",
          className,
        )}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"
