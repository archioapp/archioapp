"use client"

import { forwardRef, type ButtonHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
  isSuccess?: boolean
  isError?: boolean
  loadingText?: string
  successText?: string
}

export const AuthButton = forwardRef<HTMLButtonElement, AuthButtonProps>(
  ({ 
    children, 
    isLoading, 
    isSuccess,
    isError,
    loadingText = "VERIFYING",
    successText = "ENTERING",
    className, 
    disabled,
    ...props 
  }, ref) => {
    const isDisabled = disabled || isLoading || isSuccess

    // Determine button text
    const buttonText = isSuccess 
      ? successText 
      : isLoading 
        ? loadingText 
        : children

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          // Base structure - NO border radius for precision
          "relative w-full overflow-hidden",
          // Sizing
          "h-12 px-6",
          // Typography
          "font-mono text-[13px] font-medium tracking-[0.2em] uppercase",
          // Colors
          "text-slate-200/90",
          // Background
          "bg-[rgba(25,35,60,0.85)]",
          // Border - NO radius
          "border border-[rgba(59,130,246,0.12)]",
          // Transitions
          "transition-all duration-150",
          // Hover state - magnetism effect
          !isDisabled && [
            "hover:bg-[rgba(40,55,90,0.95)]",
            "hover:border-[rgba(59,130,246,0.3)]",
            "hover:text-white",
            "hover:-translate-y-[1px]",
            "hover:shadow-[0_4px_20px_rgba(59,130,246,0.15),0_0_40px_rgba(59,130,246,0.08)]"
          ],
          // Active/press state - physical feedback
          !isDisabled && [
            "active:scale-[0.98]",
            "active:translate-y-0",
            "active:shadow-[0_2px_10px_rgba(59,130,246,0.2)]"
          ],
          // Loading state
          isLoading && [
            "cursor-wait",
            "bg-[rgba(35,50,85,0.9)]",
            "border-[rgba(59,130,246,0.25)]",
            "text-white/90"
          ],
          // Success state
          isSuccess && [
            "bg-[rgba(45,65,110,0.95)]",
            "border-[rgba(59,130,246,0.4)]",
            "shadow-[0_0_30px_rgba(59,130,246,0.2)]",
            "text-white"
          ],
          // Error shake
          isError && "auth-button-shake",
          // Disabled state
          isDisabled && !isLoading && !isSuccess && [
            "opacity-40",
            "cursor-not-allowed"
          ],
          className
        )}
        {...props}
      >
        {/* Text content */}
        <span 
          className={cn(
            "relative z-10 flex items-center justify-center gap-2 transition-opacity duration-100",
            isLoading && "opacity-90"
          )}
        >
          {buttonText}
          {isLoading && (
            <span className="inline-flex gap-[3px]">
              <span className="w-1 h-1 bg-blue-400/60 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
              <span className="w-1 h-1 bg-blue-400/60 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
              <span className="w-1 h-1 bg-blue-400/60 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
            </span>
          )}
        </span>

        {/* Loading progress bar at bottom */}
        {isLoading && (
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[rgba(59,130,246,0.15)] overflow-hidden">
            <div 
              className="h-full bg-blue-500/50 animate-pulse"
              style={{
                animation: 'loadingBar 1.5s ease-in-out infinite',
              }}
            />
          </div>
        )}

        {/* Success glow overlay */}
        {isSuccess && (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.1), transparent)',
              animation: 'successGlow 0.6s ease-out'
            }}
          />
        )}

        {/* Inner top edge highlight */}
        <div 
          className={cn(
            "absolute top-0 left-0 right-0 h-[1px] transition-opacity duration-150",
            "bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.06)] to-transparent",
            (isLoading || isSuccess) ? "opacity-100" : "opacity-50"
          )}
        />
      </button>
    )
  }
)

AuthButton.displayName = "AuthButton"

// Add the keyframes to the global styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = `
    @keyframes loadingBar {
      0% { transform: translateX(-100%); width: 50%; }
      50% { transform: translateX(100%); width: 50%; }
      100% { transform: translateX(200%); width: 50%; }
    }
    @keyframes successGlow {
      0% { opacity: 0; transform: translateX(-100%); }
      50% { opacity: 1; }
      100% { opacity: 0; transform: translateX(100%); }
    }
  `
  if (!document.querySelector('[data-auth-button-styles]')) {
    style.setAttribute('data-auth-button-styles', '')
    document.head.appendChild(style)
  }
}
