"use client"

import { cn } from "@/lib/utils"

interface BreathingLineProps {
  className?: string
  isActive?: boolean
}

export function BreathingLine({ className, isActive = false }: BreathingLineProps) {
  return (
    <div 
      className={cn(
        "relative w-full h-px my-5",
        "transition-opacity duration-300",
        className
      )}
    >
      {/* Base line */}
      <div 
        className={cn(
          "w-full h-full",
          "transition-all duration-300",
          isActive 
            ? "bg-[rgba(59,130,246,0.12)]" 
            : "bg-[rgba(59,130,246,0.06)]"
        )}
      />
      
      {/* Center glow effect */}
      <div 
        className={cn(
          "absolute inset-0",
          "bg-gradient-to-r from-transparent via-blue-500/10 to-transparent",
          "transition-opacity duration-500",
          isActive ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  )
}
