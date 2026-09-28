"use client"

/* ═══════════════════════════════════════════════════════════════════════
   ACT IV · 05 AI AGENT MARKETPLACE — mentors, not agent types
   ───────────────────────────────────────────────────────────────────────
   There is no one way to trade. There are thousands of mentors, each with
   an instrument, a session, a method and a way of managing risk. Today
   they are scattered across a million Discords. Here each one has a
   storefront: a verified record, a room, a clone that thinks like him,
   a desk that works like him. Filter chips light up the matching mentors
   so Owen SEES that this is a market of people and methods.
   ═══════════════════════════════════════════════════════════════════════ */

import { useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Copy, LayoutPanelTop, Radio, ShieldCheck, Moon, Sparkles } from "lucide-react"
import { withAlpha, glow } from "../holographic-kit"
import { type SceneProps, Stage, Micro, Num, DECK_EASE } from "./slide-frame"

type Facet = "instrument" | "session" | "method" | "risk"
type Mentor = {
  initials: string; name: string; instrument: string; session: string; method: string; risk: string
  record: { calls: number; hit: string; r: string }
  room: string; clone: string; desk: string; hires: string
  line: string
}

const MENTORS: Mentor[] = [
  { initials: "MR", name: "Marcus Reed", instrument: "Gold", session: "New York", method: "Liquidity sweeps", risk: "Half size on news", record: { calls: 214, hit: "61%", r: "+0.84" }, room: "$79", clone: "$49", desk: "$29", hires: "1,204", line: "Longs above the London low, only after the sweep. Half size on CPI and FOMC." },
  { initials: "LK", name: "Lena Kowalski", instrument: "EUR/USD", session: "London", method: "Order flow · VWAP", risk: "Partials at 1R", record: { calls: 388, hit: "68%", r: "+0.71" }, room: "$59", clone: "$39", desk: "$19", hires: "2,310", line: "Fades the 08:00 push into VWAP. Takes half at 1R, trails the rest. Never trades after 11:00." },
  { initials: "DP", name: "Dev Patel", instrument: "NQ futures", session: "New York open", method: "Opening range", risk: "Pyramids winners", record: { calls: 176, hit: "55%", r: "+1.62" }, room: "$149", clone: "$59", desk: "$39", hires: "890", line: "First 15 minutes decide the day. Adds to winners twice, never to losers. Flat by 10:30." },
  { initials: "AT", name: "Aiko Tanaka", instrument: "BTC · ETH", session: "Asia", method: "Swing · weekly levels", risk: "3 trades a week", record: { calls: 92, hit: "58%", r: "+2.10" }, room: "$99", clone: "$29", desk: "$19", hires: "640", line: "Three trades a week, held for days. Weekly open and close are the only levels that matter." },
  { initials: "TR", name: "Tomás Rivera", instrument: "ES · S&P", session: "Pre-market", method: "Scalps · footprint", risk: "Fixed 2 lots", record: { calls: 1_240, hit: "64%", r: "+0.38" }, room: "$69", clone: "$39", desk: "$29", hires: "1,870", line: "Forty scalps a week off the footprint. Same size every time. Stops trading after two losses in a row." },
  { initials: "SM", name: "Sofia Marin", instrument: "Oil · CL", session: "London–NY overlap", method: "News plays · inventories", risk: "One trade a day", record: { calls: 141, hit: "59%", r: "+1.15" }, room: "$89", clone: "$45", desk: "$25", hires: "720", line: "Trades the Wednesday inventory number and the OPEC calendar. One trade a day, never twice." },
]

const FACETS: { id: Facet; label: string; values: string[] }[] = [
  { id: "instrument", label: "Instrument", values: ["Gold", "EUR/USD", "NQ futures", "BTC · ETH", "ES · S&P", "Oil · CL"] },
  { id: "session", label: "Session", values: ["Asia", "London", "London–NY overlap", "New York", "New York open", "Pre-market"] },
  { id: "method", label: "Method", values: ["Liquidity sweeps", "Order flow · VWAP", "Opening range", "Swing · weekly levels", "Scalps · footprint", "News plays · inventories"] },
  { id: "risk", label: "Management", values: ["Half size on news", "Partials at 1R", "Pyramids winners", "3 trades a week", "Fixed 2 lots", "One trade a day"] },
]

