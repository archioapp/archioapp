"use client"

import { motion, useReducedMotion } from "framer-motion"
import { DECISION, GAP, SESSION, TODAY, type ScreenId } from "./owen-data"
import { EASE, OW } from "./owen-ui"

const H = ({ children, size = "clamp(2.2rem, 4.6vw, 4.1rem)" }: { children: React.ReactNode; size?: string }) => (
  <h2 className="font-sans text-balance" style={{ fontSize: size, lineHeight: 1.08, letterSpacing: "-0.022em", fontWeight: 500, color: OW.paper, margin: 0 }}>
    {children}
  </h2>
)

const rise = (delay = 0, reduced = false) => ({
  initial: reduced ? false : { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: EASE },
})

/* ── 1 · THE GAP ─────────────────────────────────────────────────────── */

function Gap() {
  const reduced = !!useReducedMotion()
  const n = GAP.chain.length
  const T = reduced ? 0 : 1 // time scale — reduced motion lands everything at once
  return (
    <div className="flex flex-col" style={{ gap: "clamp(48px, 9vh, 96px)" }}>
      <div className="flex flex-col" style={{ gap: 6 }}>
        {GAP.headline.map((line, i) => (
          <motion.div key={line} {...rise(0.1 * i * T, reduced)}>
            <H>{line}</H>
          </motion.div>
        ))}
      </div>

      {/* the chain: five nodes on a hairline; only EXECUTION is lit today.
          then one teal thread draws beneath all five — ARCHIO keeps the record. */}
      <div className="w-full" style={{ maxWidth: 920 }}>
        <div className="relative" style={{ height: 22 }}>
          <motion.div
            className="absolute left-0 right-0 rounded-full"
            style={{ top: 10, height: 1, background: OW.hairStrong, transformOrigin: "left" }}
            initial={reduced ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, delay: 0.5 * T, ease: EASE }}
          />
          <div className="absolute inset-0 flex items-center justify-between">
            {GAP.chain.map((w, i) => {
              const lit = w === GAP.recorded
              return (
                <motion.span
                  key={w}
                  className="block rounded-full"
                  style={{ width: lit ? 12 : 10, height: lit ? 12 : 10, border: `1.5px solid ${lit ? OW.paper : OW.ash}`, background: lit ? OW.paper : OW.ink, boxShadow: lit ? "0 0 0 6px rgba(234,239,244,0.06)" : "none" }}
                  initial={reduced ? false : { opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: (0.8 + i * 0.14) * T, ease: EASE }}
                />
              )
            })}
          </div>
        </div>

        <div className="flex items-start justify-between" style={{ marginTop: 10 }}>
          {GAP.chain.map((w, i) => {
            const lit = w === GAP.recorded
            return (
              <motion.span
                key={w}
                className="font-mono uppercase text-center"
                style={{ fontSize: "clamp(9.5px, 1.05vw, 12px)", letterSpacing: "0.2em", color: lit ? OW.paper : OW.ash, width: `${100 / n}%`, marginLeft: i === 0 ? `-${50 / n}%` : 0, marginRight: i === n - 1 ? `-${50 / n}%` : 0, fontWeight: lit ? 600 : 500 }}
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: (0.95 + i * 0.14) * T }}
              >
                {w}
              </motion.span>
            )
          })}
        </div>

        <div className="relative" style={{ marginTop: 34, height: 28 }}>
          <motion.div
            className="absolute left-0 right-0 rounded-full"
            style={{ top: 0, height: 2, background: OW.teal, transformOrigin: "left", boxShadow: "0 0 18px rgba(45,212,191,0.35)" }}
            initial={reduced ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 2.0 * T, ease: EASE }}
          />
          <motion.span
            className="absolute right-0 font-mono uppercase"
            style={{ top: 12, fontSize: "clamp(9.5px, 1.05vw, 12px)", letterSpacing: "0.22em", color: OW.teal, fontWeight: 600 }}
            initial={reduced ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.9 * T, ease: EASE }}
          >
            {GAP.thread}
          </motion.span>
        </div>
      </div>
    </div>
  )
}

/* ── 2 · ONE DECISION ────────────────────────────────────────────────── */

