"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Users, Volume2, VolumeX, LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { LR, lrMix } from "./live-room-tokens"
import { LrEyebrow, LrLiveDot, LrChip, LrGhostButton, useReducedMotion } from "./live-room-primitives"
import { useSession } from "./session-store"
import { elapsedLabel, INSTRUMENTS, PHASES, SESSION_META, AUDIENCE } from "./session-state"

/** Five-bar audio waveform, primary at 0.55, deterministic phase per bar. */
function Waveform({ muted }: { muted: boolean }) {
  const reduce = useReducedMotion()
  return (
    <span aria-hidden className="inline-flex items-end gap-[2px]" style={{ height: 14 }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.span
          key={i}
          className="block rounded-full"
          style={{ width: 2, background: LR.primary, opacity: muted ? 0.25 : 0.55, transformOrigin: "bottom" }}
          animate={reduce || muted ? { height: 4 } : { height: [4, 11 + (i % 3) * 1.5, 5, 13 - (i % 2) * 3, 4] }}
          transition={{ duration: 1.3 + i * 0.13, repeat: Infinity, ease: "easeInOut", delay: i * 0.08 }}
        />
      ))}
    </span>
  )
}

export function RoomHeader({ onLeave, theater, onToggleTheater }: { onLeave?: () => void; theater?: boolean; onToggleTheater?: () => void }) {
  const s = useSession()
  const phase = PHASES.find((p) => p.id === s.phase)!
  const primary = INSTRUMENTS.filter((i) => i.priority === "primary")
  const secondary = INSTRUMENTS.filter((i) => i.priority === "secondary")

  // ⌘\ (or Ctrl+\) toggles theater — the shell folds its chrome around the room
  React.useEffect(() => {
    if (!onToggleTheater) return
    const on = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key === "\\") { e.preventDefault(); onToggleTheater() } }
    window.addEventListener("keydown", on)
    return () => window.removeEventListener("keydown", on)
  }, [onToggleTheater])

  return (
    <header
      className="lr-header relative z-30 flex items-center gap-3 px-4 min-w-0 overflow-hidden shrink-0"
      style={{
        height: 48,
        // Near-opaque on purpose: the header is a sticky child of a scroller that
        // already carries backdrop-filter, and Safari does not blur a nested
        // backdrop — pane copy scrolled crisply through the old 0.42 veil.
        background: `linear-gradient(180deg, ${lrMix(LR.ink, 0.96)} 0%, ${lrMix(LR.ink, 0.9)} 100%)`,
        backdropFilter: LR.veil.blur,
        WebkitBackdropFilter: LR.veil.blur,
        borderBottom: `1px solid ${LR.pane.border}`,
        boxShadow: `0 10px 24px -14px ${lrMix(LR.ink, 0.9)}`,
      }}
    >
      <span className="inline-flex items-center gap-2 shrink-0">
        <LrLiveDot tone="down" size={6} />
        <LrEyebrow tone="down" size={9}>LIVE</LrEyebrow>
      </span>

      {/* the title is the ONLY thing allowed to give way — everything else is shrink-0 */}
      <span className="font-sans truncate min-w-0 flex-1" style={{ fontSize: 14, fontWeight: 500, color: LR.paper, letterSpacing: "-0.005em", flexBasis: 0 }}>
        {SESSION_META.name}
      </span>

      <LrChip tone={s.phase === "execute" ? "up" : "primary"} active size={9} className="shrink-0 lr-hide-xs">
        {phase.label}{s.phase === "execute" ? " · live" : ""}
      </LrChip>

      <span className="font-mono tabular-nums shrink-0" style={{ fontSize: 12, color: LR.ashSoft, letterSpacing: "0.02em" }} aria-label="Elapsed">
        {elapsedLabel(s.elapsedSec)}
      </span>

      <span className="lr-hide-xs"><Waveform muted={s.muted} /></span>

      <span className="lr-instruments hidden items-center gap-1.5 shrink-0 ml-2">
        {primary.map((i) => (
          <LrChip key={i.symbol} tone={i.change >= 0 ? "up" : "down"} size={9.5} title={i.note}>
            {i.symbol} <span style={{ opacity: 0.9 }}>{i.change >= 0 ? "+" : ""}{i.change.toFixed(2)}%</span>
          </LrChip>
        ))}
        {secondary.map((i) => (
          <LrChip key={i.symbol} tone="ash" size={9} className="lr-hide-md" title={i.note}>
            {i.symbol} {i.change >= 0 ? "+" : ""}{i.change.toFixed(2)}
          </LrChip>
        ))}
      </span>

      <span className="inline-flex items-center gap-1.5 shrink-0" title="Listening now">
        <Users size={13} style={{ color: LR.ashSoft }} />
        <span className="font-mono tabular-nums" style={{ fontSize: 11, color: LR.paperDim }}>{AUDIENCE.total}</span>
      </span>

      <LrGhostButton label={s.muted ? "Unmute room audio" : "Mute room audio"} active={s.muted} onClick={() => s.dispatch({ type: "toggle", key: "muted" })} size={30}>
        {s.muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
      </LrGhostButton>

      {onToggleTheater && (
        <button
          type="button"
          onClick={onToggleTheater}
          aria-pressed={!!theater}
          title={`${theater ? "Show" : "Hide"} the hub around the room · ⌘\\`}
          className="inline-flex items-center gap-1.5 font-mono uppercase shrink-0 focus:outline-none focus-visible:ring-1"
          style={{
            fontSize: 9, letterSpacing: "0.18em", fontWeight: 600, height: 30, padding: "0 11px",
            borderRadius: LR.pillRadius,
            color: theater ? LR.primary : LR.ash,
            border: `1px solid ${theater ? lrMix(LR.primary, 0.35) : LR.pane.border}`,
            background: theater ? lrMix(LR.primary, 0.08) : "transparent",
            transition: "color 240ms ease, border-color 240ms ease, background 240ms ease",
          }}
        >
          {theater ? <PanelLeftOpen size={12} /> : <PanelLeftClose size={12} />}
          <span className="lr-hide-xs">Theater</span>
        </button>
      )}

      <button
        type="button"
        onClick={onLeave}
        className="lr-hide-xs inline-flex items-center gap-1.5 font-mono uppercase shrink-0 focus:outline-none"
        style={{
          fontSize: 9, letterSpacing: "0.18em", fontWeight: 600, color: LR.ash, height: 30, padding: "0 12px",
          borderRadius: LR.pillRadius, border: `1px solid ${LR.pane.border}`, background: "transparent",
          transition: "color 240ms ease, border-color 240ms ease, background 240ms ease",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = LR.down; e.currentTarget.style.borderColor = lrMix(LR.down, 0.35); e.currentTarget.style.background = lrMix(LR.down, 0.06) }}
        onMouseLeave={(e) => { e.currentTarget.style.color = LR.ash; e.currentTarget.style.borderColor = LR.pane.border; e.currentTarget.style.background = "transparent" }}
      >
        <LogOut size={11} /> Leave
      </button>
    </header>
  )
}
