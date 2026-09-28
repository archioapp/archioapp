"use client"

import { forwardRef, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface AuthCardProps {
  children: ReactNode
  className?: string
  isHovered?: boolean
  isFocused?: boolean
  isSubmitting?: boolean
  isSuccess?: boolean
}

export const AuthCard = forwardRef<HTMLDivElement, AuthCardProps>(
  ({ children, className, isHovered, isFocused, isSubmitting, isSuccess }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base structure - NO border radius for precision edges
          "relative w-full max-w-[400px] mx-auto",
          // Padding
          "p-8 md:p-10",
          // Background - deep slate with slight transparency
          "bg-[rgba(12,15,24,0.97)]",
          // Border - precision edge
          "border border-[rgba(59,130,246,0.08)]",
          // Base shadow - creates depth
          "shadow-[0_20px_40px_rgba(0,0,0,0.5)]",
          // Inset glow - interior lighting
          "[box-shadow:0_20px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.02),inset_0_0_1px_rgba(59,130,246,0.04)]",
          // Transitions
          "transition-all duration-200 ease-out",
          // Hover state - card lifts and border becomes visible
          isHovered && !isSubmitting && [
            "border-[rgba(59,130,246,0.12)]",
            "shadow-[0_25px_60px_rgba(0,0,0,0.6)]",
            "[box-shadow:0_25px_60px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.03),inset_0_0_2px_rgba(59,130,246,0.06)]",
          ],
          // Focus state - input is active
          isFocused && [
            "border-[rgba(59,130,246,0.18)]",
            "shadow-[0_30px_70px_rgba(0,0,0,0.5),0_0_40px_rgba(59,130,246,0.08)]",
            "[box-shadow:0_30px_70px_rgba(0,0,0,0.5),0_0_40px_rgba(59,130,246,0.08),inset_0_1px_0_rgba(255,255,255,0.04),inset_0_0_3px_rgba(59,130,246,0.08)]"
          ],
          // Submitting state - intense focus
          isSubmitting && [
            "border-[rgba(59,130,246,0.25)]",
            "shadow-[0_30px_80px_rgba(59,130,246,0.15)]",
            "bg-[rgba(15,20,32,0.98)]"
          ],
          // Success state - fade out
          isSuccess && "auth-card-fade-out pointer-events-none",
          className
        )}
      >
        {/* Inner radial glow - appears when focused/submitting */}
        <div 
          className={cn(
            "absolute inset-0 pointer-events-none transition-opacity duration-300",
            (isFocused || isSubmitting) ? "opacity-100" : "opacity-0"
          )}
          style={{
            background: `radial-gradient(
              ellipse 80% 60% at 50% 0%,
              rgba(59, 130, 246, ${isSubmitting ? '0.06' : '0.03'}) 0%,
              transparent 70%
            )`
          }}
        />
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    )
  }
)

AuthCard.displayName = "AuthCard"
