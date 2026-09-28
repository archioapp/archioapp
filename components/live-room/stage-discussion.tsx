"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Pin, Send, Crown, CornerDownRight, Sparkles, X, Flame, Crosshair, Check, ChevronDown, ChevronUp } from "lucide-react"
import { LR, lrMix, toneColor } from "./live-room-tokens"
import { LrPane, LrPaneHeader, LrRecess, LrEyebrow, LrChip, LrCoin, LrLiveDot, LrGhostButton, useReducedMotion } from "./live-room-primitives"
import { useSession } from "./session-store"
import { useLayout, useLayoutOptional } from "./workspace"
import { ROOMS, EVENT_META, clockLabel, type DiscussionMessage, type ComposerMode, type RoomId } from "./session-state"
import { scrollToEvent } from "./phase-rail"

const MODES: { id: ComposerMode; label: string; placeholder: string }[] = [
  { id: "chat", label: "Chat", placeholder: "Chat with the audience…" },
  { id: "question", label: "@Question", placeholder: "Ask the mentor a question…" },
  { id: "setup", label: "#Setup", placeholder: "Share a setup — symbol, entry, stop, target…" },
]

function Message({ m }: { m: DiscussionMessage }) {
  const s = useSession()
  const reduce = useReducedMotion()
  const [hover, setHover] = React.useState(false)
  const isMentor = m.role === "mentor" || m.kind === "mentor"
  const ref = m.refEventId ? s.events.find((e) => e.id === m.refEventId) : undefined
  const canPin = (isMentor || m.role === "moderator") && !m.ledgered && m.kind !== "system"

  if (m.kind === "system" || m.kind === "join") {
    return (
      <li className="flex items-center gap-3 py-1" aria-label={m.body}>
        <span aria-hidden className="flex-1 h-px" style={{ background: LR.dashed(LR.recess.border) }} />
        <span className="font-mono uppercase text-center text-pretty" style={{ fontSize: 9, letterSpacing: "0.14em", color: LR.ashSoft }}>{m.body}</span>
        <span aria-hidden className="flex-1 h-px" style={{ background: LR.dashed(LR.recess.border) }} />
      </li>
    )
  }

  if (m.kind === "summary") {
    return (
      <motion.li initial={reduce ? false : { opacity: 0, y: 6, filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.4, ease: LR.ease }}>
        <LrRecess tone="primary" thread lit className="p-3 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center" style={{ width: 22, height: 22, borderRadius: 7, background: lrMix(LR.primary, 0.14), color: LR.primary }}><Sparkles size={11} /></span>
            <LrEyebrow tone="primary" size={9}>Oracle summary</LrEyebrow>
            <span className="flex-1" />
            <span className="font-mono tabular-nums" style={{ fontSize: 9, color: LR.ashSoft }}>{clockLabel(m.at)}</span>
          </div>
          <ol className="m-0 p-0 flex flex-col gap-1" style={{ listStyle: "none" }}>
            {m.bullets?.map((b, i) => (
              <li key={i} className="flex gap-2"><span className="font-mono" style={{ fontSize: 9, color: LR.primary, marginTop: 3 }}>{String(i + 1).padStart(2, "0")}</span><span className="font-sans text-pretty" style={{ fontSize: 12.5, lineHeight: 1.5, color: LR.paperDim }}>{b}</span></li>
            ))}
          </ol>
        </LrRecess>
      </motion.li>
    )
  }

  return (
    <motion.li
      initial={m.self && !reduce ? { opacity: 0, y: 6, filter: "blur(6px)" } : false}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.4, ease: LR.ease }}
      className="relative flex gap-2.5 min-w-0 group"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {isMentor && <span aria-hidden className="absolute -left-2 top-1 bottom-1 w-px" style={{ background: `linear-gradient(180deg, transparent, ${lrMix(LR.primary, 0.6)}, transparent)` }} />}
      <LrCoin initials={m.initials} size={24} radius={8} tone={isMentor ? "primary" : m.kind === "question" ? "warn" : "neutral"} ring={isMentor} />
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
          <span className="font-sans" style={{ fontSize: 12, fontWeight: 500, color: m.self ? LR.primary : LR.paper }}>{m.author}</span>
          {isMentor && <Crown size={10} style={{ color: LR.primary }} aria-label="Mentor" />}
          {m.role && m.role !== "member" && !isMentor && <LrChip tone="ash" size={9}>{m.role}</LrChip>}
          {m.kind === "question" && <LrChip tone="warn" size={9}>?</LrChip>}
          {m.kind === "forecast" && <LrChip tone="primary" active size={9} glyph={<Crosshair size={9} />}>forecast</LrChip>}
          {m.instrument && <LrChip tone="ash" size={9}>{m.instrument}</LrChip>}
          <span className="flex-1" />
          <span className="font-mono tabular-nums" style={{ fontSize: 9, color: LR.ashSoft, letterSpacing: "0.08em" }}>{clockLabel(m.at)}</span>
        </div>
        {m.replyTo && (
          <span className="inline-flex items-center gap-1 font-mono" style={{ fontSize: 9, letterSpacing: "0.1em", color: LR.ashSoft }}><CornerDownRight size={10} /> {m.replyTo}</span>
        )}
        {ref && (
          <button type="button" onClick={() => { s.focusEvent(ref.id); scrollToEvent(ref.id) }} className="self-start focus:outline-none">
            <LrChip tone="primary" size={9} glyph={<span aria-hidden style={{ width: 4, height: 4, borderRadius: 999, background: LR.primary }} />}>re: {EVENT_META[ref.type].label} · {clockLabel(ref.at)}</LrChip>
          </button>
        )}
        <p className="font-sans m-0 text-pretty" style={{ fontSize: 12.5, lineHeight: 1.5, color: isMentor ? LR.paper : LR.paperDim }}>{m.body}</p>
        <div className="flex items-center gap-2 min-w-0" style={{ minHeight: 18 }}>
          {typeof m.reactions === "number" && (
            <button type="button" aria-label={`React · ${m.reactions} reactions`} onClick={() => s.dispatch({ type: "react", id: m.id })} className="inline-flex items-center gap-1 font-mono tabular-nums focus:outline-none" style={{ fontSize: 9, letterSpacing: "0.1em", color: LR.ashSoft, padding: "2px 6px", borderRadius: 6, border: `1px solid ${LR.recess.border}` }}>
              <Flame size={9} /> {m.reactions}
            </button>
          )}
          {m.ledgered && <LrChip tone="primary" size={9} glyph={<Check size={9} />}>in the timeline</LrChip>}
          <span className="flex-1" />
          <AnimatePresence>
            {canPin && hover && (
              <motion.button
                key="pin" type="button" onClick={() => s.pinMessage(m.id)}
                initial={{ opacity: 0, x: 4 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 4 }} transition={{ duration: 0.2 }}
                aria-label="Pin to session timeline"
                className="inline-flex items-center gap-1.5 font-mono uppercase focus:outline-none"
                style={{ fontSize: 9, letterSpacing: "0.14em", fontWeight: 600, color: LR.primary, padding: "3px 8px", borderRadius: 6, background: LR.chipFill, border: `1px solid ${LR.chipBorder}` }}
              >
                <Pin size={9} /> Pin to timeline
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.li>
  )
}