function Decision() {
  const reduced = !!useReducedMotion()
  const T = reduced ? 0 : 1
  return (
    <div className="flex flex-col" style={{ gap: "clamp(28px, 5vh, 52px)" }}>
      <motion.div {...rise(0, reduced)}>
        <H>{DECISION.headline}</H>
      </motion.div>

      <ol className="flex flex-col list-none m-0 p-0" style={{ gap: 0, maxWidth: 720 }}>
        {DECISION.steps.map((s, i) => (
          <li key={s.label} className="flex flex-col">
            <motion.div
              className="grid items-baseline"
              style={{ gridTemplateColumns: "minmax(112px, 150px) 1fr", columnGap: 24 }}
              {...rise((0.25 + i * 0.16) * T, reduced)}
            >
              <span className="font-mono uppercase" style={{ fontSize: "clamp(10px, 1.1vw, 12.5px)", letterSpacing: "0.22em", color: OW.teal, fontWeight: 600 }}>
                {s.label}
              </span>
              <span className="font-sans" style={{ fontSize: "clamp(1.15rem, 2.1vw, 1.7rem)", lineHeight: 1.2, letterSpacing: "-0.012em", color: OW.paper, fontWeight: 450 }}>
                {s.sub}
              </span>
            </motion.div>
            {i < DECISION.steps.length - 1 && (
              <motion.span
                aria-hidden
                className="font-sans"
                style={{ display: "block", fontSize: "clamp(1rem, 1.6vw, 1.3rem)", lineHeight: 1, color: OW.ashSoft, margin: "clamp(6px, 1.2vh, 12px) 0", paddingLeft: "clamp(40px, 5vw, 60px)" }}
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: (0.4 + i * 0.16) * T }}
              >
                ↓
              </motion.span>
            )}
          </li>
        ))}
      </ol>

      <motion.p className="font-sans m-0" style={{ fontSize: "clamp(0.95rem, 1.35vw, 1.15rem)", color: OW.ash, letterSpacing: "-0.005em" }} {...rise(1.25 * T, reduced)}>
        {DECISION.footer}
      </motion.p>
    </div>
  )
}

/* ── 3 · WHERE WE ARE TODAY ──────────────────────────────────────────── */

function Marker({ kind }: { kind: "live" | "built" | "next" }) {
  const base = { width: 9, height: 9, borderRadius: 999, flexShrink: 0 } as const
  if (kind === "live") return <span aria-hidden style={{ ...base, background: OW.teal, boxShadow: "0 0 10px rgba(45,212,191,0.5)" }} />
  if (kind === "built") return <span aria-hidden style={{ ...base, border: `1.5px solid ${OW.teal}` }} />
  return <span aria-hidden style={{ ...base, border: `1.5px dashed ${OW.ash}` }} />
}

function Today() {
  const reduced = !!useReducedMotion()
  const T = reduced ? 0 : 1
  return (
    <div className="flex flex-col" style={{ gap: "clamp(32px, 6vh, 64px)" }}>
      <motion.div {...rise(0, reduced)}>
        <H>{TODAY.headline}</H>
      </motion.div>
      <div className="grid gap-x-10 gap-y-10 md:grid-cols-3">
        {TODAY.columns.map((c, ci) => (
          <motion.section key={c.id} aria-label={c.label} className="flex flex-col" style={{ gap: 18, borderTop: `1px solid ${ci === 0 ? OW.teal : OW.hairStrong}`, paddingTop: 16 }} {...rise((0.2 + ci * 0.18) * T, reduced)}>
            <span className="font-mono uppercase" style={{ fontSize: "clamp(10px, 1.1vw, 12.5px)", letterSpacing: "0.22em", color: c.id === "next" ? OW.ash : OW.teal, fontWeight: 600 }}>
              {c.label}
            </span>
            <ul className="flex flex-col list-none m-0 p-0" style={{ gap: 12 }}>
              {c.items.map((it, ii) => (
                <motion.li
                  key={it}
                  className="flex items-center font-sans"
                  style={{ gap: 12, fontSize: "clamp(1.05rem, 1.7vw, 1.4rem)", lineHeight: 1.25, letterSpacing: "-0.01em", color: c.id === "next" ? OW.paperDim : OW.paper, fontWeight: 450 }}
                  initial={reduced ? false : { opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: (0.45 + ci * 0.18 + ii * 0.08) * T, ease: EASE }}
                >
                  <Marker kind={c.id} />
                  {it}
                </motion.li>
              ))}
            </ul>
          </motion.section>
        ))}
      </div>
    </div>
  )
}

/* ── 4 · WORKING SESSION ─────────────────────────────────────────────── */

function Session() {
  const reduced = !!useReducedMotion()
  const T = reduced ? 0 : 1
  return (
    <div className="flex flex-col" style={{ gap: "clamp(36px, 7vh, 72px)" }}>
      <motion.div {...rise(0, reduced)}>
        <H>{SESSION.headline}</H>
      </motion.div>
      <ol className="flex flex-col list-none m-0 p-0" style={{ gap: "clamp(18px, 3.2vh, 30px)", maxWidth: 860 }}>
        {SESSION.questions.map((q, i) => (
          <motion.li key={q} className="grid items-baseline" style={{ gridTemplateColumns: "44px 1fr", columnGap: 16 }} {...rise((0.3 + i * 0.22) * T, reduced)}>
            <span className="font-mono" style={{ fontSize: "clamp(11px, 1.2vw, 13px)", letterSpacing: "0.16em", color: OW.teal, fontWeight: 600 }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="font-sans text-pretty" style={{ fontSize: "clamp(1.35rem, 2.6vw, 2.1rem)", lineHeight: 1.22, letterSpacing: "-0.018em", color: OW.paper, fontWeight: 450 }}>
              {q}
            </span>
          </motion.li>
        ))}
      </ol>
    </div>
  )
}

export function ScreenView({ id }: { id: ScreenId }) {
  if (id === "gap") return <Gap />
  if (id === "decision") return <Decision />
  if (id === "today") return <Today />
  return <Session />
}
