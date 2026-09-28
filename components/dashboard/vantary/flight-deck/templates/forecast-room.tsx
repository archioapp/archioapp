"use client"

/* ═══════════════════════════════════════════════════════════════════════════════════════════
   <ForecastRoomTemplate />
   
   MARKET FLOOR · FORECAST ROOM
   
   Flight deck room that embeds the full ForecastHub from /forecast.
   Uses embedded mode to properly fit within the flight deck viewport.
   
   ═══════════════════════════════════════════════════════════════════════════════════════ */

import * as React from "react"
import { motion } from "framer-motion"

import { RADIUS_V } from "../../vantary-theme"
import { ForecastHub } from "@/components/forecast-hub/forecast-hub"

/* ═══════════════════════════════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════════════════════════════ */

const EASE_PREMIUM: [number, number, number, number] = [0.16, 1, 0.3, 1]

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN TEMPLATE
   ═══════════════════════════════════════════════════════════════════════════ */

interface ForecastRoomProps {
  pinned?: boolean
  onPin?: () => void
  onClose?: () => void
}

export function ForecastRoomTemplate({ pinned = false, onPin, onClose }: ForecastRoomProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.4, ease: EASE_PREMIUM }}
      className="relative w-full h-full overflow-hidden"
      style={{
        borderRadius: RADIUS_V.xl,
      }}
    >
      {/* Full ForecastHub in embedded mode */}
      <ForecastHub embedded />
    </motion.div>
  )
}

export default ForecastRoomTemplate
