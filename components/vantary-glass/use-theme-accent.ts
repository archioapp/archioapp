"use client"

/**
 * useThemeAccent — surfaces the active VantaryTheme's primary accent in
 * the FORMS our glass primitives consume:
 *
 *   .hex   → "#2DD4BF"                       (raw)
 *   .rgb   → "45,212,191"                    (for rgba(rgb, alpha) calls)
 *   .halo  → "rgba(45,212,191,0.20)"         (pre-built halo from theme)
 *   .wash  → "rgba(45,212,191,0.10)"         (pre-built wash from theme)
 *
 * Plus matching variants for the theme's secondary and tertiary accents,
 * for surfaces that want a second swatch (e.g. the cockpit's "live"
 * status indicators vs. its glow ring).
 *
 * This single hook is the bridge between the rest of the dashboard and
 * the theme-aware glass language. Components that import this hook
 * automatically adapt across all 7 themes (Teal, Cyber, Neural, Quantum,
 * Solar, Light, Obsidian) and any future palette added to the system.
 */

import { useMemo } from "react"
import { useVantaryTheme } from "@/components/dashboard/vantary/theme-context"

/** Parse a CSS hex color → "r,g,b" string for rgba() helpers. */
function hexToRgbTriplet(hex: string): string {
  const cleaned = hex.replace("#", "").trim()
  if (cleaned.length === 3) {
    const r = parseInt(cleaned[0]! + cleaned[0]!, 16)
    const g = parseInt(cleaned[1]! + cleaned[1]!, 16)
    const b = parseInt(cleaned[2]! + cleaned[2]!, 16)
    return `${r},${g},${b}`
  }
  if (cleaned.length === 6) {
    const r = parseInt(cleaned.slice(0, 2), 16)
    const g = parseInt(cleaned.slice(2, 4), 16)
    const b = parseInt(cleaned.slice(4, 6), 16)
    return `${r},${g},${b}`
  }
  // Fallback — teal so we never throw at runtime.
  return "45,212,191"
}

export interface ThemeAccent {
  hex: string
  rgb: string
  halo: string
  wash: string
}

export interface ThemeAccents {
  primary: ThemeAccent
  secondary: ThemeAccent
  tertiary: ThemeAccent
}

export function useThemeAccent(): ThemeAccents {
  const { theme } = useVantaryTheme()
  return useMemo<ThemeAccents>(() => {
    const primaryRgb = hexToRgbTriplet(theme.primary)
    const secondaryRgb = hexToRgbTriplet(theme.secondary)
    const tertiaryRgb = hexToRgbTriplet(theme.tertiary)
    return {
      primary: {
        hex: theme.primary,
        rgb: primaryRgb,
        halo: theme.primaryHalo,
        wash: theme.primaryWash,
      },
      secondary: {
        hex: theme.secondary,
        rgb: secondaryRgb,
        halo: `rgba(${secondaryRgb},0.22)`,
        wash: theme.secondaryWash,
      },
      tertiary: {
        hex: theme.tertiary,
        rgb: tertiaryRgb,
        halo: `rgba(${tertiaryRgb},0.22)`,
        wash: theme.tertiaryWash,
      },
    }
  }, [theme])
}
