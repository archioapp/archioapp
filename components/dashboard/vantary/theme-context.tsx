"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { type ThemeId, type VantaryTheme, getTheme, TEAL_GLASS } from "./theme-system"

/** Convert "#RRGGBB" → "R, G, B" so we can do rgba(var(--rgb), 0.4) */
function hexToRgbTriplet(hex: string): string {
  const clean = hex.replace("#", "")
  if (clean.length !== 6) return "45, 212, 191"
  const r = parseInt(clean.slice(0, 2), 16)
  const g = parseInt(clean.slice(2, 4), 16)
  const b = parseInt(clean.slice(4, 6), 16)
  return `${r}, ${g}, ${b}`
}

interface ThemeContextValue {
  themeId: ThemeId
  theme: VantaryTheme
  setTheme: (id: ThemeId) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const STORAGE_KEY = "vantary-theme-id"

export function VantaryThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeId>("teal")
  const [mounted, setMounted] = useState(false)

  // Load saved theme from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as ThemeId | null
      if (saved && ["teal", "cyber", "neural", "quantum", "solar", "light", "obsidian"].includes(saved)) {
        setThemeId(saved)
      }
    } catch (e) {
      // localStorage unavailable
    }
    setMounted(true)
  }, [])

  const setTheme = (id: ThemeId) => {
    setThemeId(id)
    try {
      localStorage.setItem(STORAGE_KEY, id)
    } catch (e) {
      // localStorage unavailable
    }
  }

  const theme = getTheme(themeId)

  // Apply CSS variables to document root for global access.
  // EVERY component that reads VANTARY.* picks up these vars automatically,
  // so theme switches propagate to all charts, glows, borders, badges, dots.
  useEffect(() => {
    if (!mounted) return
    const root = document.documentElement

    /* World / ink */
    root.style.setProperty("--vt-ink", theme.ink)
    root.style.setProperty("--vt-ink2", theme.ink2)
    root.style.setProperty("--vt-ink3", theme.ink3)

    /* Foreground */
    root.style.setProperty("--vt-paper", theme.paper)
    root.style.setProperty("--vt-paper-dim", theme.paperDim)
    root.style.setProperty("--vt-ash", theme.ash)
    root.style.setProperty("--vt-ash-soft", theme.ashSoft)
    root.style.setProperty("--vt-ash-ghost", theme.ashGhost)

    /* Primary accent (this is what was previously hardcoded teal) */
    root.style.setProperty("--vt-primary", theme.primary)
    root.style.setProperty("--vt-primary-deep", theme.primaryDeep)
    root.style.setProperty("--vt-primary-ink", theme.primaryInk)
    root.style.setProperty("--vt-primary-wash", theme.primaryWash)
    root.style.setProperty("--vt-primary-halo", theme.primaryHalo)

    /* Secondary accent */
    root.style.setProperty("--vt-secondary", theme.secondary)
    root.style.setProperty("--vt-secondary-deep", theme.secondaryDeep)
    root.style.setProperty("--vt-secondary-wash", theme.secondaryWash)

    /* Tertiary accent */
    root.style.setProperty("--vt-tertiary", theme.tertiary)
    root.style.setProperty("--vt-tertiary-wash", theme.tertiaryWash)

    /* Status indicators */
    root.style.setProperty("--vt-online-dot", theme.onlineDot)
    root.style.setProperty("--vt-offline-dot", theme.offlineDot)
    root.style.setProperty("--vt-badge-red", theme.badgeRed)

    /* Warning */
    root.style.setProperty("--vt-warn-wash", theme.warnWash)
    root.style.setProperty("--vt-warn-ink", theme.warnInk)
    root.style.setProperty("--vt-warn-edge", theme.warnEdge)

    /* Rules / hairlines */
    root.style.setProperty("--vt-rule", theme.rule)
    root.style.setProperty("--vt-rule-soft", theme.ruleSoft)
    root.style.setProperty("--vt-rule-strong", theme.ruleStrong)

    /* Glass surfaces */
    root.style.setProperty("--vt-glass", theme.glass)
    root.style.setProperty("--vt-glass-strong", theme.glassStrong)
    root.style.setProperty("--vt-glass-deep", theme.glassDeep)

    /* Chips */
    root.style.setProperty("--vt-chip-fill", theme.chipFill)
    root.style.setProperty("--vt-chip-fill-hi", theme.chipFillHi)
    root.style.setProperty("--vt-chip-border", theme.chipBorder)

    /* Chart colors */
    root.style.setProperty("--vt-chart-up", theme.chartUp)
    root.style.setProperty("--vt-chart-down", theme.chartDown)
    root.style.setProperty("--vt-chart-neutral", theme.chartNeutral)

    /* Composite shadow strings */
    root.style.setProperty("--vt-glow", theme.glow.join(", "))
    root.style.setProperty("--vt-shimmer", theme.shimmer.join(", "))

    /* RGB triplets — for dynamic-opacity rgba() calls in gradients/blooms.
       Usage: rgba(var(--vt-primary-rgb), 0.45) */
    root.style.setProperty("--vt-primary-rgb", hexToRgbTriplet(theme.primary))
    root.style.setProperty("--vt-secondary-rgb", hexToRgbTriplet(theme.secondary))
    root.style.setProperty("--vt-tertiary-rgb", hexToRgbTriplet(theme.tertiary))
  }, [theme, mounted])

  return (
    <ThemeContext.Provider value={{ themeId, theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useVantaryTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    // Fallback to default theme if not in provider
    return {
      themeId: "teal",
      theme: TEAL_GLASS,
      setTheme: () => {},
    }
  }
  return ctx
}
