"use client"

import Image from "next/image"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type Variant = "laptop" | "phone" | "bare" | "rail"

interface DeviceFrameProps {
  src: string
  alt: string
  variant?: Variant
  label?: string
  priority?: boolean
  className?: string
  imageClassName?: string
  aspect?: string
  children?: ReactNode
  /** visible shine/sheen overlay across the top */
  sheen?: boolean
  /** sizes prop forwarded to next/image */
  sizes?: string
  /** optional router-style label rendered in a top address strip */
  route?: string
}

/**
 * DeviceFrame — a single, disciplined frame wrapper for every product screenshot
 * on the Archio landing page. Four variants share a unified chrome language:
 *
 *   - laptop : wide 16:10 canvas with a subtle title strip (great for dashboards)
 *   - phone  : narrow 9:19 canvas for vertical compositions
 *   - rail   : 3:4 vertical "rail" for right-side copilot panels
 *   - bare   : no strip, just the border + rounding (for hero orbit frames)
 *
 * Chrome language (design spec):
 *   - 1px rgba(255,255,255,0.08) border
 *   - rounded-2xl corners
 *   - inset 0 1px 0 rgba(255,255,255,0.06) top highlight
 *   - soft drop shadow under 10% opacity
 *   - optional faint top gradient sheen
 */
export function DeviceFrame({
  src,
  alt,
  variant = "laptop",
  label,
  route,
  priority = false,
  className,
  imageClassName,
  aspect,
  children,
  sheen = true,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: DeviceFrameProps) {
  const aspectClass =
    aspect ??
    (variant === "phone"
      ? "aspect-[9/19]"
      : variant === "rail"
        ? "aspect-[3/4]"
        : "aspect-[16/10]")

  const showTopStrip = variant === "laptop" || variant === "rail"

  return (
    <div
      className={cn(
        "group relative isolate overflow-hidden rounded-2xl",
        "border border-white/[0.08] bg-[#0a0b0f]",
        "shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.06)]",
        "ring-1 ring-inset ring-white/[0.02]",
        className,
      )}
    >
      {/* top gradient sheen */}
      {sheen && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-20 h-16 bg-gradient-to-b from-white/[0.05] to-transparent"
        />
      )}

      {/* corner vignette — adds premium weight without adding color */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 rounded-2xl shadow-[inset_0_0_60px_rgba(0,0,0,0.45)]"
      />

      {/* optional title / route strip */}
      {showTopStrip && (
        <div className="relative z-10 flex h-8 items-center justify-between border-b border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent px-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-white/15" />
            <span className="h-2 w-2 rounded-full bg-white/12" />
            <span className="h-2 w-2 rounded-full bg-white/10" />
          </div>
          {(label || route) && (
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
              {label ?? route}
            </span>
          )}
          <span className="h-2 w-2 opacity-0" />
        </div>
      )}

      {/* screen */}
      <div className={cn("relative z-0", aspectClass)}>
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={cn("object-cover object-top", imageClassName)}
        />
        {/* subtle scanline tone so low-res screenshots read as "screen" not "image" */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,transparent_30%,transparent_70%,rgba(0,0,0,0.25)_100%)]"
        />
      </div>

      {children}
    </div>
  )
}
