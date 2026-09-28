"use client"

/* ═══════════════════════════════════════════════════════════════════════════
   ARCHIO · FLIGHT DECK · CONTROLS — glass primitives + loadout revolver
   ───────────────────────────────────────────────────────────────────────────
   Shared cinematic glass building blocks for Controls Mode, plus the 3D
   loadout "revolver" (a depth coverflow of the 6 persona loadouts). All
   colour comes from the live ThemeAccent (`accent.rgb` → rgba()), never raw
   hex, so it tracks all 7 themes. All motion is reduced-motion-safe.
   ═══════════════════════════════════════════════════════════════════════════ */

import { memo, useCallback, useMemo, useRef, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"

import { VT, rgba } from "@/components/vantary-glass"
import type { ThemeAccent } from "@/components/vantary-glass"
import type { FlightDeckTemplate } from "@/lib/cartouche/flight-deck-templates"
import { defaultSnapshotFromTemplate } from "@/lib/cartouche/use-active-template"
import type { WingSnapshot } from "@/lib/cartouche/use-active-template"

/* ───────────────────────────────────────────────────────────────────────────
   ControlsGlass — the signature surface. Layered: base tint, top-down glow,
   conic edge-light ring (slow), diagonal sheen on hover, hairline border.
   ─────────────────────────────────────────────────────────────────────────── */
export const ControlsGlass = memo(function ControlsGlass({
  accent,
  active = false,
  ring = false,
  sheen = false,
  radius = 16,
  className,
  style,
  children,
  ...rest
}: {
  accent: ThemeAccent
  active?: boolean
  ring?: boolean
  sheen?: boolean
  radius?: number
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>) {
  const reduce = useReducedMotion()
  const [hover, setHover] = useState(false)

  return (
    <div
      {...rest}
      onMouseEnter={(e) => { setHover(true); rest.onMouseEnter?.(e) }}
      onMouseLeave={(e) => { setHover(false); rest.onMouseLeave?.(e) }}
      className={className}
      style={{
        position: "relative",
        borderRadius: radius,
        border: `1px solid ${rgba(accent.rgb, active ? 0.42 : hover ? 0.3 : 0.16)}`,
        background: rgba(accent.rgb, active ? 0.07 : 0.03),
        backdropFilter: "blur(22px) saturate(1.15)",
        WebkitBackdropFilter: "blur(22px) saturate(1.15)",
        overflow: "hidden",
        transition: "border-color .3s ease, background .3s ease",
        ...style,
      }}
    >
      {/* top-down glow */}
      <span
        aria-hidden
        style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: `radial-gradient(120% 80% at 50% -10%, ${rgba(accent.rgb, active ? 0.16 : hover ? 0.1 : 0.05)}, transparent 60%)`,
          transition: "opacity .3s ease",
        }}
      />
      {/* conic edge-light ring */}
      {ring && !reduce && (
        <motion.span
          aria-hidden
          animate={{ rotate: 360 }}
          transition={{ duration: 7.5, ease: "linear", repeat: Infinity }}
          style={{
            position: "absolute", inset: -1, borderRadius: radius, padding: 1, pointerEvents: "none",
            background: `conic-gradient(from 0deg, transparent 0deg, ${rgba(accent.rgb, 0.5)} 40deg, transparent 120deg, transparent 360deg)`,
            WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor", maskComposite: "exclude",
            opacity: active ? 0.9 : 0.4,
          }}
        />
      )}
      {/* diagonal sheen on hover */}
      {sheen && !reduce && (
        <motion.span
          aria-hidden
          initial={false}
          animate={{ x: hover ? "180%" : "-120%" }}
          transition={{ duration: 1.4, ease: [0.22, 0.61, 0.36, 1] }}
          style={{
            position: "absolute", top: 0, bottom: 0, width: "55%", pointerEvents: "none",
            background: `linear-gradient(105deg, transparent, ${rgba(accent.rgb, 0.14)}, transparent)`,
            transform: "skewX(-18deg)",
          }}
        />
      )}
      <div style={{ position: "relative", zIndex: 1, height: "100%" }}>{children}</div>
    </div>
  )
})

