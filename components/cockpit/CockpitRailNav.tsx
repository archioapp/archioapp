"use client"

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion"
import { useEffect, useState } from "react"

/**
 * CockpitRailNav
 * ----------------------------------------------------------------------------
 * A thin top ticker that appears after the hero scrolls out. Shows the
 * section index, current section name, and a progress hairline. Mono type,
 * near-invisible until needed, never in the way.
 * ----------------------------------------------------------------------------
 */

const SECTIONS = [
  { id: "hero", label: "Intro" },
  { id: "principles", label: "§01 · Laws" },
  { id: "rail", label: "§02 · Rail" },
  { id: "spine", label: "§03 · Spine" },
  { id: "flow", label: "§04 · Flow" },
  { id: "ecosystem", label: "§05 · Organism" },
  { id: "close", label: "End" },
]

export function CockpitRailNav() {
  const { scrollYProgress } = useScroll()
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  const [activeId, setActiveId] = useState<string>("hero")
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 240)

      // Find which section is currently in view (closest to top)
      let closestId = "hero"
      let closestDist = Number.POSITIVE_INFINITY
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id)
        if (!el) continue
        const rect = el.getBoundingClientRect()
        const dist = Math.abs(rect.top - 120)
        if (rect.top < 260 && dist < closestDist) {
          closestDist = dist
          closestId = s.id
        }
      }
      setActiveId(closestId)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const activeLabel = SECTIONS.find((s) => s.id === activeId)?.label ?? "Intro"
  const activeIndex = SECTIONS.findIndex((s) => s.id === activeId)

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-[#05060a]/85 backdrop-blur-xl"
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3 lg:px-8">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-sm border border-[#d4af37]/60 font-mono text-[9px] uppercase tracking-[0.15em] text-[#d4af37]">
                F02
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/60">
                The Cockpit · Archio
              </span>
            </div>

            <div className="hidden items-center gap-4 md:flex">
              <AnimatePresence mode="wait">
                <motion.span
                  key={activeLabel}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/80"
                >
                  {activeLabel}
                </motion.span>
              </AnimatePresence>
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/35">
                {String(Math.max(activeIndex, 0) + 1).padStart(2, "0")} / {String(SECTIONS.length).padStart(2, "0")}
              </span>
            </div>

            <a
              href="#close"
              className="hidden rounded-full border border-white/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-white/75 transition hover:border-[#d4af37]/60 hover:text-[#d4af37] sm:inline-block"
            >
              Jump to end →
            </a>
          </div>

          {/* Scroll progress hairline */}
          <motion.div
            style={{ width: progressWidth }}
            className="h-[1.5px] origin-left bg-gradient-to-r from-[#22d3ee] via-[#d4af37] to-[#fb7185]"
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
