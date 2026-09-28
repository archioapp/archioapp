/* ═══════════════════════════════════════════════════════════════════════
   SLIDE COLOR REMAP
   ═══════════════════════════════════════════════════════════════════════
   The 9 external pitch slide files (Cover, BrokenWorkflow, Market,
   Solution, Platform, Built, Partial, Roadmap, Ask) and the 4 inline
   product slides contain ~600 hardcoded color references — hex codes
   and rgba() patterns — baked into inline `style` attributes and SVG
   fill / stroke / stop-color attributes.

   Re-authoring every slide to thread a theme palette would touch
   thousands of lines. Instead, this module exposes a tiny DOM
   remapping engine that:

     1. Builds a hex→hex map and rgb→rgb map from the active theme.
     2. Walks the slide subtree (passed by ref) and rewrites every
        `style` attr + every SVG color attribute in place.
     3. Re-runs via a MutationObserver whenever React reapplies
        styles (framer-motion entrances, hover state changes, etc.)
        so the theming sticks across re-renders.

   The semantic map:

     SOURCE HEX (in slide source)    →   THEME TOKEN
     ─────────────────────────────────────────────────────────────
     #10B981 emerald (success/grow)  →   theme.chartUp
     #34D399 mint                    →   theme.chartUp
     #22C55E green                   →   theme.chartUp
     #0D8F3A deep green              →   theme.chartUp
     #00FF9F, #00E5A0, #00FF88, #3DDC84  → theme.chartUp (already
       theme-aligned in some themes but normalize anyway)

     #8B5CF6 violet (intelligence)   →   theme.secondary
     #A78BFA lighter violet          →   theme.secondary
     #A855F7 purple                  →   theme.secondary
     #6366F1 indigo                  →   theme.secondary
     #818CF8 lighter indigo          →   theme.secondary
     #5865F2 discord                 →   theme.secondary

     #06B6D4 cyan (data/comms)       →   theme.tertiary
     #22D3EE lighter cyan            →   theme.tertiary
     #0698CE deep cyan               →   theme.tertiary
     #0088CC telegram                →   theme.tertiary

     #3B82F6 blue                    →   theme.tertiary
     #2962FF deeper blue             →   theme.tertiary
     #60A5FA light blue              →   theme.tertiary

     #EF4444 red (danger/warn)       →   theme.chartDown
     #F87171 lighter red             →   theme.chartDown
     #FF0055, #FF4757, #FF3366,
     #FF3333, #E5484D, #FF4D5E       →   theme.chartDown

     #F59E0B amber (heat / warm)     →   warmAccent (derived)
     #F97316 orange                  →   warmAccent
     #FBBF24 gold                    →   warmAccent

     #34A853 google green            →   theme.chartUp (recolored)
     #25D366 whatsapp green          →   theme.chartUp

     Background hex (dark themes):
     #080A10, #0A0F18, #080E1A,
     #0C1220                         →   theme.ink (or .ink2 for
                                          slightly-lighter panels)

     RGBA decompositions:
     rgba(16,185,129,a)              →   rgba(chartUpRgb, a)
     rgba(239,68,68,a)               →   rgba(chartDownRgb, a)
     rgba(52,211,153,a)              →   rgba(chartUpRgb, a)
     rgba(8,14,26,a)                 →   rgba(inkRgb, a)
     rgba(148,163,184,a)             →   rgba(ashSoftRgb, a)
     rgba(251,191,36,a)              →   rgba(warmAccentRgb, a)

     Light-theme polarity inversion:
     rgba(255,255,255,a)             →   rgba(0,0,0,a)
     #FFFFFF text                    →   theme.ink (dark text)

   The map is deterministic and runs in O(n) over the slide's DOM
   tree per theme/slide change. Costs are negligible (<5ms for the
   largest slide).
   ═══════════════════════════════════════════════════════════════════════ */

import { useLayoutEffect, type RefObject } from "react"
import type { VantaryTheme } from "@/components/dashboard/vantary/theme-system"

/* ─────────────────────────────────────────────────────────────────────
   COLOR UTILITIES
   ───────────────────────────────────────────────────────────────────── */

/** Convert "#RRGGBB" or "#RGB" → "r, g, b". Returns null on invalid. */
function hexToRgbTuple(hex: string): string | null {
  const m = hex.trim().replace(/^#/, "")
  if (m.length === 3) {
    const r = parseInt(m[0] + m[0], 16)
    const g = parseInt(m[1] + m[1], 16)
    const b = parseInt(m[2] + m[2], 16)
    if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null
    return `${r}, ${g}, ${b}`
  }
  if (m.length === 6) {
    const r = parseInt(m.slice(0, 2), 16)
    const g = parseInt(m.slice(2, 4), 16)
    const b = parseInt(m.slice(4, 6), 16)
    if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null
    return `${r}, ${g}, ${b}`
  }
  return null
}

/** Tolerant rgba parser: matches "rgba( 16 , 185 , 129 , 0.4 )" etc. */
const RGBA_RE = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)/g

