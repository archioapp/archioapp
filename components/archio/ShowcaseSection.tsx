"use client"

import { motion, useReducedMotion } from "framer-motion"
import { DeviceFrame } from "./DeviceFrame"

/**
 * ShowcaseSection — a horizontal snap-scroll strip of every live route in
 * Archio. Each card pins a route pill at the top and a real product
 * screenshot inside a laptop frame. This is the "here's the whole app"
 * moment — proof that the system actually exists.
 */

const routes = [
  { path: "/",              title: "Your Space",        blurb: "Pre-market command center",   src: "/archio/screens/01-home.png" },
  { path: "/copilot",       title: "Neural Cortex",     blurb: "Psychology OS, 5-stage",       src: "/archio/screens/03-copilot-psychology.png" },
  { path: "/copilot",       title: "Pattern Detection", blurb: "Behavioural streams pipeline", src: "/archio/screens/04-copilot-stages.png" },
  { path: "/copilot",       title: "Guided Sessions",   blurb: "8 intelligence modes",         src: "/archio/screens/04b-copilot-sessions.png" },
  { path: "/forecast",      title: "Forecast Engine",   blurb: "Multi-timeframe analysis",     src: "/archio/screens/05-forecast.png" },
  { path: "/dashboard",     title: "Your Space — Prep", blurb: "Mentor signals + macro",       src: "/archio/screens/02-dashboard.png" },
  { path: "/forecast",      title: "Forecast Hub",      blurb: "Community feed + leaderboard", src: "/archio/screens/08-hub.png" },
  { path: "/nexus",         title: "Nexus",             blurb: "The system brain",             src: "/archio/screens/07-nexus.png" },
  { path: "/communities",   title: "Communities",       blurb: "Find your ecosystem",          src: "/archio/screens/09-communities.png" },
  { path: "/communities",   title: "Whale Room",        blurb: "Mentor gameplan + macro",      src: "/archio/screens/06-intelligence.png" },
  { path: "/history",       title: "History & Journal", blurb: "Overview + intelligence",      src: "/archio/screens/10-history-journal.png" },
  { path: "/copilot",       title: "Cortex Rail",       blurb: "Live behavioural alerts",      src: "/archio/screens/11-copilot-right-rail.png" },
  { path: "/execute",       title: "Trade Forge",       blurb: "Execution terminal",           src: "/archio/screens/12-execution-chart.png" },
]

export function ShowcaseSection() {
  const reduce = useReducedMotion()

  return (
    <section
      aria-labelledby="showcase-title"
      className="relative border-t border-white/[0.05] bg-[#07080c] py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] tracking-[0.2em] text-white/40">
              05 · THE WHOLE SURFACE
            </p>
            <h2
              id="showcase-title"
              className="mt-4 text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl"
            >
              Every route. Every module. Already live.
            </h2>
          </div>
          <p className="max-w-md text-[14px] leading-relaxed text-white/45">
            Not a mockup reel. Each card below is a screenshot of a production
            route inside Archio. Scroll to see the whole platform at once.
          </p>
        </div>
      </div>

      <div className="mt-14">
        <div
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-6 sm:gap-5"
          style={{ scrollbarWidth: "thin" }}
        >
          <div aria-hidden className="shrink-0 sm:w-[calc((100vw-72rem)/2+1rem)]" />
          {routes.map((r, i) => (
            <motion.article
              key={r.title + i}
              initial={reduce ? undefined : { opacity: 0, y: 16 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: Math.min(i * 0.04, 0.3), ease: [0.22, 1, 0.36, 1] }}
              className="w-[78vw] shrink-0 snap-start sm:w-[520px]"
            >
              <div className="flex items-center justify-between pb-3">
                <span className="inline-flex items-center rounded-md border border-cyan-400/25 bg-cyan-400/10 px-2 py-1 font-mono text-[10.5px] tracking-[0.12em] text-cyan-300">
                  {r.path}
                </span>
                <span className="font-mono text-[10.5px] tracking-[0.14em] text-white/35">
                  {String(i + 1).padStart(2, "0")} / {String(routes.length).padStart(2, "0")}
                </span>
              </div>
              <DeviceFrame
                src={r.src}
                alt={`Archio ${r.title} — ${r.blurb}`}
                variant="laptop"
                route={`archio.app${r.path}`}
                aspect="aspect-[16/10]"
                sizes="(max-width: 640px) 78vw, 520px"
              />
              <div className="pt-4">
                <p className="text-[14px] font-medium text-white">{r.title}</p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-white/45">{r.blurb}</p>
              </div>
            </motion.article>
          ))}
          <div aria-hidden className="shrink-0 sm:w-[calc((100vw-72rem)/2+1rem)]" />
        </div>
      </div>
    </section>
  )
}
