"use client"

import { useState } from "react"
import { EMERGENCY, GUIDE, SCREENS, TABS, type GuideScreen } from "./owen-data"
import { Eyebrow, Kbd, OW, mmss, useDeckKeys, useDeckSync, useElapsed } from "./owen-ui"

/* ── Shared guide blocks (presenter window + printable guide) ────────── */

const WHO_COLOR: Record<string, string> = { KAN: OW.paper, LUKE: OW.teal, TRANSITION: OW.paperDim, OPTIONAL: OW.ash }
const TEAL_INK = "#0F8F80"

export function GuideBody({ g, dark = true }: { g: GuideScreen; dark?: boolean }) {
  const text = dark ? OW.paper : "#111418"
  const soft = dark ? OW.paperDim : "#3B434B"
  const ash = dark ? OW.ash : "#6B7480"
  const teal = dark ? OW.teal : TEAL_INK
  const hair = dark ? OW.hair : "rgba(0,0,0,0.12)"
  return (
    <div className="flex flex-col" style={{ gap: 22 }}>
      <div className="flex flex-col" style={{ gap: 6 }}>
        <Eyebrow>Goal</Eyebrow>
        <p className="font-sans m-0" style={{ fontSize: 17, lineHeight: 1.4, color: text, fontWeight: 500 }}>{g.goal}</p>
      </div>

      {g.blocks.map((b, i) => (
        <div key={i} className="flex flex-col" style={{ gap: 8 }}>
          <span className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: "0.22em", color: dark ? WHO_COLOR[b.who] : b.who === "LUKE" ? TEAL_INK : b.who === "OPTIONAL" ? ash : text, fontWeight: 700 }}>
            {b.who}
          </span>
          <ul className="flex flex-col list-none m-0 p-0" style={{ gap: 8 }}>
            {b.lines.map((l) => (
              <li key={l} className="font-sans flex" style={{ gap: 10, fontSize: 15.5, lineHeight: 1.45, color: b.who === "OPTIONAL" ? soft : text }}>
                <span aria-hidden style={{ color: ash, flexShrink: 0 }}>•</span>
                <span>{l}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {g.demo && (
        <div className="flex flex-col" style={{ gap: 10 }}>
          <Eyebrow tone="teal">Demo order</Eyebrow>
          <ol className="flex flex-col list-none m-0 p-0" style={{ gap: 12 }}>
            {g.demo.map((d, i) => (
              <li key={d.beat} className="grid" style={{ gridTemplateColumns: "26px 1fr", columnGap: 10, paddingBottom: 12, borderBottom: i < (g.demo?.length ?? 0) - 1 ? `1px solid ${hair}` : "none" }}>
                <span className="font-mono" style={{ fontSize: 12, color: teal, fontWeight: 700, paddingTop: 2 }}>{i + 1}</span>
                <div className="flex flex-col" style={{ gap: 5 }}>
                  <div className="flex items-baseline flex-wrap" style={{ gap: 10 }}>
                    <span className="font-mono uppercase" style={{ fontSize: 11.5, letterSpacing: "0.2em", color: text, fontWeight: 700 }}>{d.beat}</span>
                    <span className="font-mono" style={{ fontSize: 11.5, color: ash }}>{d.where}</span>
                  </div>
                  {d.do.map((x) => (
                    <p key={x} className="font-sans m-0" style={{ fontSize: 15, lineHeight: 1.4, color: x.startsWith("DO NOT") ? OW.red : text, fontWeight: x.startsWith("DO NOT") ? 700 : 400 }}>{x}</p>
                  ))}
                  <p className="font-sans m-0" style={{ fontSize: 15, lineHeight: 1.4, color: teal, fontStyle: "italic" }}>{d.say}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

      {g.aha && (
        <div className="flex flex-col" style={{ gap: 6 }}>
          <Eyebrow tone="teal">Aha line</Eyebrow>
          <p className="font-sans m-0" style={{ fontSize: 16.5, lineHeight: 1.4, color: text, fontWeight: 500 }}>{g.aha}</p>
        </div>
      )}

      {g.ask && (
        <div className="rounded-xl" style={{ padding: "14px 16px", border: `1px solid ${dark ? "rgba(45,212,191,0.35)" : TEAL_INK}`, background: dark ? "rgba(45,212,191,0.06)" : "rgba(15,143,128,0.06)" }}>
          <Eyebrow tone="teal">{g.ask.label}</Eyebrow>
          {g.ask.lines.map((l) => (
            <p key={l} className="font-sans m-0" style={{ fontSize: 18, lineHeight: 1.35, color: text, fontWeight: 600, marginTop: 8 }}>{l}</p>
          ))}
        </div>
      )}

      {g.options && (
        <div className="flex flex-col" style={{ gap: 8 }}>
          <Eyebrow>Other options</Eyebrow>
          <ul className="flex flex-col list-none m-0 p-0" style={{ gap: 8 }}>
            {g.options.map((o) => (
              <li key={o} className="font-sans flex" style={{ gap: 10, fontSize: 15, lineHeight: 1.45, color: soft }}>
                <span aria-hidden style={{ color: ash, flexShrink: 0 }}>•</span>
                <span>{o}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div role="alert" className="rounded-xl" style={{ padding: "16px 18px", background: dark ? "rgba(240,85,90,0.12)" : "rgba(240,85,90,0.1)", border: `1.5px solid ${OW.red}` }}>
        {g.stop.map((s) => (
          <p key={s} className="font-sans m-0 uppercase" style={{ fontSize: 19, lineHeight: 1.3, letterSpacing: "0.02em", color: OW.red, fontWeight: 800 }}>{s}</p>
        ))}
      </div>
    </div>
  )
}

export function EmergencyList({ dark = true }: { dark?: boolean }) {
  const text = dark ? OW.paper : "#111418"
  const hair = dark ? OW.hair : "rgba(0,0,0,0.12)"
  return (
    <div className="flex flex-col" style={{ gap: 14 }}>
      {EMERGENCY.map((e, i) => (
        <div key={e.q} className="flex flex-col" style={{ gap: 5, paddingBottom: 14, borderBottom: i < EMERGENCY.length - 1 ? `1px solid ${hair}` : "none" }}>
          <span className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: "0.18em", color: OW.amber, fontWeight: 700 }}>If he asks {e.q}</span>
          <p className="font-sans m-0" style={{ fontSize: 15, lineHeight: 1.45, color: text }}>{e.a}</p>
        </div>
      ))}
    </div>
  )
}

/* ── The live presenter window ───────────────────────────────────────── */

export function OwenPresenter() {
  const [state, update] = useDeckSync()
  const elapsed = useElapsed(state.t0)
  const [showEmergency, setShowEmergency] = useState(false)
  useDeckKeys(state, update, {})

  const screen = SCREENS[state.i] ?? SCREENS[0]
  const g = GUIDE[screen.id]
  const last = SCREENS.length - 1
  const emergencyOpen = showEmergency || screen.id === "session"

  return (
    <div className="owen-scope min-h-screen font-sans" style={{ background: OW.ink, color: OW.paper }}>
      <header className="sticky top-0 z-10 flex items-center justify-between" style={{ padding: "12px 20px", background: OW.ink, borderBottom: `1px solid ${OW.hair}` }}>
        <div className="flex items-center" style={{ gap: 14 }}>
          <span className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: "0.24em", color: OW.ash }}>Presenter</span>
          <button type="button" onClick={() => update({ t0: state.t0 ? null : Date.now() })} className="font-mono tabular-nums rounded-md" title="T — start / stop timer" style={{ fontSize: 15, padding: "3px 10px", border: `1px solid ${state.t0 ? "rgba(45,212,191,0.4)" : OW.hair}`, color: state.t0 ? OW.teal : OW.ash, background: "transparent", cursor: "pointer" }}>
            {mmss(elapsed)}
          </button>
        </div>
        <div className="flex items-center" style={{ gap: 6 }}>
          <button type="button" onClick={() => update({ i: Math.max(0, state.i - 1) })} disabled={state.i === 0} aria-label="Previous" className="rounded-md font-sans" style={{ width: 32, height: 28, border: `1px solid ${OW.hair}`, background: "transparent", color: OW.paperDim, cursor: "pointer", opacity: state.i === 0 ? 0.3 : 1 }}>←</button>
          <span className="font-mono tabular-nums" style={{ fontSize: 12, color: OW.paperDim, minWidth: 44, textAlign: "center" }}>{state.i + 1} / {SCREENS.length}</span>
          <button type="button" onClick={() => update({ i: Math.min(last, state.i + 1) })} disabled={state.i === last} aria-label="Next" className="rounded-md font-sans" style={{ width: 32, height: 28, border: `1px solid ${OW.hair}`, background: "transparent", color: OW.paperDim, cursor: "pointer", opacity: state.i === last ? 0.3 : 1 }}>→</button>
        </div>
      </header>

      <main className="mx-auto flex flex-col" style={{ maxWidth: 720, padding: "22px 20px 60px", gap: 26 }}>
        <div className="flex flex-col" style={{ gap: 4 }}>
          <Eyebrow tone="teal">Screen {state.i + 1}</Eyebrow>
          <h1 className="font-sans m-0" style={{ fontSize: 28, lineHeight: 1.1, letterSpacing: "-0.02em", fontWeight: 600, color: OW.paper }}>{screen.title}</h1>
        </div>

        <GuideBody g={g} />

        <section className="flex flex-col" style={{ gap: 10, borderTop: `1px solid ${OW.hair}`, paddingTop: 18 }}>
          <button type="button" onClick={() => setShowEmergency((v) => !v)} className="flex items-center justify-between font-mono uppercase" style={{ fontSize: 11, letterSpacing: "0.22em", color: OW.amber, background: "transparent", border: "none", padding: 0, cursor: "pointer", fontWeight: 700 }}>
            <span>Emergency answers</span>
            <span>{emergencyOpen ? "−" : "+"}</span>
          </button>
          {emergencyOpen && <EmergencyList />}
        </section>

        <section className="flex flex-col" style={{ gap: 8 }}>
          <Eyebrow>What he says (for the follow-up email)</Eyebrow>
          <textarea
            value={state.notes}
            onChange={(e) => update({ notes: e.target.value })}
            placeholder="His words, verbatim. One line each."
            rows={5}
            className="font-sans w-full rounded-lg resize-y"
            style={{ padding: 12, fontSize: 14.5, lineHeight: 1.45, color: OW.paper, background: OW.ink2, border: `1px solid ${OW.hair}`, outline: "none" }}
          />
        </section>

        <footer className="flex flex-col font-mono" style={{ gap: 8, fontSize: 10.5, color: OW.ashSoft }}>
          <span>Tabs open, in this order: {TABS.join("  ·  ")}  — nothing else.</span>
          <span><Kbd>←</Kbd> <Kbd>→</Kbd> move both windows · <Kbd>1</Kbd>–<Kbd>4</Kbd> jump · <Kbd>T</Kbd> timer</span>
        </footer>
      </main>
    </div>
  )
}