/* ─────────────────────────────────────────────────────────────────────
   THEME → REMAP TABLE
   ───────────────────────────────────────────────────────────────────── */

interface RemapTable {
  /** Hex→target map, lowercased keys. Both source and target are full strings. */
  hex: Map<string, string>
  /** "r,g,b" source → "r,g,b" target. Keys have no spaces. */
  rgb: Map<string, string>
  /** Light-theme polarity flip (rgba whites → rgba blacks). */
  invertWhites: boolean
  /** Light-theme replacement for `#FFFFFF` / `white` text → dark ink. */
  whiteTextReplacement: string | null
}

/**
 * Pick a "warm accent" from the theme — used for hardcoded ambers / golds
 * / oranges in slides (deal sizes, urgency callouts, hot metrics).
 */
function pickWarmAccent(theme: VantaryTheme): string {
  // particleColors slot [1] is consistently a "warm/accent" hue across
  // all 7 themes (gold for solar, cyan for cyber, blue for teal/neural).
  // If unavailable, fall back to primaryDeep.
  return theme.particleColors?.[1] ?? theme.primaryDeep ?? theme.primary
}

/** Build the remap table for the active theme. Pure. */
export function buildRemapTable(theme: VantaryTheme): RemapTable {
  const isLight = theme.id === "light"
  const warmAccent = pickWarmAccent(theme)

  const hex = new Map<string, string>()

  // ── Success / positive / grow (emerald family) → chartUp ───────────
  for (const src of ["#10b981", "#34d399", "#22c55e", "#0d8f3a"]) {
    hex.set(src, theme.chartUp)
  }

  // ── Intelligence / AI (violet family) → secondary ──────────────────
  for (const src of ["#8b5cf6", "#a78bfa", "#a855f7", "#6366f1", "#818cf8", "#5865f2"]) {
    hex.set(src, theme.secondary)
  }

  // ── Data / comms (cyan + blue family) → tertiary ───────────────────
  for (const src of ["#06b6d4", "#22d3ee", "#0698ce", "#0088cc", "#3b82f6", "#2962ff", "#60a5fa"]) {
    hex.set(src, theme.tertiary)
  }

  // ── Danger / pain (red family) → chartDown ─────────────────────────
  for (const src of ["#ef4444", "#f87171", "#ff0055", "#ff4757", "#ff3366", "#ff3333", "#e5484d", "#ff4d5e"]) {
    hex.set(src, theme.chartDown)
  }

  // ── Heat / urgency / gold (amber family) → warmAccent ──────────────
  for (const src of ["#f59e0b", "#f97316", "#fbbf24", "#ffd700", "#ff8c42", "#ff5733", "#ffa500"]) {
    hex.set(src, warmAccent)
  }

  // ── Brand-color overrides (Google / WhatsApp green) → chartUp ──────
  for (const src of ["#34a853", "#25d366"]) {
    hex.set(src, theme.chartUp)
  }

  // ── Dark backgrounds in slide source → theme.ink / ink2 ────────────
  // These appear as panel surfaces, cards, hero washes.
  for (const src of ["#080a10", "#0a0f18", "#080e1a", "#0c1220"]) {
    hex.set(src, theme.ink2 ?? theme.ink)
  }

  /* ── RGBA decompositions ──────────────────────────────────────────
     Tinted overlays (rgba colorRGB, alpha) need their RGB portion
     remapped to the matching theme token RGB, alpha preserved. */

  const rgb = new Map<string, string>()

  const chartUpRgb = hexToRgbTuple(theme.chartUp)
  const chartDownRgb = hexToRgbTuple(theme.chartDown)
  const secondaryRgb = hexToRgbTuple(theme.secondary)
  const tertiaryRgb = hexToRgbTuple(theme.tertiary)
  const warmRgb = hexToRgbTuple(warmAccent)
  const inkRgb = hexToRgbTuple(theme.ink)

  if (chartUpRgb) {
    rgb.set("16,185,129", chartUpRgb)   // emerald
    rgb.set("52,211,153", chartUpRgb)   // mint
    rgb.set("34,197,94", chartUpRgb)    // green
    rgb.set("13,143,58", chartUpRgb)    // deep green
  }
  if (chartDownRgb) {
    rgb.set("239,68,68", chartDownRgb)  // red
    rgb.set("248,113,113", chartDownRgb)// light red
  }
  if (secondaryRgb) {
    rgb.set("139,92,246", secondaryRgb) // violet
    rgb.set("167,139,250", secondaryRgb)// light violet
    rgb.set("99,102,241", secondaryRgb) // indigo
  }
  if (tertiaryRgb) {
    rgb.set("6,182,212", tertiaryRgb)   // cyan
    rgb.set("34,211,238", tertiaryRgb)  // light cyan
    rgb.set("59,130,246", tertiaryRgb)  // blue
    rgb.set("96,165,250", tertiaryRgb)  // light blue
  }
  if (warmRgb) {
    rgb.set("251,191,36", warmRgb)      // gold
    rgb.set("245,158,11", warmRgb)      // amber
    rgb.set("249,115,22", warmRgb)      // orange
  }
  if (inkRgb) {
    rgb.set("8,14,26", inkRgb)          // ink translucent
  }

  return {
    hex,
    rgb,
    invertWhites: isLight,
    whiteTextReplacement: isLight ? theme.ink : null,
  }
}

