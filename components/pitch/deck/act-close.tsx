"use client"

/* ═══════════════════════════════════════════════════════════════════════
   ACT V · THE APP — honest
   Where Archio really is: real · demo · not connected.
   ═══════════════════════════════════════════════════════════════════════ */

import { motion, useReducedMotion } from "framer-motion"
import { Check, Play, Unplug } from "lucide-react"
import { withAlpha, glow } from "../holographic-kit"
import { type SceneProps, Stage, Micro, Pill, DECK_EASE } from "./slide-frame"

const REAL = ["Accounts", "Community infrastructure", "Billing", "AI engine (the review you'll see is a real model)"]
const DEMO = ["Live Room", "Forecast", "Compare Plan", "Trade review (demo journal, rules tagged)"]
const MISSING = ["One durable record across the whole loop", "Broker execution data", "Real user trading history", "Long-term behavioral model"]

export function HonestScene({ pal, accent }: SceneProps) {
  const reduce = useReducedMotion()
  const cols = [
    { title: "Real today", pill: "Live", color: pal.green, icon: Check, items: REAL, dashed: false },
    { title: "Built · demo state", pill: "Scripted data", color: accent, icon: Play, items: DEMO, dashed: false },
    { title: "Not connected yet", pill: "The bridge", color: pal.red, icon: Unplug, items: MISSING, dashed: true },
  ]
  return (
    <Stage pal={pal} accent={accent} className="p-4 lg:p-5">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {cols.map((c, ci) => (
          <motion.div
            key={c.title}
            className="rounded-2xl p-4 flex flex-col gap-3"
            style={{
              background: c.dashed ? withAlpha(c.color, 0.05) : pal.glassHi,
              border: `1px ${c.dashed ? "dashed" : "solid"} ${withAlpha(c.color, 0.45)}`,
            }}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + ci * 0.25, duration: 0.5, ease: DECK_EASE }}
          >
            <div className="flex items-center justify-between gap-2">
              <Micro color={c.color}>{c.title}</Micro>
              <Pill color={c.color}>{c.pill}</Pill>
            </div>
            <div className="flex flex-col gap-2">
              {c.items.map((it, i) => (
                <motion.div
                  key={it}
                  className="flex items-start gap-2"
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 + ci * 0.25 + i * 0.07 }}
                >
                  <span className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: withAlpha(c.color, 0.14), border: `1px solid ${withAlpha(c.color, 0.45)}`, boxShadow: c.dashed ? "none" : glow(c.color, 0.2) }}>
                    <c.icon style={{ width: 10, height: 10, color: c.color }} />
                  </span>
                  <span className="text-[12.5px] leading-snug" style={{ color: pal.text }}>{it}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-3 rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-2"
        style={{ background: withAlpha(accent, 0.08), border: `1px solid ${withAlpha(accent, 0.35)}` }}
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5, ease: DECK_EASE }}
      >
        <span className="text-[13px] font-bold" style={{ color: pal.text }}>
          The experiences exist. The pieces exist. The missing bridge is real trader and broker data.
        </span>
        <Pill color={accent} solid>That is why we are here</Pill>
      </motion.div>
    </Stage>
  )
}
