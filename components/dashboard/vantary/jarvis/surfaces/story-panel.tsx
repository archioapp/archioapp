"use client"

/* ════════════════════════════════════════════════════════════════════════
 *  JARVIS · SURFACE 4 · STORY PANEL
 *  ─────────────────────────────────────────────────────────────────────
 *  The chassis that replaces the three stacked below-fold modules
 *  (RotatingRulesTicker + LiveStatsGrid + SessionContextStrip) with ONE
 *  editorial rectangle that rotates through their content as a single
 *  rotating "story" surface.
 *
 *  Why a chassis: the doctrine says one protagonist per zone (Law #4).
 *  Three full-width sections stacked vertically = three competing
 *  protagonists fighting for the trader's last attention slot of the
 *  card. The story panel demotes them into a SINGLE protagonist — one
 *  story at a time, with rotation between them — so the eye never has
 *  to choose between three things. The trader sees one story, then
 *  another, then another, in a 9-second rhythm.
 *
 *  ARCHITECTURE
 *    The chassis owns:
 *      · the editorial header (eyebrow title + dot indicator + status)
 *      · the rotation engine (idle 9000ms, paused on hover, locked on
 *        click of a dot)
 *      · the silk crossfade between stories
 *      · the width-aware tier collapse (eyebrow shrinks below 320px,
 *        dot indicator collapses to a count line below 220px)
 *
 *    The chassis does NOT own:
 *      · the story content itself (the host passes a `stories` array
 *        with `render: () => ReactNode` for each story)
 *      · which stories are visible (the customize panel writes to the
 *        `stories` prop, this surface just renders what it's given)
 *      · the data the stories show (each story is a black box to the
 *        chassis — it just gets a render-fn and a stable id)
 *
 *  SLOT CONTRACT
 *    Each story is a single object:
 *      {
 *        id:     "rules"          — stable id for customize layer
 *        title:  "DISCIPLINE"     — eyebrow label
 *        render: () => <RulesStory checkin={...} />
 *      }
 *    The host typically defines the story registry once and the
 *    customize panel re-orders / hides items by writing the rotation
 *    list back to the host's state.
 *
 *  MOTION
 *    Crossfade between stories uses JARVIS_MOTION.silk (520ms) — slower
 *    than the pulse-strip's awaken (220ms) because the story panel is
 *    a deeper, denser surface. The trader needs the tempo to feel
 *    contemplative, not snappy. ──────────────────────────────────── */

import * as React from "react"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

import {
  JARVIS_TONE,
  JARVIS_RULE,
  JARVIS_RHYTHM,
  JARVIS_MOTION,
  JARVIS_CADENCE,
  Tx,
} from "../index"

/* ─────────────────────────────────────────────────────────────────────────
 *  PUBLIC TYPES
 *  ───────────────────────────────────────────────────────────────────── */

export interface StoryEntry {
  /** Stable id (e.g. "rules", "capital", "session", "dna"). */
  id:     string
  /** Optional eyebrow label rendered in the chassis header
   *  (e.g. "DISCIPLINE"). When EVERY entry's title is omitted, the
   *  chassis suppresses its own header entirely and renders the
   *  rotation dots as a floating top-right overlay — the inner story
   *  body keeps whatever eyebrow it shipped with, so retrofitted
   *  modules don't double up on labels. */
  title?: string
  /** Render-fn returning the story body. The chassis wraps the body
   *  in an AnimatePresence motion.div for the crossfade — the body
   *  itself just returns its inner DOM. */
  render: () => React.ReactNode
}

export interface StoryPanelProps {
  /** Rotation list. Order = visual order. First item is the initial
   *  active story. Length 1 = static (no rotation, no dots). */
  stories:   StoryEntry[]
  /** Override rotation cadence. Defaults to JARVIS_CADENCE.story
   *  (9000ms). Pass 0 to disable rotation entirely. */
  rotateMs?: number
  /** Optional className passthrough. */
  className?: string
}

/* ─────────────────────────────────────────────────────────────────────────
 *  WIDTH TIER
 *  ───────────────────────────────────────────────────────────────────── */

type WidthTier = "full" | "narrow" | "minimum"

function tierFromWidth(w: number): WidthTier {
  if (w >= 320) return "full"
  if (w >= 220) return "narrow"
  return "minimum"
}

function useElementWidth<T extends HTMLElement>(): [React.RefObject<T | null>, number] {
  const ref = useRef<T | null>(null)
  const [w, setW] = useState(0)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el || typeof ResizeObserver === "undefined") return
    setW(el.getBoundingClientRect().width)
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) setW(e.contentRect.width)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, w]
}

/* ─────────────────────────────────────────────────────────────────────────
 *  THE PANEL
 *  ───────────────────────────────────────────────────────────────────── */

