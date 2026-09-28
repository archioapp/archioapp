"use client"

/* ═══════════════════════════════════════════════════════════════════════════
 *  GLASS SURFACE  ·  the shared "billion-dollar" glass primitive
 *  ─────────────────────────────────────────────────────────────────────────
 *  One source of truth for the Flight Deck glass language across the whole
 *  Execute system. Replicates the room-card DNA:
 *    1. theme-tinted hairline border (rest → hover brighten)
 *    2. top accent strip (fades L→R, brightest center)
 *    3. top-down radial glow ("lit from above")
 *    4. diagonal sheen sweep on hover (slow, luxe, one-shot)
 *    5. optional cursor reflection (radial at --mx/--my)
 *    6. optional slow conic edge-light ring (the "circular light movement")
 *
 *  Colour is supplied by the caller via `accent` (any CSS colour, incl.
 *  var(--vt-*) strings). All alpha tints go through `tintA` (color-mix), so we
 *  NEVER assume the accent is hex or an rgb triplet.
 * ═══════════════════════════════════════════════════════════════════════ */

import * as React from "react"
import { useReducedMotion } from "framer-motion"
import { GLASS_TONES, GLASS_MOTION, GLASS_SIDE, type GlassTone } from "./console-theme"

/** Alpha tint that works with ANY css colour, including custom-property strings. */
export function tintA(color: string, alpha: number): string {
  const pct = Math.max(0, Math.min(100, Math.round(alpha * 100)))
  return `color-mix(in srgb, ${color} ${pct}%, transparent)`
}

/** Resolve the working accent for a tone (buy/sell override the passed accent). */
export function toneAccent(tone: GlassTone, accent: string): string {
  if (tone === "buy") return GLASS_SIDE.buy
  if (tone === "sell") return GLASS_SIDE.sell
  return accent
}

/** Hook: track cursor position as --mx/--my CSS vars for the reflection layer. */
export function useCursorGlow() {
  const ref = React.useRef<HTMLDivElement | null>(null)
  const onMouseMove = React.useCallback((e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty("--mx", `${e.clientX - r.left}px`)
    el.style.setProperty("--my", `${e.clientY - r.top}px`)
  }, [])
  return { ref, onMouseMove }
}

/** Hydration-safe, CSS-identifier-safe unique id for per-instance keyframes.
 *  A module-level counter was used before — it drifts between server and
 *  client (the server module lives across requests, StrictMode double-invokes
 *  memos), so every GlassButton's `@keyframes` name mismatched on hydrate. */
function useGlassUid(prefix: string): string {
  const id = React.useId().replace(/[^a-zA-Z0-9_-]/g, "")
  return `${prefix}-${id}`
}

export interface GlassSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Working accent colour (any CSS colour). Buy/sell tones override this. */
  accent: string
  tone?: GlassTone
  /** Enable hover-state border/glow brighten + sheen. */
  interactive?: boolean
  /** @deprecated The diagonal sheen sweep was removed — hover now matches the
   *  Flight Deck room cards (hairline brighten + glow lift only). Accepted so
   *  existing call sites don't break; it has no effect. */
  sheen?: boolean
  /** Flight Deck "open glass": no fill, no blur, no border at rest — only a
   *  faint accent hairline + glow when hovered. Lets the cockpit background
   *  show through so the surface reads as part of the deck, not a card. */
  transparent?: boolean
  /** Show the slow rotating conic edge-light ring (primary surfaces only). */
  ring?: boolean
  /** Track cursor for a soft radial reflection (ticket / hero surfaces). */
  cursorGlow?: boolean
  /** Show the top accent strip. */
  strip?: boolean
  /** Corner radius. */
  radius?: number
  /** Force the "raised/active" look without hover (e.g. armed state). */
  forceActive?: boolean
  as?: "div" | "section"
}

/**
 * GlassSurface — wraps children in the layered glass DNA. Content should be
 * positioned above the layers (they are absolutely positioned, pointer-none).
 */
