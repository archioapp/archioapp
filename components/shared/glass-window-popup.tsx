"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type Placement = "top" | "bottom" | "left" | "right"
type Align = "start" | "center" | "end"

export interface GlassWindowPopupProps {
  trigger: React.ReactNode
  children: React.ReactNode
  placement?: Placement
  align?: Align
  offset?: number
  width?: number | string
  className?: string
  popupClassName?: string
  shineDurationMs?: number // default 900
}

/**
 * GlassWindowPopup
 * - Full-surface frosted glass popup with diagonal shine sweep (runs once per hover).
 * - Mirrors the "GLASS" design system: dark frosted background, purple mesh, subtle border glow.
 */
export function GlassWindowPopup({
  trigger,
  children,
  placement = "right",
  align = "center",
  offset = 16,
  width = 520,
  className,
  popupClassName,
  shineDurationMs = 900,
}: GlassWindowPopupProps) {
  const [open, setOpen] = React.useState(false)
  const [shineKey, setShineKey] = React.useState(0)

  const onEnter = () => {
    setOpen(true)
    // restart shine animation on each hover
    setShineKey((k) => k + 1)
  }
  const onLeave = () => setOpen(false)

  const pos = React.useMemo(() => {
    const axis: string[] = []
    if (placement === "top") axis.push("bottom-full")
    if (placement === "bottom") axis.push("top-full")
    if (placement === "left") axis.push("right-full")
    if (placement === "right") axis.push("left-full")

    const alignCls: string[] = []
    if (placement === "top" || placement === "bottom") {
      if (align === "start") alignCls.push("left-0")
      if (align === "center") alignCls.push("left-1/2 -translate-x-1/2")
      if (align === "end") alignCls.push("right-0")
    } else {
      if (align === "start") alignCls.push("top-0")
      if (align === "center") alignCls.push("top-1/2 -translate-y-1/2")
      if (align === "end") alignCls.push("bottom-0")
    }
    return cn("absolute z-50", axis.join(" "), alignCls.join(" "))
  }, [placement, align])

  return (
    <div
      className={cn("relative inline-flex", className)}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
    >
      {/* Trigger */}
      <div className="cursor-pointer select-none">{trigger}</div>

      {/* Popup wrapper */}
      <div
        role="dialog"
        aria-hidden={!open}
        className={cn(
          pos,
          "transition-all duration-200",
          open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none",
        )}
        style={{
          marginTop: placement === "bottom" ? offset : undefined,
          marginBottom: placement === "top" ? offset : undefined,
          marginLeft: placement === "right" ? offset : undefined,
          marginRight: placement === "left" ? offset : undefined,
          width: typeof width === "number" ? `${width}px` : width,
        }}
      >
        <div
          className={cn(
            // Core "GLASS" container
            "relative overflow-hidden rounded-[18px]",
            // Darkness + blur to match screenshots (approx 14-18% opacity)
            "bg-[rgba(10,10,20,0.16)] backdrop-blur-[16px]",
            // Subtle white border plus purple rim
            "border border-white/10 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.6),0_0_0_1px_rgba(147,51,234,0.18)]",
            // Slight inner glow ring that intensifies when open
            open ? "ring-1 ring-[rgba(147,51,234,0.25)]" : "ring-1 ring-white/5",
            // Inner padding for content
            "p-4",
            popupClassName,
          )}
        >
          {/* Purple gradient mesh overlays to match the premium vibe */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(1200px 400px at -10% -20%, rgba(147,51,234,0.18) 0%, rgba(147,51,234,0.06) 30%, rgba(147,51,234,0) 60%), radial-gradient(600px 300px at 110% 120%, rgba(168,85,247,0.20) 0%, rgba(168,85,247,0.05) 40%, rgba(168,85,247,0) 65%)",
            }}
          />

          {/* Shine sweep: covers whole window, runs once per hover */}
          <div
            key={shineKey}
            aria-hidden="true"
            className="pointer-events-none absolute -inset-[30%] rotate-[20deg]"
            style={{
              background:
                "linear-gradient(130deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.18) 12%, rgba(255,255,255,0.06) 28%, rgba(255,255,255,0) 60%)",
              animation: open ? `glassSweep ${shineDurationMs}ms ease-in-out 1 forwards` : "none",
              opacity: 0,
            }}
          />

          {/* Foreground content */}
          <div className="relative text-zinc-200">{children}</div>
        </div>
      </div>

      {/* Keyframes */}
      <style jsx>{`
        @keyframes glassSweep {
          0% {
            transform: translateX(-65%) translateY(-10%) rotate(20deg);
            opacity: 0.0;
          }
          10% {
            opacity: 0.55;
          }
          50% {
            opacity: 0.35;
          }
          100% {
            transform: translateX(65%) translateY(10%) rotate(20deg);
            opacity: 0.0;
          }
        }
      `}</style>
    </div>
  )
}

export default GlassWindowPopup
