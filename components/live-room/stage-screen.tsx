"use client"

/**
 * LIVE ROOM — the stage screen
 *
 * A canvas chart that shares ONE clock with the timeline: the right edge
 * is NOW, x = event.at / nowMin. Overlays are read from the store —
 * lens level lines while a lens is hovered, event markers while an event
 * is hovered/focused, permanent entry/exit triangles. Colors are resolved
 * from the Vantary CSS variables at draw time, so a theme switch recolors
 * the chart too.
 */

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronUp, RotateCcw, X } from "lucide-react"
import { LR, lrMix } from "./live-room-tokens"
import { LrPane, LrRecess, LrEyebrow, LrChip, LrSegmented, LrCoin, LrLiveDot, LrGhostButton, useReducedMotion } from "./live-room-primitives"
import { useSession, type Timeframe, type ChartType } from "./session-store"
import { INSTRUMENTS, EVENT_META, clockLabel, type SessionEvent, type LevelKind } from "./session-state"
import { ReplayScrubber, PulseLane } from "./replay-scrubber"

/* ── color plumbing ──────────────────────────────────────────────────── */
function readVar(name: string, fallback: string) {
  if (typeof window === "undefined") return fallback
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return v || fallback
}
function toRgb(color: string): [number, number, number] {
  const c = color.trim()
  if (c.startsWith("#")) {
    const h = c.length === 4 ? c.slice(1).split("").map((x) => x + x).join("") : c.slice(1, 7)
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
  }
  const m = c.match(/rgba?\(([^)]+)\)/)
  if (m) { const p = m[1].split(",").map((x) => parseFloat(x)); return [p[0], p[1], p[2]] }
  return [45, 212, 191]
}
const a = (rgb: [number, number, number], alpha: number) => `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`

/* ── seeded series ───────────────────────────────────────────────────── */
function mulberry(seed: number) {
  let t = seed >>> 0
  return () => { t += 0x6d2b79f5; let r = Math.imul(t ^ (t >>> 15), 1 | t); r ^= r + Math.imul(r ^ (r >>> 7), 61 | r); return ((r ^ (r >>> 14)) >>> 0) / 4294967296 }
}
interface Candle { o: number; h: number; l: number; c: number; v: number; d: number }
function buildSeries(n: number, seed = 7): Candle[] {
  const rnd = mulberry(seed)
  const out: Candle[] = []
  let p = 2030.4
  for (let i = 0; i < n; i++) {
    // drift up into the sweep, then displacement after ~85%
    const drift = i / n < 0.62 ? 0.02 : i / n < 0.88 ? 0.11 : 0.05
    const o = p
    const move = (rnd() - 0.47) * 1.9 + drift
    const c = o + move
    const h = Math.max(o, c) + rnd() * 0.9
    const l = Math.min(o, c) - rnd() * 0.9
    const v = 0.4 + rnd() * 0.6 + (Math.abs(move) > 1.1 ? 0.5 : 0)
    const d = (c - o) * (0.6 + rnd() * 0.8) * 120
    out.push({ o, h, l, c, v, d })
    p = c
  }
  // pin the last close to the instrument price so the header number is true
  const last = out[out.length - 1]
  const target = INSTRUMENTS[0].price
  const shift = target - last.c
  return out.map((k) => ({ ...k, o: k.o + shift, h: k.h + shift, l: k.l + shift, c: k.c + shift }))
}
const TF_COUNT: Record<Timeframe, number> = { "1m": 120, "5m": 72, "15m": 44, "1H": 28, "4H": 16 }

const LEVEL_TONE: Record<LevelKind, "primary" | "up" | "down" | "warn"> = { entry: "primary", target: "up", tp1: "up", stop: "down", trail: "up", sweep: "warn", invalidation: "down" }