export function StageDiscussion({ delay = 0, dock = false, messageInput, setMessageInput, onSendMessage }: {
  delay?: number
  /** fills its panel: the feed takes the remaining height, the composer is pinned */
  dock?: boolean
  messageInput?: string
  setMessageInput?: (v: string) => void
  onSendMessage?: () => void
}) {
  const s = useSession()
  const layoutCtx = useLayoutOptional()
  const layout = dock ? layoutCtx : null
  const [local, setLocal] = React.useState("")
  const value = messageInput ?? local
  const setValue = setMessageInput ?? setLocal
  const listRef = React.useRef<HTMLOListElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const inRoom = s.messages.filter((m) => m.room === s.room)
  const pinned = inRoom.find((m) => m.pinned)
  const feed = inRoom.filter((m) => !m.pinned)
  const counts = Object.fromEntries(ROOMS.map((r) => [r.id, s.messages.filter((m) => m.room === r.id).length])) as Record<RoomId, number>
  const mode = MODES.find((m) => m.id === s.composerMode)!
  const focused = s.focusedEvent ? s.events.find((e) => e.id === s.focusedEvent) : undefined

  // keep the newest message in view
  React.useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" })
  }, [feed.length, s.room])

  const submit = () => {
    if (!value.trim()) return
    s.sendMessage(value)
    onSendMessage?.()
    setValue("")
  }

  return (
    <LrPane
      labelledBy="lr-discussion-title"
      delay={delay}
      corners={false}
      className={`flex flex-col min-h-0 ${dock ? "lr-talk-dock" : ""}`}
      fill={dock}
    >
      <LrPaneHeader
        id="lr-discussion-title"
        eyebrow="Discussion"
        count={s.messages.length}
        hint={`${counts[s.room]} in room`}
        trailing={layout ? (
          <LrGhostButton label="Fold the discussion" onClick={() => layout.setTalkCollapsed(true)} size={24}>
            <ChevronDown size={12} />
          </LrGhostButton>
        ) : undefined}
      />

      {/* rooms */}
      <div role="tablist" aria-label="Discussion rooms" className="flex items-end gap-1 px-4 overflow-x-auto lr-scroll-x shrink-0" style={{ borderBottom: `1px solid ${LR.recess.border}` }}>
        {ROOMS.map((r) => {
          const on = r.id === s.room
          return (
            <button
              key={r.id} role="tab" aria-selected={on} type="button" onClick={() => s.dispatch({ type: "room", room: r.id })}
              className="relative inline-flex items-center gap-1.5 font-sans whitespace-nowrap focus:outline-none shrink-0"
              style={{ fontSize: 12, fontWeight: 500, color: on ? LR.paper : LR.ashSoft, padding: "8px 10px 10px", transition: "color 240ms ease" }}
            >
              {r.live && <LrLiveDot tone={on ? "down" : "neutral"} size={5} />}
              {r.label}
              <span className="font-mono tabular-nums" style={{ fontSize: 9, color: on ? LR.primary : LR.ashGhost, letterSpacing: "0.1em" }}>{counts[r.id]}</span>
              {on && <motion.span layoutId="lr-room-underline" aria-hidden className="absolute left-2 right-2 bottom-0" style={{ height: 1.5, background: LR.primary, borderRadius: 2 }} transition={LR.spring} />}
            </button>
          )
        })}
      </div>

      {/* feed */}
      <ol ref={listRef} className={`lr-feed m-0 flex flex-col gap-3 px-4 pl-6 py-3 overflow-y-auto ${dock ? "flex-1 min-h-0" : ""}`} style={dock ? { listStyle: "none" } : { listStyle: "none", maxHeight: 440, minHeight: 200 }} aria-live="polite">
        <AnimatePresence initial={false}>
          {pinned && (
            <motion.li key={`pin-${pinned.id}`} initial={false}>
              <LrRecess tone="primary" thread lit className="p-3 flex flex-col gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Pin size={10} style={{ color: LR.primary }} />
                  <LrEyebrow tone="primary" size={9}>Pinned insight</LrEyebrow>
                  <span className="flex-1" />
                  <span className="font-mono tabular-nums" style={{ fontSize: 9, color: LR.ashSoft }}>{clockLabel(pinned.at)}</span>
                </div>
                <div className="flex items-center gap-2 min-w-0 flex-wrap">
                  <LrCoin initials={pinned.initials} size={22} radius={7} ring />
                  <span className="font-sans" style={{ fontSize: 12, fontWeight: 500, color: LR.paper }}>{pinned.author}</span>
                  <LrChip tone="primary" active size={9}>mentor</LrChip>
                  {pinned.instrument && <LrChip tone="ash" size={9}>{pinned.instrument}</LrChip>}
                </div>
                <p className="font-sans m-0 text-pretty" style={{ fontSize: 13, lineHeight: 1.5, color: LR.paper }}>{pinned.body}</p>
              </LrRecess>
            </motion.li>
          )}
        </AnimatePresence>
        {feed.map((m) => <Message key={m.id} m={m} />)}
      </ol>

      {/* composer */}
      <div className={`lr-composer flex flex-col gap-2 px-4 pt-2 ${dock ? "pb-3 shrink-0" : "pb-4"}`} style={{ borderTop: `1px solid ${LR.recess.border}` }}>
        <div className="flex items-center gap-1.5 overflow-x-auto lr-scroll-x">
          {MODES.map((m) => (
            <LrChip key={m.id} tone={m.id === "question" ? "warn" : "primary"} active={s.composerMode === m.id} dim={s.composerMode !== m.id} size={9} onClick={() => { s.dispatch({ type: "composerMode", mode: m.id }); inputRef.current?.focus() }} ariaPressed={s.composerMode === m.id}>
              {m.label}
            </LrChip>
          ))}
          <AnimatePresence>
            {focused && (
              <motion.span key="ref" initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }} transition={{ duration: 0.22 }} className="inline-flex items-center gap-1">
                <LrChip tone="primary" active size={9}>re: {EVENT_META[focused.type].label} · {clockLabel(focused.at)}</LrChip>
                <button type="button" aria-label="Clear event reference" onClick={() => s.focusEvent(null)} className="inline-flex items-center justify-center focus:outline-none" style={{ width: 18, height: 18, color: LR.ashSoft }}><X size={10} /></button>
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); submit() }}
          className="flex items-center gap-2 pl-4 pr-1.5"
          style={{ height: 44, borderRadius: LR.pillRadius, background: LR.pane.bg, border: `1px solid ${LR.pane.border}`, backdropFilter: LR.pane.blur, WebkitBackdropFilter: LR.pane.blur, transition: "border-color 240ms ease, box-shadow 240ms ease" }}
          onFocusCapture={(e) => { e.currentTarget.style.borderColor = lrMix(LR.primary, 0.4); e.currentTarget.style.boxShadow = `0 0 0 3px ${lrMix(LR.primary, 0.08)}` }}
          onBlurCapture={(e) => { e.currentTarget.style.borderColor = LR.pane.border; e.currentTarget.style.boxShadow = "none" }}
        >
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing && e.keyCode !== 229) { e.preventDefault(); submit() } }}
            placeholder={mode.placeholder}
            aria-label={mode.placeholder}
            className="flex-1 min-w-0 bg-transparent font-sans focus:outline-none placeholder:opacity-60"
            style={{ fontSize: 13, color: LR.paper }}
          />
          <motion.button type="submit" aria-label="Send" whileTap={{ scale: 0.92 }} disabled={!value.trim()} className="inline-flex items-center justify-center shrink-0 focus:outline-none" style={{ width: 32, height: 32, borderRadius: 999, background: value.trim() ? LR.primary : lrMix(LR.primary, 0.12), color: value.trim() ? LR.primaryInk : LR.ashSoft, boxShadow: value.trim() ? LR.glow : "none", transition: "background 240ms ease, color 240ms ease, box-shadow 400ms ease" }}>
            <Send size={13} />
          </motion.button>
        </form>
      </div>
    </LrPane>
  )
}