/* ───────────────────────────────────────────────────────────────────────────
   WingMiniDiagram — the 3×2 gadget silhouette rendered from a snapshot.
   Each gadget becomes a tile sized to its declared col-span. Pure visual.
   ─────────────────────────────────────────────────────────────────────────── */
function sizeToSpan(size: "s" | "m" | "l"): number {
  return size === "l" ? 3 : size === "m" ? 2 : 1
}

export const WingMiniDiagram = memo(function WingMiniDiagram({
  accent,
  ids,
  sizeOf,
  emphasis = 1,
}: {
  accent: ThemeAccent
  ids: readonly string[]
  sizeOf: (id: string) => "s" | "m" | "l"
  emphasis?: number
}) {
  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 3,
        width: "100%",
      }}
    >
      {ids.map((id, i) => (
        <span
          key={`${id}-${i}`}
          aria-hidden
          style={{
            gridColumn: `span ${sizeToSpan(sizeOf(id))}`,
            height: 14,
            borderRadius: 4,
            border: `1px solid ${rgba(accent.rgb, 0.3 * emphasis)}`,
            background: rgba(accent.rgb, 0.1 * emphasis),
          }}
        />
      ))}
    </div>
  )
})

/* ───────────────────────────────────────────────────────────────────────────
   LoadoutCard — one persona loadout in the revolver. Shows name, persona,
   both wing mini-diagrams, and a select affordance.
   ─────────────────────────────────────────────────────────────────────────── */
export const LoadoutCard = memo(function LoadoutCard({
  accent,
  template,
  sizeOf,
  isActive,
  isFocused,
  onFocus,
  onApply,
  onPreview,
  onPreviewEnd,
}: {
  accent: ThemeAccent
  template: FlightDeckTemplate
  sizeOf: (id: string) => "s" | "m" | "l"
  isActive: boolean
  isFocused: boolean
  onFocus: () => void
  onApply: () => void
  onPreview: () => void
  onPreviewEnd: () => void
}) {
  const snap = useMemo(() => defaultSnapshotFromTemplate(template), [template])

  return (
    <ControlsGlass
      accent={accent}
      active={isActive || isFocused}
      ring={isFocused}
      sheen
      radius={14}
      role="button"
      tabIndex={0}
      aria-pressed={isActive}
      aria-label={`${template.name} loadout — ${template.persona}`}
      onClick={onFocus}
      onDoubleClick={onApply}
      onMouseEnter={onPreview}
      onMouseLeave={onPreviewEnd}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onApply() }
      }}
      style={{ cursor: "pointer", width: "100%", height: "100%" }}
    >
      <div className="flex flex-col" style={{ gap: 10, padding: 14, height: "100%" }}>
        <div className="flex items-start justify-between" style={{ gap: 8 }}>
          <div className="flex flex-col" style={{ gap: 2, minWidth: 0 }}>
            <span
              className="font-sans"
              style={{ fontSize: 14, fontWeight: 600, color: VT.paper, lineHeight: 1.2 }}
            >
              {template.name}
            </span>
            <span
              className="font-mono uppercase truncate"
              style={{ fontSize: 8, letterSpacing: "0.14em", color: VT.ashSoft }}
            >
              {template.persona}
            </span>
          </div>
          {isActive && (
            <span
              className="font-mono uppercase"
              style={{
                fontSize: 7.5, letterSpacing: "0.16em", fontWeight: 600,
                color: accent.hex, padding: "2px 6px", borderRadius: 999,
                border: `1px solid ${rgba(accent.rgb, 0.4)}`, background: rgba(accent.rgb, 0.1),
                flexShrink: 0,
              }}
            >
              ACTIVE
            </span>
          )}
        </div>

        {/* wing diagrams */}
        <div className="flex items-center" style={{ gap: 8, marginTop: 2 }}>
          <div className="flex flex-col" style={{ gap: 3, flex: 1 }}>
            <span className="font-mono uppercase" style={{ fontSize: 6.5, letterSpacing: "0.16em", color: VT.ashSoft }}>LEFT</span>
            <WingMiniDiagram accent={accent} ids={snap.left} sizeOf={sizeOf} />
          </div>
          <span aria-hidden style={{ width: 1, alignSelf: "stretch", background: rgba(accent.rgb, 0.16) }} />
          <div className="flex flex-col" style={{ gap: 3, flex: 1 }}>
            <span className="font-mono uppercase" style={{ fontSize: 6.5, letterSpacing: "0.16em", color: VT.ashSoft }}>RIGHT</span>
            <WingMiniDiagram accent={accent} ids={snap.right} sizeOf={sizeOf} />
          </div>
        </div>

        <span style={{ flex: 1 }} />

        <p
          className="font-sans"
          style={{ fontSize: 10.5, lineHeight: 1.45, color: VT.ash, margin: 0,
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
        >
          {template.rationale}
        </p>
      </div>
    </ControlsGlass>
  )
})

