"use client"

import { forwardRef, useState, type InputHTMLAttributes } from "react"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"

interface AuthInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
  type?: 'text' | 'email' | 'password'
  error?: string
  isValid?: boolean
  onFocusChange?: (focused: boolean) => void
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ 
    label, 
    type = 'text', 
    error, 
    isValid,
    className, 
    onFocus, 
    onBlur,
    onFocusChange,
    disabled,
    ...props 
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const isPassword = type === 'password'
    const inputType = isPassword && showPassword ? 'text' : type

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      onFocusChange?.(true)
      onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      onFocusChange?.(false)
      onBlur?.(e)
    }

    return (
      <div className="relative">
        {/* Label */}
        <label 
          className={cn(
            "block text-[11px] font-mono tracking-[0.1em] uppercase mb-2.5 transition-all duration-150",
            isFocused 
              ? "text-slate-200/90" 
              : "text-slate-500/80",
            error && "text-red-400/80"
          )}
        >
          {label}
        </label>

        {/* Input container */}
        <div className="relative">
          {/* Left indicator line - appears on focus */}
          <div 
            className={cn(
              "absolute left-0 top-0 bottom-0 w-[2px] transition-all duration-150 origin-center",
              isFocused 
                ? "opacity-100 scale-y-100" 
                : "opacity-0 scale-y-0",
              error 
                ? "bg-red-500/60" 
                : isValid 
                  ? "bg-emerald-500/60" 
                  : "bg-blue-500/50"
            )}
          />

          {/* Input field - NO border radius for precision */}
          <input
            ref={ref}
            type={inputType}
            disabled={disabled}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={cn(
              // Base styles
              "w-full h-11 px-4",
              // Typography - monospace for precision feel
              "font-mono text-[14px] tracking-wide",
              // Colors
              "text-slate-100 placeholder:text-slate-600/60",
              // Background
              "bg-[rgba(25,30,45,0.7)]",
              // Border - NO radius
              "border",
              "border-[rgba(100,120,140,0.15)]",
              // Focus styles
              "focus:outline-none",
              "focus:border-[rgba(59,130,246,0.35)]",
              "focus:bg-[rgba(35,45,65,0.85)]",
              "focus:shadow-[0_0_0_1px_rgba(59,130,246,0.1),0_0_20px_rgba(59,130,246,0.06)]",
              // Caret color matches accent
              "caret-blue-400",
              // Transitions
              "transition-all duration-150",
              // Password field needs space for eye icon
              isPassword && "pr-12",
              // Error state
              error && [
                "border-red-500/40",
                "focus:border-red-500/50",
                "focus:shadow-[0_0_0_1px_rgba(239,68,68,0.1),0_0_20px_rgba(239,68,68,0.06)]"
              ],
              // Valid state
              isValid && !error && [
                "border-emerald-500/25",
                "focus:border-emerald-500/40"
              ],
              // Disabled state
              disabled && [
                "opacity-50",
                "cursor-not-allowed",
                "bg-[rgba(20,25,35,0.5)]"
              ],
              className
            )}
            {...props}
          />

          {/* Password show/hide toggle */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={disabled}
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2",
                "p-1.5 -m-1.5",
                "text-slate-500 hover:text-slate-300",
                "transition-all duration-150",
                "focus:outline-none focus:text-blue-400",
                isFocused ? "opacity-80" : "opacity-40 hover:opacity-60",
                disabled && "cursor-not-allowed opacity-20",
                showPassword && "text-blue-400/70"
              )}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {/* Error message */}
        {error && (
          <p className="mt-2 text-[11px] font-mono text-red-400/90 tracking-wide">
            {error}
          </p>
        )}
      </div>
    )
  }
)

AuthInput.displayName = "AuthInput"