/* ────────────────────────────────────────────────────────────────────────
 *  TalkHandle — the 44px bar that stands in for the folded dock.
 *  Last message · unread coin (pulses once per new message) · expand.
 * ──────────────────────────────────────────────────────────────────────── */
export function TalkHandle() {
  const s = useSession()
  const { setTalkCollapsed } = useLayout()
  const reduce = useReducedMotion()
  const seenRef = React.useRef(s.messages.length)
  const unread = Math.max(0, s.messages.length - seenRef.current)
  const last = [...s.messages].reverse().find((m) => m.kind !== "system" && m.kind !== "join")

  return (
    <button
      type="button"
      onClick={() => setTalkCollapsed(false)}
      aria-label={`Open the discussion${unread ? ` · ${unread} new` : ""}`}
      className="lr-talk-handle flex items-center gap-3 w-full min-w-0 px-4 focus:outline-none focus-visible:ring-1"
      style={{ height: 44, background: LR.pane.bg, borderTop: `1px solid ${LR.pane.border}`, backdropFilter: LR.pane.blur, WebkitBackdropFilter: LR.pane.blur, color: "inherit", cursor: "pointer", textAlign: "left" }}
    >
      <LrEyebrow tone="primary" size={9}>Discussion</LrEyebrow>
      <span aria-hidden className="h-px w-3 shrink-0" style={{ background: LR.dashed() }} />
      {last ? (
        <span className="flex-1 min-w-0 inline-flex items-center gap-2">
          <LrCoin initials={last.initials} size={18} radius={6} tone={last.role === "mentor" ? "primary" : "neutral"} />
          <span className="font-sans truncate" style={{ fontSize: 12, color: LR.paperDim }}>
            <span style={{ color: LR.paper, fontWeight: 500 }}>{last.author}</span>{"  "}{last.body}
          </span>
        </span>
      ) : <span className="flex-1" />}
      <AnimatePresence>
        {unread > 0 && (
          <motion.span
            key={unread}
            className="font-mono tabular-nums inline-flex items-center justify-center shrink-0"
            style={{ minWidth: 18, height: 18, padding: "0 5px", borderRadius: 999, fontSize: 9, fontWeight: 600, color: LR.primaryInk, background: LR.primary, boxShadow: LR.glow }}
            initial={reduce ? false : { scale: 0.6, opacity: 0 }} animate={{ scale: [1.18, 1], opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }} transition={{ duration: 0.28, ease: LR.ease }}
            aria-hidden
          >
            {unread}
          </motion.span>
        )}
      </AnimatePresence>
      <ChevronUp size={13} style={{ color: LR.ashSoft }} aria-hidden />
    </button>
  )
}

export { toneColor }