export function StoryPanel({
  stories, rotateMs = JARVIS_CADENCE.story, className,
}: StoryPanelProps) {
  const [ref, width] = useElementWidth<HTMLDivElement>()
  const tier         = tierFromWidth(width)

  const [activeIdx,  setActiveIdx]  = useState(0)
  const [hoverPause, setHoverPause] = useState(false)
  const [pinned,     setPinned]     = useState(false)

  /* Clamp activeIdx whenever the rotation list shrinks. */
  useEffect(() => {
    if (activeIdx >= stories.length) setActiveIdx(0)
  }, [stories.length, activeIdx])

  /* Rotation engine — same model as the pulse strip but on a slower
   * cadence (story panel = 9s vs strip = 7s). The 2s offset keeps the
   * two rotations visually de-synchronized so the trader's eye doesn't
   * see two surfaces flip in lockstep. */
  useEffect(() => {
    if (stories.length <= 1) return
    if (rotateMs <= 0)        return
    if (hoverPause || pinned) return

    const id = window.setInterval(() => {
      setActiveIdx((i) => (i + 1) % stories.length)
    }, rotateMs)
    return () => window.clearInterval(id)
  }, [stories.length, rotateMs, hoverPause, pinned])

  if (stories.length === 0) {
    return <div ref={ref} aria-hidden style={{ width: "100%" }} />
  }

  const active = stories[activeIdx]

  /* When EVERY story omits its title we collapse the chassis header
   * entirely — inner stories that ship with their own eyebrow keep
   * their voice, the chassis becomes a pure rotating frame, and the
   * dot indicator floats absolutely at the top-right corner. */
  const headerless = stories.every((s) => !s.title)

  return (
    <section
      ref={ref}
      aria-label="Story panel"
      className={className}
      onMouseEnter={() => setHoverPause(true)}
      onMouseLeave={() => setHoverPause(false)}
      style={{
        display:       "flex",
        flexDirection: "column",
        minWidth:      0,
        position:      "relative",
      }}
    >
      {/* ── Chassis header ────────────────────────────────────────────
       *  Eyebrow title on the left, dot indicator + status on the right.
       *  At narrow tier the dot indicator collapses to a "1 / 3" count
       *  string so the eyebrow keeps room. Suppressed entirely when
       *  `headerless` (see comment above). */}
      {!headerless && (
      <header
        style={{
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
          gap:            JARVIS_RHYTHM.bay,
          paddingBottom:  JARVIS_RHYTHM.bay,
          borderBottom:   `1px solid ${JARVIS_RULE.idle.color}`,
        }}
      >
        <Tx size="eyebrow" tone="amber">
          {active.title}
        </Tx>

        {tier !== "minimum" && stories.length > 1 && (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {tier === "full" ? (
              stories.map((s, i) => {
                const isActive = i === activeIdx
                return (
                  <button
                    key={s.id}
                    type="button"
                    aria-label={`Story ${i + 1}: ${s.title}`}
                    aria-selected={isActive}
                    onClick={() => {
                      if (isActive && pinned) setPinned(false)
                      else { setActiveIdx(i); setPinned(true) }
                    }}
                    style={{
                      width:      14,
                      height:     14,
                      padding:    0,
                      background: "transparent",
                      border:     "none",
                      cursor:     "pointer",
                      display:    "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      aria-hidden
                      style={{
                        width:        isActive ? 4 : 3,
                        height:       isActive ? 4 : 3,
                        borderRadius: "50%",
                        background:   isActive
                                        ? (pinned ? JARVIS_TONE.amber : JARVIS_TONE.protag)
                                        : JARVIS_TONE.quiet,
                        opacity:      isActive ? 0.9 : 0.5,
                        transition:   `background ${JARVIS_MOTION.awaken.duration}ms ease`,
                      }}
                    />
                  </button>
                )
              })
            ) : (
              <Tx size="eyebrow" tone="quiet">
                {`${activeIdx + 1} / ${stories.length}`}
              </Tx>
            )}

            {(pinned || hoverPause) && (
              <Tx size="eyebrow" tone={pinned ? "amber" : "quietest"}>
                {pinned ? "PINNED" : "PAUSED"}
              </Tx>
            )}
          </div>
        )}
      </header>
      )}

      {/* ── Floating dot indicator (headerless mode) ──────────────────
       *  When the chassis runs without a header, the rotation dots
       *  float at the top-right corner so the trader can still see
       *  which story they're on. Same dot vocabulary as the headered
       *  variant — small, calm, non-blocking. */}
      {headerless && stories.length > 1 && tier !== "minimum" && (
        <div
          style={{
            position: "absolute",
            top:      0,
            right:    0,
            display:  "flex",
            alignItems: "center",
            gap:      6,
            zIndex:   1,
          }}
        >
          {stories.map((s, i) => {
            const isActive = i === activeIdx
            return (
              <button
                key={s.id}
                type="button"
                aria-label={`Story ${i + 1} of ${stories.length}`}
                aria-selected={isActive}
                onClick={() => {
                  if (isActive && pinned) setPinned(false)
                  else { setActiveIdx(i); setPinned(true) }
                }}
                style={{
                  width: 14, height: 14, padding: 0,
                  background: "transparent", border: "none",
                  cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <span
                  aria-hidden
                  style={{
                    width:        isActive ? 4 : 3,
                    height:       isActive ? 4 : 3,
                    borderRadius: "50%",
                    background:   isActive
                                    ? (pinned ? JARVIS_TONE.amber : JARVIS_TONE.protag)
                                    : JARVIS_TONE.quiet,
                    opacity:      isActive ? 0.9 : 0.45,
                    transition:   `background ${JARVIS_MOTION.awaken.duration}ms ease, opacity ${JARVIS_MOTION.awaken.duration}ms ease`,
                  }}
                />
              </button>
            )
          })}
        </div>
      )}

      {/* ── Story body ────────────────────────────────────────────────
       *  AnimatePresence crossfade between stories. The body uses a
       *  motion.div with `key={active.id}` so the exit / enter pair
       *  fires every time activeIdx changes. */}
      <div
        style={{
          paddingTop: headerless ? 0 : JARVIS_RHYTHM.band,
          minHeight:  0,
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y:  4 }}
            animate={{ opacity: 1, y:  0 }}
            exit={{    opacity: 0, y: -4 }}
            transition={{
              duration: JARVIS_MOTION.silk.duration / 1000,
              ease:     JARVIS_MOTION.silk.easeArray,
            }}
            style={{ minWidth: 0 }}
          >
            {active.render()}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