/* ── chart ───────────────────────────────────────────────────────────── */
/** Fills its wrapper — width AND height come from the ResizeObserver. */
function ChartCanvas() {
  const s = useSession()
  const reduce = useReducedMotion()
  const ref = React.useRef<HTMLCanvasElement>(null)
  const wrapRef = React.useRef<HTMLDivElement>(null)
  const seriesRef = React.useRef<Candle[]>(buildSeries(120))
  const [tick, setTick] = React.useState(0)

  // the chart owns the tape — price + extremes since the entry printed
  const tapeRef = React.useRef({ openedAt: s.openPositions[0]?.openedAt ?? s.anatomy?.openedAt ?? 39, nowMin: s.nowMin })
  tapeRef.current = { openedAt: s.openPositions[0]?.openedAt ?? s.anatomy?.openedAt ?? 39, nowMin: s.nowMin }
  const setTape = s.setTape
  const publishTape = React.useCallback(() => {
    const arr = seriesRef.current
    const { openedAt, nowMin } = tapeRef.current
    const from = Math.max(0, Math.min(arr.length - 1, Math.floor(arr.length * (openedAt / Math.max(1, nowMin)))))
    const since = arr.slice(from)
    setTape({ price: arr[arr.length - 1].c, hi: Math.max(...since.map((k) => k.h)), lo: Math.min(...since.map((k) => k.l)) })
  }, [setTape])

  // live drift — one new point every 1.6s (paused on reduced motion)
  React.useEffect(() => {
    publishTape()
    if (reduce) return
    const rnd = mulberry(99)
    const id = window.setInterval(() => {
      const arr = seriesRef.current
      const last = arr[arr.length - 1]
      const move = (rnd() - 0.48) * 0.6
      const c = last.c + move
      arr.push({ o: last.c, h: Math.max(last.c, c) + rnd() * 0.3, l: Math.min(last.c, c) - rnd() * 0.3, c, v: 0.3 + rnd() * 0.5, d: move * 90 })
      if (arr.length > 400) arr.shift()
      publishTape()
      setTick((t) => t + 1)
    }, 1600)
    return () => window.clearInterval(id)
  }, [reduce, publishTape])

  const hovered = s.hoveredEvent ? s.events.find((e) => e.id === s.hoveredEvent) : undefined
  const focused = s.focusedEvent ? s.events.find((e) => e.id === s.focusedEvent) : undefined
  const chartLens = s.chartLens
  const mode = s.screenMode
  const tf = s.timeframe
  const ct = s.chartType
  const events = s.knownEvents
  const nowMin = s.nowMin
  const viewMin = s.viewMin
  const replaying = s.replaying

  React.useEffect(() => {
    const canvas = ref.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    const W = wrap.clientWidth
    const H = wrap.clientHeight
    if (W < 40 || H < 40) return
    canvas.width = Math.floor(W * dpr); canvas.height = Math.floor(H * dpr)
    canvas.style.width = `${W}px`; canvas.style.height = `${H}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const P = toRgb(readVar("--vt-primary", "#2DD4BF"))
    const UP = toRgb(readVar("--vt-chart-up", "#10B981"))
    const DN = toRgb(readVar("--vt-chart-down", "#EF4444"))
    const WN = toRgb(readVar("--vt-warn", "#F59E0B"))
    const PAPER = toRgb(readVar("--vt-paper", "#EAEFF4"))
    const ASH = toRgb(readVar("--vt-ash-soft", "#5E6A75"))
    const toneRgb = (t: "primary" | "up" | "down" | "warn") => (t === "up" ? UP : t === "down" ? DN : t === "warn" ? WN : P)

    // aggregate to timeframe count
    const raw = seriesRef.current
    const want = TF_COUNT[tf]
    const bucket = Math.max(1, Math.floor(raw.length / want))
    const series: Candle[] = []
    for (let i = raw.length - want * bucket; i < raw.length; i += bucket) {
      const slice = raw.slice(Math.max(0, i), i + bucket)
      if (!slice.length) continue
      series.push({ o: slice[0].o, c: slice[slice.length - 1].c, h: Math.max(...slice.map((k) => k.h)), l: Math.min(...slice.map((k) => k.l)), v: slice.reduce((x, k) => x + k.v, 0) / slice.length, d: slice.reduce((x, k) => x + k.d, 0) })
    }

    const padL = 12, padR = 64, padT = 18
    const volH = mode === "flow" ? 44 : 26
    const padB = volH + 14
    const plotW = W - padL - padR
    const plotH = H - padT - padB
    const levels = [...(chartLens?.levels ?? []).filter((l) => l.instrument === INSTRUMENTS[0].symbol).map((l) => l.price)]
    let lo = Math.min(...series.map((k) => k.l), ...levels) - 1.2
    let hi = Math.max(...series.map((k) => k.h), ...levels) + 1.2
    if (hi - lo < 6) { const m = (hi + lo) / 2; lo = m - 3; hi = m + 3 }
    const y = (p: number) => padT + (1 - (p - lo) / (hi - lo)) * plotH
    const xi = (i: number) => padL + ((i + 0.5) / series.length) * plotW
    const xt = (atMin: number) => padL + Math.max(0, Math.min(1, atMin / Math.max(1, nowMin))) * plotW
    // replay: candles after the cutoff are ghosted, the price tag reads the cutoff close
    const cut = replaying ? Math.max(1, Math.min(series.length, Math.round(series.length * (viewMin / Math.max(1, nowMin))))) : series.length
    const ghost = (i: number) => (i >= cut ? 0.22 : 1)

    ctx.clearRect(0, 0, W, H)

    // grid
    ctx.strokeStyle = a(P, 0.05); ctx.lineWidth = 1
    for (let g = 0; g <= 4; g++) { const gy = padT + (g / 4) * plotH; ctx.beginPath(); ctx.moveTo(padL, gy); ctx.lineTo(W - padR, gy); ctx.stroke() }
    ctx.font = "9px ui-monospace, SFMono-Regular, Menlo, monospace"; ctx.textAlign = "right"; ctx.fillStyle = a(ASH, 0.9)
    for (let g = 0; g <= 4; g++) { const v = hi - (g / 4) * (hi - lo); const gy = padT + (g / 4) * plotH; ctx.fillText(v.toFixed(1), W - 8, gy + 3) }

    // phase shading — the execute phase carries a whisper of primary
    const exec = s.phaseStarts.execute
    if (exec) { ctx.fillStyle = a(P, 0.025); ctx.fillRect(xt(exec.at), padT, W - padR - xt(exec.at), plotH) }

    // series
    const cw = Math.max(1.5, (plotW / series.length) * 0.62)
    if (ct === "candles") {
      series.forEach((k, i) => {
        const up = k.c >= k.o
        const col = up ? UP : DN
        const x = xi(i)
        const g = ghost(i)
        ctx.strokeStyle = a(col, 0.85 * g); ctx.lineWidth = 1
        ctx.beginPath(); ctx.moveTo(x, y(k.h)); ctx.lineTo(x, y(k.l)); ctx.stroke()
        ctx.fillStyle = up ? a(col, 0.55 * g) : a(col, 0.75 * g)
        const top = y(Math.max(k.o, k.c)), bot = y(Math.min(k.o, k.c))
        ctx.fillRect(x - cw / 2, top, cw, Math.max(1, bot - top))
      })
    } else {
      const drawPath = (from: number, to: number, alpha: number) => {
        ctx.beginPath(); ctx.strokeStyle = a(P, alpha); ctx.lineWidth = 1.6; ctx.lineJoin = "round"
        ctx.shadowColor = a(P, 0.4 * alpha); ctx.shadowBlur = 10
        for (let i = from; i < to; i++) { const x = xi(i), yy = y(series[i].c); if (i === from) ctx.moveTo(x, yy); else ctx.lineTo(x, yy) }
        ctx.stroke(); ctx.shadowBlur = 0
      }
      drawPath(0, cut, 0.95)
      if (cut < series.length) drawPath(cut - 1, series.length, 0.25)
      ctx.beginPath()
      for (let i = 0; i < cut; i++) { const x = xi(i), yy = y(series[i].c); if (i === 0) ctx.moveTo(x, yy); else ctx.lineTo(x, yy) }
      ctx.lineTo(xi(cut - 1), padT + plotH); ctx.lineTo(xi(0), padT + plotH); ctx.closePath()
      const g = ctx.createLinearGradient(0, padT, 0, padT + plotH); g.addColorStop(0, a(P, 0.16)); g.addColorStop(1, a(P, 0))
      ctx.fillStyle = g; ctx.fill()
    }

    // EMA 9 / EMA 21 / VWAP — one hue, three opacities, known portion only
    const ema = (n: number) => { const k = 2 / (n + 1); let e = series[0].c; return series.map((c) => (e = c.c * k + e * (1 - k))) }
    const drawLine = (vals: number[], alpha: number, dash: number[] = []) => {
      ctx.setLineDash(dash); ctx.beginPath(); ctx.strokeStyle = a(P, alpha); ctx.lineWidth = 1
      vals.slice(0, cut).forEach((v, i) => { const x = xi(i), yy = y(v); if (i === 0) ctx.moveTo(x, yy); else ctx.lineTo(x, yy) })
      ctx.stroke(); ctx.setLineDash([])
    }
    drawLine(ema(9), 0.7); drawLine(ema(21), 0.4)
    let cumPV = 0, cumV = 0
    drawLine(series.map((k) => { cumPV += k.c * k.v; cumV += k.v; return cumPV / cumV }), 0.25, [3, 4])

    // volume / delta
    const baseY = H - 12
    series.forEach((k, i) => {
      const x = xi(i)
      const g = ghost(i)
      if (mode === "flow") {
        const hgt = Math.min(volH - 6, Math.abs(k.d) / 6)
        ctx.fillStyle = k.d >= 0 ? a(UP, 0.55 * g) : a(DN, 0.55 * g)
        const mid = baseY - volH / 2
        ctx.fillRect(x - cw / 2, k.d >= 0 ? mid - hgt : mid, cw, Math.max(1, hgt))
      } else {
        const hgt = Math.min(volH - 4, k.v * 20)
        ctx.fillStyle = k.c >= k.o ? a(UP, 0.28 * g) : a(DN, 0.24 * g)
        ctx.fillRect(x - cw / 2, baseY - hgt, cw, hgt)
      }
    })
    if (mode === "flow") {
      ctx.strokeStyle = a(P, 0.25); ctx.beginPath(); ctx.moveTo(padL, baseY - volH / 2); ctx.lineTo(W - padR, baseY - volH / 2); ctx.stroke()
      ctx.font = "9px ui-monospace, SFMono-Regular, Menlo, monospace"; ctx.textAlign = "left"; ctx.fillStyle = a(P, 0.8); ctx.fillText("DELTA", padL, baseY - volH + 2)
    }

    // last (or cutoff) price
    const last = series[cut - 1]
    const ly = y(last.c)
    const TAG = replaying ? WN : P
    ctx.setLineDash([2, 4]); ctx.strokeStyle = a(TAG, 0.35); ctx.beginPath(); ctx.moveTo(padL, ly); ctx.lineTo(W - padR, ly); ctx.stroke(); ctx.setLineDash([])
    ctx.fillStyle = a(TAG, 0.95); ctx.fillRect(W - padR + 2, ly - 8, padR - 6, 16)
    ctx.font = "600 9.5px ui-monospace, SFMono-Regular, Menlo, monospace"; ctx.textAlign = "center"; ctx.fillStyle = "#0D1E1C"
    ctx.fillText(last.c.toFixed(2), W - padR / 2, ly + 3.5)
    const pulse = 3 + Math.sin(Date.now() / 420) * 1.2
    ctx.beginPath(); ctx.arc(xi(cut - 1), ly, replaying ? 3 : pulse, 0, Math.PI * 2); ctx.fillStyle = a(TAG, 0.9); ctx.fill()

    // replay head — a hairline where the room's knowledge ends
    if (replaying) {
      const rx = xt(viewMin)
      ctx.fillStyle = a(ASH, 0.06); ctx.fillRect(rx, padT, W - padR - rx, plotH)
      ctx.setLineDash([3, 3]); ctx.strokeStyle = a(WN, 0.75); ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(rx, padT - 4); ctx.lineTo(rx, padT + plotH + volH + 6); ctx.stroke(); ctx.setLineDash([])
      const label = `REPLAY · ${clockLabel(viewMin)}`
      ctx.font = "600 9px ui-monospace, SFMono-Regular, Menlo, monospace"
      const tw = ctx.measureText(label).width + 12
      const lx = Math.min(Math.max(padL, rx - tw / 2), W - padR - tw)
      ctx.fillStyle = a(WN, 0.9); ctx.fillRect(lx, padT + plotH - 16, tw, 14)
      ctx.fillStyle = "#1A1305"; ctx.textAlign = "left"; ctx.fillText(label, lx + 6, padT + plotH - 6)
    }

    // permanent entry / exit triangles
    events.filter((e) => e.type === "entry" || e.type === "exit").forEach((e) => {
      const price = e.type === "entry" ? e.levels?.find((l) => l.kind === "entry")?.price : parseFloat(e.facts?.find((f) => /exit/i.test(f.label))?.value ?? "")
      if (!price || Number.isNaN(price)) return
      const x = xt(e.at), yy = y(price)
      const col = e.type === "entry" ? UP : (e.pnl ?? 0) >= 0 ? UP : DN
      ctx.fillStyle = a(col, 0.95); ctx.beginPath()
      if (e.type === "entry") { ctx.moveTo(x, yy + 8); ctx.lineTo(x - 5, yy + 15); ctx.lineTo(x + 5, yy + 15) } else { ctx.moveTo(x, yy - 8); ctx.lineTo(x - 5, yy - 15); ctx.lineTo(x + 5, yy - 15) }
      ctx.closePath(); ctx.fill()
    })

    // lens level lines
    if (chartLens) {
      chartLens.levels.filter((l) => l.instrument === INSTRUMENTS[0].symbol).forEach((l) => {
        const col = toneRgb(LEVEL_TONE[l.kind]); const yy = y(l.price)
        ctx.setLineDash([5, 5]); ctx.strokeStyle = a(col, 0.7); ctx.lineWidth = 1
        ctx.beginPath(); ctx.moveTo(padL, yy); ctx.lineTo(W - padR, yy); ctx.stroke(); ctx.setLineDash([])
        ctx.fillStyle = a(col, 0.14); ctx.fillRect(padL, yy - 9, 74, 15)
        ctx.font = "600 9px ui-monospace, SFMono-Regular, Menlo, monospace"; ctx.textAlign = "left"; ctx.fillStyle = a(col, 1)
        ctx.fillText(`${l.kind.toUpperCase()} ${l.price.toFixed(2)}`, padL + 5, yy + 2.5)
      })
    }

    // event markers (hovered → soft, focused → strong)
    const marker = (e: SessionEvent, strong: boolean) => {
      const x = xt(e.at)
      const col = e.type === "warning" ? WN : e.type === "entry" || e.type === "exit" ? UP : P
      ctx.setLineDash([2, 3]); ctx.strokeStyle = a(col, strong ? 0.7 : 0.4); ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(x, padT - 4); ctx.lineTo(x, padT + plotH); ctx.stroke(); ctx.setLineDash([])
      const label = `${EVENT_META[e.type].label.toUpperCase()} · ${clockLabel(e.at)}`
      ctx.font = "600 9px ui-monospace, SFMono-Regular, Menlo, monospace"
      const tw = ctx.measureText(label).width + 12
      const lx = Math.min(Math.max(padL, x - tw / 2), W - padR - tw)
      ctx.fillStyle = a(col, strong ? 0.22 : 0.14); ctx.fillRect(lx, 2, tw, 14)
      ctx.fillStyle = a(col, 1); ctx.textAlign = "left"; ctx.fillText(label, lx + 6, 12)
    }
    if (focused) marker(focused, true)
    if (hovered && hovered.id !== focused?.id) marker(hovered, false)

    // mentor focus crosshair — the most recent level-call on the primary instrument
    const focusCall = [...events].reverse().find((e) => e.type === "level-call" && e.instrument === INSTRUMENTS[0].symbol)
    if (focusCall?.levels?.[0]) {
      const fx = xt(focusCall.at), fy = y(focusCall.levels[0].price)
      ctx.strokeStyle = a(PAPER, 0.16); ctx.lineWidth = 1; ctx.setLineDash([1, 5])
      ctx.beginPath(); ctx.moveTo(fx, padT); ctx.lineTo(fx, padT + plotH); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(padL, fy); ctx.lineTo(W - padR, fy); ctx.stroke(); ctx.setLineDash([])
      ctx.beginPath(); ctx.arc(fx, fy, 3.5, 0, Math.PI * 2); ctx.strokeStyle = a(PAPER, 0.7); ctx.stroke()
      ctx.font = "600 9px ui-monospace, SFMono-Regular, Menlo, monospace"; ctx.textAlign = "left"; ctx.fillStyle = a(PAPER, 0.6)
      ctx.fillText("MENTOR FOCUS", fx + 8, fy - 6)
    }
  }, [tick, hovered, focused, chartLens, mode, tf, ct, events, nowMin, viewMin, replaying, s.phaseStarts])

  // redraw on resize — width or height (the screen panel is draggable both ways)
  React.useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    const ro = new ResizeObserver(() => setTick((t) => t + 1))
    ro.observe(wrap)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={wrapRef} className="absolute inset-0">
      <canvas ref={ref} aria-label={`${INSTRUMENTS[0].symbol} ${tf} chart`} role="img" className="block" />
    </div>
  )
}

/* ── transport — replay · pulse · tape, folded into one 34px bar ─────── */
function PulseMicro() {
  const s = useSession()
  const max = Math.max(1, ...s.pulse.map((p) => p.reactions))
  const bars = s.pulse.slice(-14)
  return (
    <span aria-hidden className="inline-flex items-end gap-[2px] shrink-0" style={{ height: 12 }}>
      {bars.map((p) => {
        const lit = s.hoveredEvent === p.id || s.focusedEvent === p.id
        const future = p.at > s.viewMin + 0.001
        return <span key={p.id} className="block rounded-[1px]" style={{ width: 2, height: Math.max(2, (p.reactions / max) * 12), background: lit ? LR.primary : lrMix(p.mentor ? LR.primary : LR.ashSoft, future ? 0.25 : 0.7), transition: "background 200ms" }} />
      })}
    </span>
  )
}

const TAPE: [string, string][] = [["Vol", "12.4K"], ["OI", "+2.1K"], ["Delta", "+340"], ["Spread", "0.3"]]

function TransportBar({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const s = useSession()
  const known = s.knownEvents.length
  const warn = s.replaying
  return (
    <div className="flex items-center gap-3 min-w-0 shrink-0" style={{ height: 34, padding: "0 4px" }}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls="lr-transport-drawer"
        className="inline-flex items-center gap-2 min-w-0 focus:outline-none focus-visible:ring-1 rounded-md"
        style={{ padding: "4px 6px", background: "transparent", border: "none", color: "inherit", cursor: "pointer" }}
        title={open ? "Fold the replay lanes" : "Open decision replay and room pulse"}
      >
        <LrLiveDot tone={warn ? "warn" : "down"} size={5} />
        <LrEyebrow tone={warn ? "warn" : "ash"} size={9}>{warn ? "Replay" : "Live"}</LrEyebrow>
        <span className="font-mono tabular-nums truncate" style={{ fontSize: 10.5, color: warn ? LR.paper : LR.paperDim }}>
          {warn ? <>{clockLabel(s.viewMin)} · <span style={{ color: LR.warn }}>{known} of {s.events.length} known</span></> : <>{clockLabel(s.nowMin)} · <span style={{ color: LR.ashSoft }}>replay</span></>}
        </span>
        <ChevronUp size={12} style={{ color: LR.ashSoft, transform: open ? "rotate(180deg)" : "none", transition: "transform 240ms" }} aria-hidden />
      </button>
      {warn && <LrChip tone="warn" active size={9} glyph={<RotateCcw size={10} />} onClick={() => s.setCutoff(null)} pill>Live</LrChip>}
      <span className="flex-1" />
      <button type="button" onClick={onToggle} aria-label="Room pulse" className="inline-flex items-center gap-2 shrink-0 focus:outline-none rounded-md lr-hide-xs" style={{ background: "transparent", border: "none", padding: "4px 6px", cursor: "pointer", color: "inherit" }}>
        <LrEyebrow size={9} weight={500}>Pulse</LrEyebrow>
        <PulseMicro />
      </button>
      <span className="inline-flex items-center gap-x-3 shrink-0 lr-hide-xs" aria-label="Tape">
        {TAPE.map(([l, v]) => (
          <span key={l} className="inline-flex items-center gap-1.5">
            <LrEyebrow size={9} weight={500}>{l}</LrEyebrow>
            <span className="font-mono tabular-nums" style={{ fontSize: 10.5, color: v.startsWith("+") ? LR.up : LR.paperDim }}>{v}</span>
          </span>
        ))}
      </span>
    </div>
  )
}

/** Slides up over the chart's lower part — never pushes the layout. */
function TransportDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const s = useSession()
  const reduce = useReducedMotion()
  React.useEffect(() => {
    if (!open) return
    const on = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", on)
    return () => window.removeEventListener("keydown", on)
  }, [open, onClose])
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="transport"
          id="lr-transport-drawer"
          role="region"
          aria-label="Decision replay and room pulse"
          className="absolute left-0 right-0 bottom-0 z-[3] flex flex-col gap-2.5"
          style={{ padding: "10px 6px 10px", background: `linear-gradient(180deg, ${lrMix(LR.ink, 0.82)} 0%, ${lrMix(LR.ink, 0.94)} 100%)`, backdropFilter: "blur(14px) saturate(140%)", WebkitBackdropFilter: "blur(14px) saturate(140%)", borderTop: `1px solid ${lrMix(s.replaying ? LR.warn : LR.primary, 0.28)}` }}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
          transition={{ duration: reduce ? 0.12 : 0.24, ease: LR.ease }}
        >
          <span aria-hidden className="absolute left-4 right-4 top-0" style={{ height: 1, background: LR.thread(s.replaying ? LR.warn : LR.primary, 0.7) }} />
          <div className="absolute right-3 top-2">
            <LrGhostButton label="Fold the replay lanes" onClick={onClose} size={24}><X size={11} /></LrGhostButton>
          </div>
          <ReplayScrubber />
          <span aria-hidden className="mx-3 h-px" style={{ background: LR.dashed() }} />
          <PulseLane />
          <div className="lr-wells grid gap-2 px-2 pt-1">
            <Rsi value={58.4} />
            <Macd />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ── indicator wells ───���─────────────────────────────────────────────── */
function Rsi({ value }: { value: number }) {
  const segs = 20
  const lit = Math.round((value / 100) * segs)
  return (
    <LrRecess className="flex items-center gap-3 px-3 py-2.5 min-w-0">
      <LrEyebrow size={9}>RSI</LrEyebrow>
      <span className="font-mono tabular-nums" style={{ fontSize: 12, color: LR.paper }}>{value.toFixed(1)}</span>
      <span className="flex-1 flex items-center gap-[2px]" aria-hidden>
        {Array.from({ length: segs }).map((_, i) => (
          <span key={i} className="flex-1 rounded-[1px]" style={{ height: 8, background: i < lit ? lrMix(LR.primary, i >= 14 ? 0.85 : 0.5) : lrMix(LR.primary, 0.08), transition: "background 300ms ease" }} />
        ))}
      </span>
    </LrRecess>
  )
}
function Macd() {
  const data = React.useMemo(() => { const r = mulberry(3); return Array.from({ length: 24 }, (_, i) => Math.sin(i / 3.2) * 0.5 + (r() - 0.5) * 0.35) }, [])
  const last = data[data.length - 1]
  return (
    <LrRecess className="flex items-center gap-3 px-3 py-2.5 min-w-0">
      <LrEyebrow size={9}>MACD</LrEyebrow>
      <span className="font-mono tabular-nums" style={{ fontSize: 12, color: last >= 0 ? LR.up : LR.down }}>{last >= 0 ? "+" : ""}{last.toFixed(2)}</span>
      <span className="flex-1 flex items-center gap-[2px]" aria-hidden style={{ height: 16 }}>
        {data.map((v, i) => (
          <span key={i} className="flex-1 flex items-center" style={{ height: 16 }}>
            <span className="w-full rounded-[1px]" style={{ height: Math.max(1, Math.abs(v) * 14), background: lrMix(v >= 0 ? LR.up : LR.down, 0.7), alignSelf: v >= 0 ? "flex-start" : "flex-end", marginTop: v >= 0 ? 8 - Math.abs(v) * 14 : 0, marginBottom: v < 0 ? 8 - Math.abs(v) * 14 : 0 }} />
          </span>
        ))}
      </span>
    </LrRecess>
  )
}

/* ── the pane — the hero. Fills its panel; the chart takes every spare px ── */
export function StageScreen({ delay = 0 }: { delay?: number }) {
  const s = useSession()
  const [transport, setTransport] = React.useState(false)
  const inst = INSTRUMENTS[0]
  const up = inst.change >= 0
  // entering replay from anywhere (keyboard, pulse) opens the lanes so the head is visible
  React.useEffect(() => { if (s.replaying) setTransport(true) }, [s.replaying])
  const closeTransport = React.useCallback(() => setTransport(false), [])

  return (
    <LrPane labelledBy="lr-screen-title" delay={delay} tone={s.screenMode === "flow" ? "up" : "primary"} fill>
      <div className="flex items-center gap-3 px-4 pt-3 pb-2 min-w-0 shrink-0">
        <span id="lr-screen-title" className="lr-scr-eyebrow font-mono uppercase whitespace-nowrap" style={{ fontSize: 9, letterSpacing: LR.type.headerTracking, color: s.screenMode === "flow" ? LR.up : LR.primary, fontWeight: 600 }}>Screen share</span>
        <span aria-hidden className="lr-scr-dash h-px w-3 shrink-0" style={{ background: LR.dashed() }} />
        <span className="inline-flex items-center gap-2 shrink-0">
          <span className="font-mono" style={{ fontSize: 12, fontWeight: 600, color: LR.paper, letterSpacing: "0.02em" }}>{inst.symbol}</span>
          <span className="font-mono tabular-nums" style={{ fontSize: 11, color: up ? LR.up : LR.down }}>{up ? "+" : ""}{inst.change.toFixed(2)}%</span>
          <span className="font-mono tabular-nums lr-scr-hl" style={{ fontSize: 10, color: LR.ashSoft, letterSpacing: "0.06em" }}>
            H <span style={{ color: LR.paperDim }}>{inst.high.toFixed(2)}</span>&nbsp;&nbsp;L <span style={{ color: LR.paperDim }}>{inst.low.toFixed(2)}</span>
          </span>
        </span>
        <span className="flex-1 min-w-2" />
        <LrSegmented<Timeframe> layoutId="lr-tf" label="Timeframe" value={s.timeframe} onChange={(tf) => s.dispatch({ type: "timeframe", tf })} options={(["1m", "5m", "15m", "1H", "4H"] as Timeframe[]).map((t) => ({ id: t, label: t }))} />
        <span className="lr-scr-ct"><LrSegmented<ChartType> layoutId="lr-ct" label="Chart type" value={s.chartType} onChange={(ct) => s.dispatch({ type: "chartType", ct })} options={[{ id: "candles", label: "Candles" }, { id: "line", label: "Line" }]} /></span>
        <span className="lr-scr-live inline-flex shrink-0">
          {s.replaying
            ? <LrChip tone="warn" active size={9}>Replay · {clockLabel(s.viewMin)}</LrChip>
            : <LrChip tone="down" active size={9} glyph={<LrLiveDot tone="down" size={5} />}>Live</LrChip>}
        </span>
      </div>

      <div className="flex-1 min-h-0 flex flex-col px-3 pb-2 gap-1.5">
        {/* chart — fills */}
        <div className="relative flex-1 min-h-0 overflow-hidden" style={{ borderRadius: 14, border: `1px solid ${LR.recess.border}`, background: lrMix(LR.pane.bgDeep, 0.5) }}>
          <ChartCanvas />

          {/* legend */}
          <div className="absolute left-3 top-2 flex items-center gap-3 pointer-events-none" aria-hidden>
            {[["EMA 9", 0.9], ["EMA 21", 0.55], ["VWAP", 0.32]].map(([l, o]) => (
              <span key={l as string} className="inline-flex items-center gap-1.5">
                <span style={{ width: 10, height: 1.5, background: LR.primary, opacity: o as number }} />
                <span className="font-mono" style={{ fontSize: 9, letterSpacing: "0.12em", color: LR.ashSoft }}>{l}</span>
              </span>
            ))}
            {s.screenMode === "flow" && <LrChip tone="up" active size={9}>Flow</LrChip>}
          </div>

          {/* mentor cam coin — top-left under the legend: the series climbs from
              bottom-left, so this corner is the one the chart never paints */}
          <motion.div className="absolute flex flex-col items-center gap-1.5 z-[2]" style={{ left: 12, top: 28 }} initial={false} animate={{ opacity: transport ? 0.9 : 1 }}>
            <LrCoin initials="A" size={44} radius={14} ring />
            <span className="inline-flex items-center gap-1.5">
              <LrLiveDot tone="down" size={5} />
              <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.16em", color: LR.down, fontWeight: 600 }}>REC</span>
            </span>
          </motion.div>

          <TransportDrawer open={transport} onClose={closeTransport} />
        </div>

        <TransportBar open={transport} onToggle={() => setTransport((t) => !t)} />
      </div>
    </LrPane>
  )
}
