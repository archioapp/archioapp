"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Palette, Check, Sparkles } from "lucide-react"
import { useVantaryTheme } from "./theme-context"
import { ALL_THEMES, type ThemeId, EASE_V } from "./theme-system"

/**
 * Theme Switcher — futuristic palette selector for top-left corner.
 * 
 * Features:
 * - Compact pill button that expands to show all 5 themes
 * - Each theme preview shows its primary, secondary, and tertiary colors
 * - Animated swatches with chromatic aberration effect on hover
 * - Persists selection to localStorage via theme context
 * - Glassmorphic panel with theme-aware styling
 */

const THEME_ERAS: Record<ThemeId, string> = {
  teal: "2026 · STANDARD",
  cyber: "2045 · CYBERPUNK",
  neural: "2120 · NEURAL",
  quantum: "2210 · QUANTUM",
  solar: "2313 · STELLAR",
  light: "2026 · NEURAL LIGHT",
  obsidian: "2030 · OBSIDIAN GLASS",
}

export function ThemeSwitcher({ inline = false }: { inline?: boolean } = {}) {
  const { themeId, theme, setTheme } = useVantaryTheme()
  const [open, setOpen] = useState(false)
  const [hoveredId, setHoveredId] = useState<ThemeId | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onClick)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  return (
    <div ref={containerRef} className={inline ? "relative z-[60]" : "fixed top-4 left-4 z-[100]"}>
      {/* ── Trigger button ── */}
      <motion.button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-label="Change color theme"
        aria-expanded={open}
        className="relative flex items-center rounded-full transition-all"
        style={{
          gap:        inline ? 6 : 10,
          padding:    inline ? "5px 11px" : "10px 16px",
          background: theme.glassStrong,
          border: `1px solid ${open ? theme.primary : theme.rule}`,
          backdropFilter: "blur(24px) saturate(160%)",
          WebkitBackdropFilter: "blur(24px) saturate(160%)",
          boxShadow: open
            ? `0 0 24px ${theme.primaryHalo}, 0 4px 16px rgba(0,0,0,0.3)`
            : `0 4px 12px rgba(0,0,0,0.2)`,
        }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.2, ease: EASE_V }}
      >
        {/* Animated icon */}
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.4, ease: EASE_V }}
          className="shrink-0"
        >
          <Palette size={14} strokeWidth={1.75} color={theme.primary} />
        </motion.div>

        {/* Color preview dots */}
        <div className="flex items-center gap-1">
          <span
            className="block w-1.5 h-1.5 rounded-full"
            style={{ background: theme.primary, boxShadow: `0 0 6px ${theme.primaryHalo}` }}
          />
          <span
            className="block w-1.5 h-1.5 rounded-full"
            style={{ background: theme.secondary }}
          />
          <span
            className="block w-1.5 h-1.5 rounded-full"
            style={{ background: theme.tertiary }}
          />
        </div>

        {/* Theme name label */}
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 9,
            letterSpacing: "0.18em",
            color: theme.paperDim,
          }}
        >
          {theme.name}
        </span>
      </motion.button>

      {/* ── Expanded theme panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.3, ease: EASE_V }}
            className="absolute top-full left-0 mt-2 rounded-2xl overflow-hidden"
            style={{
              width: 320,
              background: theme.glassDeep,
              border: `1px solid ${theme.rule}`,
              backdropFilter: "blur(36px) saturate(180%)",
              WebkitBackdropFilter: "blur(36px) saturate(180%)",
              boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${theme.primaryHalo}`,
            }}
          >
            {/* Header */}
            <div
              className="px-5 py-3 flex items-center gap-2"
              style={{ borderBottom: `1px solid ${theme.rule}` }}
            >
              <Sparkles size={11} strokeWidth={1.5} color={theme.primary} />
              <div
                className="font-mono uppercase"
                style={{
                  fontSize: 9,
                  letterSpacing: "0.22em",
                  color: theme.primary,
                }}
              >
                Chromatic Engine · v3.17
              </div>
            </div>

            {/* Theme list */}
            <div className="p-2">
              {(Object.keys(ALL_THEMES) as ThemeId[]).map((id, idx) => {
                const t = ALL_THEMES[id]
                const isActive = id === themeId
                const isHovered = id === hoveredId

                return (
                  <motion.button
                    key={id}
                    type="button"
                    onClick={() => {
                      setTheme(id)
                      setTimeout(() => setOpen(false), 200)
                    }}
                    onMouseEnter={() => setHoveredId(id)}
                    onMouseLeave={() => setHoveredId(null)}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * idx, duration: 0.3, ease: EASE_V }}
                    className="relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left"
                    style={{
                      background: isActive
                        ? `linear-gradient(90deg, ${t.primaryWash}, transparent)`
                        : isHovered
                          ? "rgba(255,255,255,0.03)"
                          : "transparent",
                      border: `1px solid ${isActive ? t.primary : "transparent"}`,
                    }}
                  >
                    {/* Color swatch trio */}
                    <div className="relative flex shrink-0 items-center">
                      <motion.span
                        className="block rounded-full"
                        style={{
                          width: 18,
                          height: 18,
                          background: `linear-gradient(135deg, ${t.gradientStops[0]}, ${t.gradientStops[1]})`,
                          boxShadow: isHovered || isActive ? `0 0 12px ${t.primaryHalo}` : "none",
                        }}
                        animate={{
                          scale: isHovered ? 1.15 : 1,
                        }}
                        transition={{ duration: 0.3, ease: EASE_V }}
                      />
                      <motion.span
                        className="block rounded-full -ml-1.5"
                        style={{
                          width: 14,
                          height: 14,
                          background: t.secondary,
                          border: `1px solid ${t.ink}`,
                        }}
                        animate={{
                          scale: isHovered ? 1.1 : 1,
                          x: isHovered ? 2 : 0,
                        }}
                        transition={{ duration: 0.3, ease: EASE_V, delay: 0.04 }}
                      />
                      <motion.span
                        className="block rounded-full -ml-1.5"
                        style={{
                          width: 11,
                          height: 11,
                          background: t.tertiary,
                          border: `1px solid ${t.ink}`,
                        }}
                        animate={{
                          scale: isHovered ? 1.1 : 1,
                          x: isHovered ? 4 : 0,
                        }}
                        transition={{ duration: 0.3, ease: EASE_V, delay: 0.08 }}
                      />
                    </div>

                    {/* Theme info */}
                    <div className="flex-1 min-w-0">
                      <div
                        className="font-sans"
                        style={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: isActive ? t.primary : theme.paper,
                          letterSpacing: "0.01em",
                        }}
                      >
                        {t.name}
                      </div>
                      <div
                        className="font-mono uppercase mt-0.5"
                        style={{
                          fontSize: 8,
                          letterSpacing: "0.20em",
                          color: theme.ash,
                        }}
                      >
                        {THEME_ERAS[id]}
                      </div>
                    </div>

                    {/* Active checkmark */}
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.3, ease: EASE_V }}
                        className="shrink-0 rounded-full flex items-center justify-center"
                        style={{
                          width: 18,
                          height: 18,
                          background: t.primary,
                          boxShadow: `0 0 8px ${t.primaryHalo}`,
                        }}
                      >
                        <Check size={10} strokeWidth={3} color={t.ink} />
                      </motion.div>
                    )}
                  </motion.button>
                )
              })}
            </div>

            {/* Footer description */}
            <div
              className="px-5 py-2.5"
              style={{
                borderTop: `1px solid ${theme.rule}`,
                background: theme.ink,
              }}
            >
              <div
                className="font-sans"
                style={{
                  fontSize: 10,
                  color: theme.ash,
                  lineHeight: 1.5,
                }}
              >
                {hoveredId ? ALL_THEMES[hoveredId].description : theme.description}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