/* ───────────────────────────────────────────────────────────────────────────
   LoadoutRevolver — a horizontally scrollable depth coverflow of loadouts.
   The focused card is centered and lifted; flanking cards recede in z.
   ─────────────────────────────────────────────────────────────────────────── */
export const LoadoutRevolver = memo(function LoadoutRevolver({
  accent,
  templates,
  activeId,
  sizeOf,
  onApply,
  onPreview,
  onPreviewEnd,
}: {
  accent: ThemeAccent
  templates: readonly FlightDeckTemplate[]
  activeId: string
  sizeOf: (id: string) => "s" | "m" | "l"
  onApply: (snapshot: WingSnapshot, template: FlightDeckTemplate) => void
  onPreview: (snapshot: WingSnapshot) => void
  onPreviewEnd: () => void
}) {
  const reduce = useReducedMotion()
  const initialFocus = Math.max(0, templates.findIndex((t) => t.id === activeId))
  const [focus, setFocus] = useState(initialFocus < 0 ? 0 : initialFocus)
  const trackRef = useRef<HTMLDivElement>(null)

  const apply = useCallback(
    (t: FlightDeckTemplate) => onApply(defaultSnapshotFromTemplate(t), t),
    [onApply],
  )

  return (
    <div className="relative w-full" style={{ perspective: 1400 }}>
      <div
        ref={trackRef}
        className="flex items-stretch"
        style={{
          gap: 14,
          overflowX: "auto",
          padding: "8px 4px 14px",
          scrollSnapType: "x mandatory",
          transformStyle: "preserve-3d",
        }}
      >
        {templates.map((t, i) => {
          const dist = i - focus
          const isFocused = dist === 0
          const depth = reduce ? 0 : Math.min(Math.abs(dist), 2)
          return (
            <motion.div
              key={t.id}
              animate={{
                scale: reduce ? 1 : isFocused ? 1 : 0.92 - depth * 0.02,
                rotateY: reduce ? 0 : dist * -6,
                opacity: depth >= 2 ? 0.55 : 1,
                z: reduce ? 0 : -depth * 40,
              }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              style={{
                flex: "0 0 auto",
                width: 246,
                scrollSnapAlign: "center",
                transformStyle: "preserve-3d",
              }}
            >
              <LoadoutCard
                accent={accent}
                template={t}
                sizeOf={sizeOf}
                isActive={t.id === activeId}
                isFocused={isFocused}
                onFocus={() => setFocus(i)}
                onApply={() => apply(t)}
                onPreview={() => { setFocus(i); onPreview(defaultSnapshotFromTemplate(t)) }}
                onPreviewEnd={onPreviewEnd}
              />
            </motion.div>
          )
        })}
      </div>
    </div>
  )
})