/* ─────────────────────────────────────────────────────────────────────
   STRING REWRITERS
   ───────────────────────────────────────────────────────────────────── */

/** Rewrite all hex codes in a string per the table. */
function rewriteHex(input: string, table: RemapTable): string {
  if (!input) return input
  // Match any #RRGGBB (case-insensitive, with word boundary so the
  // 3-digit form #RGB inside #RRGGBB isn't accidentally matched).
  return input.replace(/#[0-9a-fA-F]{6}\b/g, (m) => {
    const key = m.toLowerCase()
    return table.hex.get(key) ?? m
  })
}

/** Rewrite all rgba() / rgb() patterns whose RGB tuple appears in the table. */
function rewriteRgba(input: string, table: RemapTable): string {
  if (!input) return input
  return input.replace(RGBA_RE, (full, r, g, b, a) => {
    const key = `${r},${g},${b}`
    const target = table.rgb.get(key)
    if (target) {
      return a !== undefined ? `rgba(${target},${a})` : `rgb(${target})`
    }
    // Light-theme polarity flip: white → black, alpha preserved.
    if (table.invertWhites && r === "255" && g === "255" && b === "255") {
      return a !== undefined ? `rgba(0,0,0,${a})` : `rgb(0,0,0)`
    }
    return full
  })
}

/** Combined rewriter: hex first, then rgba. */
function rewriteAll(input: string, table: RemapTable): string {
  return rewriteRgba(rewriteHex(input, table), table)
}

/* ─────────────────────────────────────────────────────────────────────
   DOM PATCHER
   ───────────────────────────────────────────────────────────────────── */

/**
 * Walk `root` and rewrite every inline style + SVG color attribute.
 * Returns the number of mutations applied (for debugging).
 */
function patchSubtree(root: HTMLElement, table: RemapTable): number {
  let count = 0

  // Inline style attributes
  const styled = root.querySelectorAll<HTMLElement>("[style]")
  styled.forEach((el) => {
    const cur = el.getAttribute("style") || ""
    const next = rewriteAll(cur, table)
    if (next !== cur) {
      el.setAttribute("style", next)
      count++
    }
  })

  // SVG color attributes
  const svgAttrs = ["fill", "stroke", "stop-color"] as const
  for (const attr of svgAttrs) {
    const targets = root.querySelectorAll<SVGElement>(`[${attr}]`)
    targets.forEach((el) => {
      const cur = el.getAttribute(attr) || ""
      // Only attempt rewrite if value looks like a color string.
      if (!cur || cur === "none" || cur === "currentColor") return
      const next = rewriteAll(cur, table)
      if (next !== cur) {
        el.setAttribute(attr, next)
        count++
      }
    })
  }

  return count
}

/* ─────────────────────────────────────────────────────────────────────
   REACT HOOK
   ───────────────────────────────────────────────────────────────────── */

/**
 * Attach to the OUTERMOST element of each slide. Patches the subtree
 * after every commit, and re-patches whenever React mutates any
 * `style` attribute below (covers framer-motion entrances, hover
 * toggles, panel expansions, etc.).
 *
 * Dependencies must include both `theme.id` AND `slideIndex` so a
 * fresh patch fires on either change.
 */
export function useSlideColorRemap(
  ref: RefObject<HTMLElement | null>,
  theme: VantaryTheme,
  slideIndex: number,
) {
  useLayoutEffect(() => {
    const root = ref.current
    if (!root) return

    const table = buildRemapTable(theme)

    // Initial pass — run a few RAF ticks to catch async-rendered
    // children (framer-motion mounts children after the first commit
    // for `initial → animate` transitions; SVG `animate` tags can
    // also mutate attributes mid-flight).
    let frames = 0
    let cancelled = false
    const tick = () => {
      if (cancelled) return
      patchSubtree(root, table)
      frames++
      if (frames < 60) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)

    // Ongoing — MutationObserver re-patches on any style or color
    // attribute change. Filtered to relevant attributes so we don't
    // pay observation cost for textContent / class / etc.
    let scheduled = false
    const observer = new MutationObserver(() => {
      if (scheduled) return
      scheduled = true
      requestAnimationFrame(() => {
        scheduled = false
        patchSubtree(root, table)
      })
    })
    observer.observe(root, {
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "fill", "stroke", "stop-color"],
    })

    return () => {
      cancelled = true
      observer.disconnect()
    }
  }, [ref, theme, slideIndex])
}
