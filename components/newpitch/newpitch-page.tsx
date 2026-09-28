"use client"

/* ──────────────────────────────────────────────────────────────────────────
 *  NEWPITCH PAGE  ·  "THE ARCHIO TERMINAL"
 *
 *  The investor briefing rebuilt as a single instrumented cockpit document —
 *  not a slide deck. Inherits the platform Visual DNA wholesale (teal-glass,
 *  tactical grid, corner ticks, mono caps) exactly like /design and
 *  /dashboard. A sticky mission rail tracks scroll progress across eight
 *  briefing modules.
 * ──────────────────────────────────────────────────────────────────────── */

import { useEffect, useState } from "react"
import { DNA, PITCH_BACKDROP } from "./pitch-dna"
import { DESTINATIONS } from "./pitch-data"
import { PitchHero, MissionRail, PitchFooter } from "./pitch-chrome"
import { FractureSection, FieldSection } from "./sections-a"
import { UnificationSection, StackSection } from "./sections-b"
import { LiveSection, GapSection } from "./sections-c"
import { PathSection, AskSection } from "./sections-d"

export function NewPitchPage() {
  const [activeId, setActiveId] = useState(DESTINATIONS[0].id)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const ids = DESTINATIONS.map((d) => d.id)

    const onScroll = () => {
      // scroll progress 0→1
      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight
      setProgress(max > 0 ? doc.scrollTop / max : 0)

      // active section = the last one whose top has crossed the upper third
      const mark = window.innerHeight * 0.35
      let current = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= mark) current = id
      }
      setActiveId(current)
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  const jump = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <main
      className="relative min-h-screen w-full overflow-x-clip"
      style={{ background: PITCH_BACKDROP, color: DNA.paper }}
    >
      {/* tactical grid — faint neutral ink on paper */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(22,32,29,0.035) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(22,32,29,0.035) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse 85% 95% at 50% 20%, black 20%, transparent 92%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1480px] px-6 md:px-8 py-12 md:py-16">
        <PitchHero />

        <div className="mt-16 grid grid-cols-12 gap-8">
          {/* mission rail */}
          <aside className="hidden lg:block lg:col-span-3 xl:col-span-2">
            <MissionRail activeId={activeId} progress={progress} onJump={jump} />
          </aside>

          {/* briefing modules */}
          <div className="col-span-12 lg:col-span-9 xl:col-span-10 flex flex-col gap-24">
            <FractureSection />
            <FieldSection />
            <UnificationSection />
            <StackSection />
            <LiveSection />
            <GapSection />
            <PathSection />
            <AskSection />
          </div>
        </div>

        <div className="mt-20">
          <PitchFooter />
        </div>
      </div>
    </main>
  )
}
