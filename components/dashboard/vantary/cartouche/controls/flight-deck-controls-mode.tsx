"use client"

/* ═══════════════════════════════════════════════════════════════════════════
   ARCHIO · FLIGHT DECK · CONTROLS MODE — orchestrator (minimal)
   ───────────────────────────────────────────────────────────────────────────
   The control surface that REPLACES the center "Welcome back" hero in place
   when the trader enters Controls. Pared down to a single, frameless LOADOUT
   revolver — no header chrome, no tab bar, no instructional copy, no bordered
   card. The loadout cards float openly over the cockpit.

   It owns NO persisted state — every mutation flows through the props the
   cartouche supplies, and live previews bridge through onPreview/onHighlight.
   Re-clicking the deck title (or Escape) closes it.
   ═══════════════════════════════════════════════════════════════════════════ */

import { memo, useEffect } from "react"
import { motion, useReducedMotion } from "framer-motion"

import { LoadoutRevolver } from "./loadout-revolver"
import type { FlightDeckControlsModeProps } from "./types"

export const FlightDeckControlsMode = memo(function FlightDeckControlsMode(props: FlightDeckControlsModeProps) {
  const {
    accent, activeTemplateApi, catalog,
    onApplyLoadout, onPreview, onHighlight, onClose,
  } = props
  const reduce = useReducedMotion()

  /* clear any live preview/highlight when leaving controls mode */
  useEffect(() => () => { onPreview(null); onHighlight(null) }, [onPreview, onHighlight])

  /* Escape closes controls */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  const sizeOf = (id: string): "s" | "m" | "l" => catalog.find((g) => g.id === id)?.size ?? "s"

  return (
    <motion.div
      role="region"
      aria-label="Flight Deck controls"
      initial={reduce ? false : { opacity: 0, scale: 0.985 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={reduce ? undefined : { opacity: 0, scale: 0.985 }}
      transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
      style={{ width: "100%" }}
    >
      {/* Frameless loadout revolver — no surrounding border or background,
          the persona cards float openly over the cockpit. */}
      <LoadoutRevolver
        accent={accent}
        templates={activeTemplateApi.templates}
        activeId={activeTemplateApi.activeId}
        sizeOf={sizeOf}
        onApply={(snapshot) => onApplyLoadout(snapshot)}
        onPreview={(snapshot) => onPreview(snapshot)}
        onPreviewEnd={() => onPreview(null)}
      />
    </motion.div>
  )
})
