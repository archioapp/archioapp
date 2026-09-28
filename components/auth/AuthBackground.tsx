"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface AuthBackgroundProps {
  isActive?: boolean
  isSubmitting?: boolean
  isSuccess?: boolean
}

export function AuthBackground({ 
  isActive = false, 
  isSubmitting = false, 
  isSuccess = false 
}: AuthBackgroundProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Determine breathing animation class
  const breathingClass = isSubmitting 
    ? "auth-background-breathe-fast" 
    : "auth-background-breathe"

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Base deep slate background */}
      <div 
        className={cn(
          "absolute inset-0 transition-all duration-500",
          breathingClass,
          isSuccess && "brightness-105",
          isSubmitting && "brightness-[1.04]",
          isActive && !isSubmitting && "brightness-[1.02]"
        )}
        style={{
          background: 'linear-gradient(135deg, #080b14 0%, #0a0e1a 50%, #080b14 100%)'
        }}
      />

      {/* Radial depth gradient - creates 3D space perception */}
      <div 
        className="absolute inset-0"
        style={{
          background: `radial-gradient(
            ellipse 100% 80% at 50% 40%,
            rgba(20, 30, 50, 0.4) 0%,
            rgba(10, 14, 26, 0.7) 50%,
            rgba(8, 11, 20, 1) 100%
          )`
        }}
      />

      {/* Subtle grid pattern - precision/data feel */}
      <div 
        className={cn(
          "absolute inset-0 transition-opacity duration-500",
          isActive ? 'opacity-100' : 'opacity-40'
        )}
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, ${isActive ? '0.025' : '0.015'}) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, ${isActive ? '0.025' : '0.015'}) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px'
        }}
      />

      {/* Horizontal data lines - system activity indicator */}
      <div 
        className={cn(
          "absolute inset-0 transition-opacity duration-700",
          isActive ? 'opacity-100' : 'opacity-0'
        )}
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 47px,
            rgba(59, 130, 246, ${isSubmitting ? '0.02' : '0.012'}) 47px,
            rgba(59, 130, 246, ${isSubmitting ? '0.02' : '0.012'}) 48px
          )`,
          backgroundSize: '100% 48px'
        }}
      />

      {/* Central ambient glow - behind card area */}
      <div 
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-opacity duration-700",
          isActive ? 'opacity-100' : 'opacity-0'
        )}
      >
        <div 
          className="w-[600px] h-[700px]"
          style={{
            background: `radial-gradient(
              ellipse at center,
              rgba(59, 130, 246, ${isSubmitting ? '0.08' : '0.04'}) 0%,
              transparent 60%
            )`
          }}
        />
      </div>

      {/* Success radial wave effect */}
      {isSuccess && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="w-[1000px] h-[1000px] rounded-full auth-radial-wave"
            style={{
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15), transparent 70%)'
            }}
          />
        </div>
      )}

      {/* Top left system identifier */}
      <div className="absolute top-6 left-6 flex items-center gap-3">
        <div className={cn(
          "w-1.5 h-1.5 rounded-full transition-colors duration-300",
          isSuccess ? "bg-emerald-500/60" : isSubmitting ? "bg-blue-500/60 animate-pulse" : "bg-slate-700/50"
        )} />
        <span className="text-[10px] font-mono tracking-[0.2em] text-slate-600/30 uppercase">
          ARCHIOAI
        </span>
      </div>

      {/* Bottom status indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <div 
          className={cn(
            "w-1 h-1 rounded-full transition-colors duration-300",
            isSuccess 
              ? 'bg-emerald-500/70' 
              : isSubmitting 
                ? 'bg-blue-500/70 animate-pulse' 
                : 'bg-slate-600/30'
          )}
        />
        <span 
          className={cn(
            "text-[9px] font-mono tracking-[0.15em] uppercase transition-colors duration-300",
            isSuccess 
              ? 'text-emerald-500/50' 
              : isSubmitting 
                ? 'text-blue-500/40' 
                : 'text-slate-600/20'
          )}
        >
          {isSuccess ? 'ALIGNED' : isSubmitting ? 'VERIFYING' : 'READY'}
        </span>
      </div>

      {/* Side edge accents - desktop only */}
      <div className="hidden md:block absolute top-1/2 -translate-y-1/2 left-6">
        <div className={cn(
          "w-[1px] h-32 transition-all duration-500",
          isActive ? "opacity-20" : "opacity-5",
          "bg-gradient-to-b from-transparent via-blue-500 to-transparent"
        )} />
      </div>
      <div className="hidden md:block absolute top-1/2 -translate-y-1/2 right-6">
        <div className={cn(
          "w-[1px] h-32 transition-all duration-500",
          isActive ? "opacity-20" : "opacity-5",
          "bg-gradient-to-b from-transparent via-blue-500 to-transparent"
        )} />
      </div>
    </div>
  )
}