export function MentorMarketScene({ pal, accent }: SceneProps) {
  const reduce = useReducedMotion()
  const [pick, setPick] = useState<{ facet: Facet; value: string } | null>(null)
  const lit = (m: Mentor) => !pick || m[pick.facet] === pick.value

  return (
    <Stage pal={pal} accent={accent} className="p-4 flex flex-col gap-2.5">
      {/* filters */}
      <div className="flex flex-col gap-1">
        {FACETS.map((f) => (
          <div key={f.id} className="flex items-center gap-1.5 flex-wrap">
            <Micro color={pal.textGhost}>{f.label}</Micro>
            {f.values.map((v) => {
              const on = pick?.facet === f.id && pick.value === v
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => setPick(on ? null : { facet: f.id, value: v })}
                  aria-pressed={on}
                  className="text-[9.5px] font-bold px-2 py-0.5 rounded-md outline-none"
                  style={{ color: on ? "#06100E" : pal.textDim, background: on ? accent : withAlpha(pal.text, 0.05), border: `1px solid ${on ? accent : pal.glassEdge}` }}
                >
                  {v}
                </button>
              )
            })}
          </div>
        ))}
      </div>

      {/* storefronts */}
      <div className="grid grid-cols-3 gap-2">
        {MENTORS.map((m, i) => {
          const on = lit(m)
          return (
            <motion.div
              key={m.name}
              className="rounded-xl p-2.5 flex flex-col gap-1.5"
              style={{ background: on ? pal.glassHi : withAlpha(pal.bgDeep, 0.3), border: `1px solid ${on && pick ? withAlpha(accent, 0.6) : pal.glassEdge}`, boxShadow: on && pick ? glow(accent, 0.3) : "none", opacity: on ? 1 : 0.28, transition: "opacity 240ms, box-shadow 240ms, border-color 240ms" }}
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: on ? 1 : 0.28, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08, duration: 0.45, ease: DECK_EASE }}
            >
              <div className="flex items-center gap-2">
                <span className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-[11px] font-black" style={{ background: withAlpha(accent, 0.16), border: `1px solid ${withAlpha(accent, 0.5)}`, color: accent }}>{m.initials}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1"><span className="text-[12px] font-black truncate" style={{ color: pal.text }}>{m.name}</span><ShieldCheck style={{ width: 11, height: 11, color: pal.green, flexShrink: 0 }} /></div>
                  <div className="text-[9px] uppercase tracking-[0.1em] font-bold truncate" style={{ color: accent }}>{m.instrument} · {m.session}</div>
                </div>
                <span className="inline-flex items-center gap-1 text-[8.5px] font-bold" style={{ color: pal.textGhost }}><Moon style={{ width: 9, height: 9 }} />24/7</span>
              </div>
              <span className="text-[9.5px] leading-snug" style={{ color: pal.textDim }}>{m.line}</span>
              <div className="flex items-center gap-1 flex-wrap">
                <span className="text-[8.5px] font-bold px-1.5 py-0.5 rounded" style={{ color: pal.text, background: withAlpha(pal.text, 0.06) }}>{m.method}</span>
                <span className="text-[8.5px] font-bold px-1.5 py-0.5 rounded" style={{ color: pal.text, background: withAlpha(pal.text, 0.06) }}>{m.risk}</span>
              </div>
              <div className="grid grid-cols-3 gap-1 rounded-md px-2 py-1" style={{ background: withAlpha(pal.green, 0.07), border: `1px solid ${withAlpha(pal.green, 0.25)}` }}>
                {[["calls", String(m.record.calls)], ["hit", m.record.hit], ["avg R", m.record.r]].map(([k, v]) => (
                  <span key={k} className="flex flex-col"><Num color={pal.green} size={11}>{v}</Num><span className="text-[7.5px] uppercase tracking-[0.12em] font-bold" style={{ color: pal.textGhost }}>{k}</span></span>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-1 mt-auto">
                {[[Radio, "Room", m.room + "/mo"], [Copy, "Clone", m.clone + "/mo"], [LayoutPanelTop, "Desk", m.desk]].map(([Icon, k, v]) => {
                  const I = Icon as typeof Radio
                  return (
                    <span key={k as string} className="flex flex-col items-center gap-0.5 rounded-md py-1" style={{ background: withAlpha(accent, 0.08), border: `1px solid ${withAlpha(accent, 0.3)}` }}>
                      <I style={{ width: 10, height: 10, color: accent }} />
                      <span className="text-[8px] uppercase tracking-[0.1em] font-bold" style={{ color: pal.textGhost }}>{k as string}</span>
                      <Num color={pal.text} size={9.5}>{v as string}</Num>
                    </span>
                  )
                })}
              </div>
              <span className="text-[8.5px] text-right" style={{ color: pal.textGhost }}>{m.hires} traders installed him</span>
            </motion.div>
          )
        })}
      </div>

      <div className="rounded-lg px-3 py-2 flex items-center gap-2.5" style={{ background: withAlpha(accent, 0.1), border: `1px solid ${withAlpha(accent, 0.4)}` }}>
        <Sparkles style={{ width: 13, height: 13, color: accent, flexShrink: 0 }} />
        <span className="text-[11px] leading-snug" style={{ color: pal.text }}><span style={{ fontWeight: 800 }}>Not indicators. Not bots. A person&apos;s way of thinking and working — installed.</span> Six mentors, six instruments, six sessions, six ways to manage risk. Verified by 08, sold on 05, running on the student&apos;s own record in 04. A million Discords become one store.</span>
      </div>
    </Stage>
  )
}
