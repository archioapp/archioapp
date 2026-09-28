"use client"

import { cn } from "@/lib/utils"

interface AuthLogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  title?: string
}

export function AuthLogo({ className, size = 'md', title = 'ACCESS PLATFORM' }: AuthLogoProps) {
  const sizes = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-10 h-10 text-xl',
    lg: 'w-12 h-12 text-2xl'
  }

  return (
    <div className={cn("flex flex-col items-center gap-4 mb-6", className)}>
      {/* Logo mark - precision edges, no border-radius */}
      <div 
        className={cn(
          "flex items-center justify-center",
          "bg-gradient-to-br from-blue-500/90 to-blue-700/90",
          // Using subtle corners, not full rounded
          "rounded-lg",
          "shadow-[0_4px_24px_rgba(59,130,246,0.25)]",
          "border border-blue-400/20",
          sizes[size]
        )}
      >
        <span className="font-bold text-white tracking-tight">A</span>
      </div>

      {/* Title */}
      <div className="text-center">
        <h1 className="text-[13px] font-mono tracking-[0.2em] text-slate-300/70 uppercase">
          {title}
        </h1>
      </div>
    </div>
  )
}