export function GlassSurface({
  accent,
  tone = "idle",
  interactive = true,
  sheen: _sheen = false,
  ring = false,
  cursorGlow = false,
  strip = true,
  radius = 16,
  forceActive = false,
  transparent = false,
  className,
  style,
  children,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
  as = "div",
  ...rest
}: GlassSurfaceProps) {
  const reduce = useReducedMotion() ?? false
  const [hover, setHover] = React.useState(false)
  const spec = GLASS_TONES[tone]
  const c = toneAccent(tone, accent)
  const raised = forceActive || (interactive && hover)
  const uid = useGlassUid("glass")
  const cursor = useCursorGlow()

  const borderA = raised ? spec.borderHover : spec.borderRest
  const glowA = raised ? spec.glowHover : spec.glowRest

  /* Flight Deck "open glass" — borderless + fully transparent at rest, a
     whisper hairline + lift only while hovered (the room-card behaviour). */
  const surfaceStyle: React.CSSProperties = transparent
    ? {
        borderRadius: radius,
        border: `1px solid ${raised ? tintA(c, 0.20) : "transparent"}`,
        background: "transparent",
        boxShadow: raised ? `0 10px 36px -14px ${tintA(c, 0.22)}` : "none",
        overflow: "hidden",
        transition: `border-color ${GLASS_MOTION.fadeSec}s, box-shadow ${GLASS_MOTION.fadeSec}s`,
      }
    : {
        borderRadius: radius,
        border: `1px solid ${tintA(c, borderA)}`,
        background: `linear-gradient(180deg, ${tintA(c, 0.05)} 0%, rgba(10,14,18,0.66) 38%, rgba(10,14,18,0.82) 100%)`,
        backdropFilter: "blur(26px) saturate(150%)",
        WebkitBackdropFilter: "blur(26px) saturate(150%)",
        boxShadow: raised
          ? `0 8px 34px -10px ${tintA(c, 0.30)}, inset 0 1px 0 ${tintA(c, 0.10)}`
          : `0 4px 18px rgba(0,0,0,0.28), inset 0 1px 0 ${tintA(c, 0.06)}`,
        overflow: "hidden",
        transition: `border-color ${GLASS_MOTION.fadeSec}s, box-shadow ${GLASS_MOTION.fadeSec}s`,
      }

  return React.createElement(
    as,
    {
      ...rest,
      ref: cursorGlow ? cursor.ref : undefined,
      className: `relative ${className ?? ""}`,
      style: {
        ...surfaceStyle,
        ...style,
      },
      onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => {
        setHover(true)
        onMouseEnter?.(e as React.MouseEvent<HTMLDivElement>)
      },
      onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => {
        setHover(false)
        onMouseLeave?.(e as React.MouseEvent<HTMLDivElement>)
      },
      onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => {
        if (cursorGlow) cursor.onMouseMove(e)
        onMouseMove?.(e as React.MouseEvent<HTMLDivElement>)
      },
    },
    <>
      {/* ── Top accent strip — fades at both ends ───────────────────────── */}
      {strip && (
        <span
          aria-hidden
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: 1,
            background: `linear-gradient(90deg, transparent 0%, ${tintA(c, spec.strip)} 50%, transparent 100%)`,
            opacity: raised ? 1 : 0.7,
            transition: `opacity ${GLASS_MOTION.fadeSec}s`,
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
      )}

      {/* ── Top-down radial glow — "lit from above" ─────────────────────── */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 120% 80% at 50% 0%, ${tintA(c, glowA)} 0%, transparent 65%)`,
          transition: `background ${GLASS_MOTION.fadeSec}s`,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── Cursor reflection — soft radial at pointer ──────────────────── */}
      {cursorGlow && !reduce && (
        <span
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(180px circle at var(--mx, 50%) var(--my, 0%), ${tintA(c, 0.10)} 0%, transparent 60%)`,
            opacity: raised ? 1 : 0.5,
            transition: "opacity 220ms",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      )}

      {/* ── Conic edge-light ring — slow circular light movement ────────── */}
      {ring && !reduce && (
        <span
          aria-hidden
          style={{
            position: "absolute",
            inset: -1,
            borderRadius: radius + 1,
            padding: 1,
            background: `conic-gradient(from var(--ring-from, 0deg), transparent 0deg, ${tintA(c, 0.55)} 70deg, transparent 150deg, transparent 360deg)`,
            WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            animation: `${uid}-ring ${GLASS_MOTION.ringSec}s linear infinite`,
            opacity: raised ? 0.9 : 0.5,
            transition: "opacity 240ms",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
      )}

      {/* NOTE: the diagonal sheen sweep was deliberately removed — hover now
          matches the Flight Deck room cards exactly: hairline brighten +
          top-glow lift, nothing sweeping across the surface. */}

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes ${uid}-ring {
          to { --ring-from: 360deg; }
        }
        @property --ring-from {
          syntax: '<angle>';
          inherits: false;
          initial-value: 0deg;
        }
      `,
        }}
      />

      {/* ── Content layer ───────────────────────────────────────────────── */}
      <div style={{ position: "relative", zIndex: 3, height: "100%" }}>{children}</div>
    </>,
  )
}

export interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  accent: string
  tone?: GlassTone
  /** Selected / pressed look. */
  selected?: boolean
  /** Showpiece treatment: conic ring + cursor glow (e.g. the EXECUTE button). */
  showpiece?: boolean
  radius?: number
}

/**
 * GlassButton — the pill / segmented variant of the glass DNA.
 * Used by Fast Entry actions, the side toggle, order-type segments, and the
 * armed EXECUTE control.
 */
export function GlassButton({
  accent,
  tone = "idle",
  selected = false,
  showpiece = false,
  radius = 10,
  className,
  style,
  children,
  disabled,
  ...rest
}: GlassButtonProps) {
  const reduce = useReducedMotion() ?? false
  const [hover, setHover] = React.useState(false)
  const spec = GLASS_TONES[tone]
  const c = toneAccent(tone, accent)
  const uid = useGlassUid("gbtn")
  const raised = (selected || hover || showpiece) && !disabled

  const borderA = raised ? spec.borderHover : spec.borderRest
  const fillA = selected ? 0.16 : raised ? 0.10 : 0.05

  return (
    <button
      {...rest}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`relative inline-flex items-center justify-center ${className ?? ""}`}
      style={{
        borderRadius: radius,
        border: `1px solid ${tintA(c, disabled ? 0.12 : borderA)}`,
        background: `linear-gradient(180deg, ${tintA(c, disabled ? 0.03 : fillA)} 0%, rgba(12,17,22,0.7) 100%)`,
        color: disabled ? tintA(c, 0.4) : selected ? c : tintA(c, 0.9),
        boxShadow: raised ? `0 4px 18px -6px ${tintA(c, 0.34)}, inset 0 1px 0 ${tintA(c, 0.12)}` : "none",
        cursor: disabled ? "not-allowed" : "pointer",
        overflow: "hidden",
        transition: "border-color 200ms, box-shadow 200ms, color 160ms",
        opacity: disabled ? 0.7 : 1,
        ...style,
      }}
    >
      {/* showpiece conic ring */}
      {showpiece && !reduce && !disabled && (
        <span
          aria-hidden
          style={{
            position: "absolute",
            inset: -1,
            borderRadius: radius + 1,
            padding: 1,
            background: `conic-gradient(from var(--ring-from, 0deg), transparent 0deg, ${tintA(c, 0.6)} 60deg, transparent 130deg, transparent 360deg)`,
            WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            animation: `${uid}-ring ${GLASS_MOTION.ringSec}s linear infinite`,
            pointerEvents: "none",
          }}
        />
      )}
      {/* hover = room-card quality only: hairline brighten + soft lift (no sheen) */}
      <style>{`
        @keyframes ${uid}-ring { to { --ring-from: 360deg; } }
      `}</style>
      <span style={{ position: "relative", zIndex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
        {children}
      </span>
    </button>
  )
}
