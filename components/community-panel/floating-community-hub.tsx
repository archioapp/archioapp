"use client"
import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  Radio,
  Copy,
  Plus,
  Hash,
  ChevronDown,
  Send,
  Settings,
  Pin,
  BarChart3,
  Lock as _UnusedLock,
  Timer,
  Zap,
  Play,
  Users,

  TrendingUp,
  TrendingDown,
  Shield,
  Crown,
  Activity,
  FileText,
  Calendar,
  Bell,
  Target,
  Trophy,
  History,
  Sparkles,
  AlertTriangle,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DailyGameplan } from "./daily-gameplan"
import { EntryRoom } from "./entry-room"
import { Leaderboard } from "./leaderboard"
import { NotificationCenter } from "./notification-center"
import { MemberProfile } from "./member-profile"
import { LiveRoom } from "@/components/live-room/live-room"
import { useLayoutMemory } from "@/components/live-room/workspace"
import { LiveCallHistory } from "./live-call-history"
import { LiveCallsDashboard } from "./live-calls-dashboard"
import {
  CS,
  CSEyebrow,
  CSSigil,
  CSTierGlyph,
  CSLivePulse,
  CSNameplate,
  CSCorners,
  CSActionButton,
  CSMagnitude,
  type CSTier,
} from "./community-primitives"
/* ─── Canonical Archio language bridge ─────────────────────────────────────
 *  Plugs the Community Swipe into the SAME visual dialect already shipping
 *  in <ActiveWindow/>: ArchioSeam (irrational shimmer hairlines), the
 *  ArchioPulseDot concentric sonar, the AW_* token system, the Nameplate
 *  hairline assembly, premium amber eyebrows. The CS.* primitives stay
 *  available for the surfaces that haven't been migrated yet — every
 *  newly redone phase reaches for these `AW`/`Cmty*`/`Archio*` symbols
 *  instead of inventing parallel motion timings or letter-spacing values.
 * ──────────────────────────────────────────────────────────────────────── */
import {
  AW,
  ArchioSeam,
  ArchioPulseDot,
  CmtyNameplate,
  CmtyEyebrow,
  CmtyMagnitude,
} from "./community-archio-bridge"
import { FdLiveTick } from "@/components/dashboard/vantary/flight-deck/flight-deck-primitives"
import {
  COMMUNITY_TOGGLE_EVENT,
  COMMUNITY_INDICATORS_EVENT,
  type CommunityIndicators,
} from "./header-community-trigger"

type ServerId = "whale-room" | "crypto-elite" | "gold-masters" | "ny-traders" | "mentor-hub"
type ActiveView = "live-stage" | "forecast-feed" | "war-room" | "daily-gameplan" | "entry-room" | "leaderboard" | "call-history" | "dashboard"

interface Server {
  id: ServerId
  name: string
  initials: string
  /** Retained for legacy gradient consumers (Column 2 plate, trigger). Phase 2+ rail no longer reads this. */
  color: string
  isLive?: boolean
  memberCount: number
  /** Phase 2 — premium hierarchy. Replaces rainbow gradient signalling. */
  tier?: "mentor" | "premium" | "public" | "war" | "prop"
  /** Phase 2 — verified mentor-led desk (shows mono check accent). */
  verified?: boolean
  /** Phase 2 — short descriptor surfaced in hover reveal. */
  tagline?: string
}

interface Signal {
  id: string
  asset: string
  bias: "LONG" | "SHORT"
  entry: string
  stop: string
  target: string
  rr: string
  mentor: string
  mentorAvatar: string
  time: string
  verified?: boolean
  rating?: number
}

interface WarRoom {
  id: string
  name: string
  ticker: string
  expiresIn: string
  status: "active" | "expiring"
  members: number
}

interface ChatMessage {
  id: string
  userName: string
  userAvatar: string
  userColor: string
  message: string
  timestamp: string
  isCurrentUser?: boolean
}

const SERVERS: Server[] = [
  {
    id: "whale-room",
    name: "Whale Room",
    initials: "WR",
    color: "from-emerald-500 to-cyan-500",
    isLive: true,
    memberCount: 2403,
    tier: "premium",
    verified: true,
    tagline: "Institutional flow",
  },
  {
    id: "crypto-elite",
    name: "Crypto Elite",
    initials: "CE",
    color: "from-purple-500 to-pink-500",
    isLive: true,
    memberCount: 847,
    tier: "premium",
    tagline: "Crypto desk",
  },
  {
    id: "gold-masters",
    name: "Gold Masters",
    initials: "GM",
    color: "from-amber-500 to-orange-500",
    memberCount: 512,
    tier: "public",
    tagline: "Precious metals",
  },
  {
    id: "ny-traders",
    name: "NY Session",
    initials: "NY",
    color: "from-sky-500 to-blue-500",
    memberCount: 234,
    tier: "public",
    tagline: "Session scalping",
  },
  {
    id: "mentor-hub",
    name: "Mentor Hub",
    initials: "MH",
    color: "from-rose-500 to-red-500",
    isLive: true,
    memberCount: 89,
    tier: "mentor",
    verified: true,
    tagline: "Direct mentor access",
  },
]

const SIGNALS: Signal[] = [
  {
    id: "sig-1",
    asset: "XAU/USD",
    bias: "LONG",
    entry: "2034.50",
    stop: "2030.00",
    target: "2045.00",
    rr: "2.6",
    mentor: "Chen",
    mentorAvatar: "C",
    time: "2m ago",
    verified: true,
    rating: 94,
  },
  {
    id: "sig-2",
    asset: "EUR/USD",
    bias: "SHORT",
    entry: "1.0850",
    stop: "1.0880",
    target: "1.0800",
    rr: "1.7",
    mentor: "Alex",
    mentorAvatar: "A",
    time: "8m ago",
    verified: true,
    rating: 87,
  },
  {
    id: "sig-3",
    asset: "NAS100",
    bias: "LONG",
    entry: "18420",
    stop: "18350",
    target: "18580",
    rr: "2.3",
    mentor: "Sophia",
    mentorAvatar: "S",
    time: "15m ago",
    rating: 79,
  },
  {
    id: "sig-4",
    asset: "BTC/USD",
    bias: "SHORT",
    entry: "67850",
    stop: "68500",
    target: "66200",
    rr: "2.5",
    mentor: "Marcus",
    mentorAvatar: "M",
    time: "22m ago",
    verified: true,
    rating: 91,
  },
]

const WAR_ROOMS: WarRoom[] = [
  { id: "wr-1", name: "short-btc-scalp", ticker: "BTC", expiresIn: "2h", status: "active", members: 34 },
  { id: "wr-2", name: "nvda-earnings-play", ticker: "NVDA", expiresIn: "40m", status: "expiring", members: 67 },
]



const WAR_ROOM_CHAT: ChatMessage[] = [
  {
    id: "wc-1",
    userName: "Alex",
    userAvatar: "A",
    userColor: "from-emerald-500 to-teal-500",
    message: "Entry hit, scaling in now",
    timestamp: "2:41 PM",
  },
  {
    id: "wc-2",
    userName: "Emma",
    userAvatar: "E",
    userColor: "from-purple-500 to-pink-500",
    message: "Stop at 68.5k, watching for sweep",
    timestamp: "2:42 PM",
  },
  {
    id: "wc-3",
    userName: "You",
    userAvatar: "Y",
    userColor: "from-indigo-500 to-violet-500",
    message: "Target 1 almost hit",
    timestamp: "2:43 PM",
    isCurrentUser: true,
  },
]

/* ═════════════════════════════════════════════════════�������������══════════════════
 *  CommunityIdentityRail — Column 1 of the Community Swipe.
 *
 *  Replaces the previous Discord-style gradient bubble grid. Each
 *  community renders as a slim, monochrome glass slab:
 *
 *    ┌─┐
 *    │·│  ← layoutId="cs-rail-accent" bar (only on active row)
 *    │ │
 *    │WR│ ← mono CSSigil, accent wash when active
 *    │  │
 *    │◆ │ ← geometric CSTierGlyph (mentor/premium/public)
 *    └─┘
 *
 *  Live state is signalled with a single CSLivePulse dot, NOT a red badge.
 *  Hovering a row slides a custom glass nameplate out to the right with
 *  name, tier label, verified mark, members and tagline — replacing the
 *  Radix tooltip with bespoke motion so the surface feels custom.
 *
 *  Interaction contract (preserved):
 *    • Click → onServerChange(id) — same handler the old rail used.
 *    • activeServer is the source of truth; layoutId animates the bar.
 *  ────────────────────────────────────────────────────────────────────── */

function CommunityIdentityRail({
  servers,
  activeServer,
  onServerChange,
  getActiveCount,
}: {
  servers: Server[]
  activeServer: ServerId
  onServerChange: (id: ServerId) => void
  getActiveCount: (id: ServerId) => number
}) {
  const [hoveredId, setHoveredId] = useState<ServerId | null>(null)

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.34, delay: 0.06, ease: [0.22, 0.68, 0.36, 1] }}
      className="w-[78px] flex flex-col items-center relative shrink-0"
      style={{
        /* Translucent Flight-Deck glass — the dashboard reads through it,
           instead of the old opaque near-black slab. */
        background: `linear-gradient(180deg, ${AW.glassStrong} 0%, ${AW.glassDeep} 100%)`,
        backdropFilter: "blur(20px) saturate(150%)",
        WebkitBackdropFilter: "blur(20px) saturate(150%)",
      }}
    >
      {/* ───── Rail surface texture: a slow "desk-lamp" accent glow that
            breathes from the top of the column (replaces the flat white
            radial), plus a soft accent-tinted right-edge seam that pinches
            to transparent at top & bottom — the same hairline language the
            cockpit uses, never a hard white line. ───── */}
      <motion.div
        aria-hidden
        className="absolute inset-x-0 top-0 h-28 pointer-events-none"
        style={{
          background: `radial-gradient(130% 80% at 50% 0%, ${AW.amberWash} 0%, transparent 72%)`,
        }}
        animate={{ opacity: [0.5, 0.92, 0.5] }}
        transition={{ duration: 7.3, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-px pointer-events-none"
        style={{
          background: `linear-gradient(180deg, transparent 0%, ${AW.ruleSoft} 16%, ${AW.rule} 50%, ${AW.ruleSoft} 84%, transparent 100%)`,
        }}
      />

      {/* ───── Rail eyebrow — gives the rail a name ─────
            Premium amber eyebrow at AW.letterEyebrowPremium, identical
            tracking to the dossier section labels (FOCUS NOW / WHY EXPECT). */}
      <div className="w-full flex justify-center pt-3 pb-2">
        <CmtyEyebrow tone="ashSoft" size={8.5} letter={AW.letterEyebrowPremium}>
          DESKS
        </CmtyEyebrow>
      </div>

      {/* ───── ArchioSeam separator — replaces the old gradient hairline ─────
            Same component used by active-window-dossier.tsx to close the
            FOCUS NOW chapter. shimmer=false here (rail is ambient, not live). */}
      <div className="w-7 h-px relative">
        <ArchioSeam accent={AW.amber} shimmer={false} />
      </div>

      {/* ───── Identity slabs · FD footer-pillar recipe ─────
            Each desk now reads as a FlightDeck footer pillar: transparent
            surface (no glass fill, no border), tier glyph at the top, mono
            initials in the middle, mono-caps tier label at the bottom.  A
            single bullet dot (•) travels via layoutId="cs-rail-accent" to
            mark the active desk — replacing the heavy 2px amber bar that
            previously dominated the rail.  Hairline dividers separate
            pillars vertically, mirroring the FD footer's column rules. */}
      <div className="flex flex-col items-stretch w-full pt-2 pb-2">
        {servers.map((server, idx) => {
          const isActive = activeServer === server.id
          const isHovered = hoveredId === server.id
          const tier = (server.tier ?? "public") as CSTier

          return (
            <motion.div
              key={server.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.26,
                delay: 0.08 + idx * 0.04,
                ease: [0.22, 0.68, 0.36, 1],
              }}
              className="relative w-full flex justify-center"
              onMouseEnter={() => setHoveredId(server.id)}
              onMouseLeave={() => setHoveredId((curr) => (curr === server.id ? null : curr))}
            >
              {/* ─── Hairline divider between pillars (skip first row) ─── */}
              {idx > 0 && (
                <span
                  aria-hidden
                  className="absolute left-2 right-2 top-0 h-px pointer-events-none"
                  style={{ background: AW.rule, opacity: 0.55 }}
                />
              )}
              <button
                type="button"
                onClick={() => onServerChange(server.id)}
                aria-label={`Switch to ${server.name}`}
                aria-current={isActive ? "true" : undefined}
                className="relative flex flex-col items-center justify-center group focus:outline-none w-full"
                style={{
                  paddingTop: 12,
                  paddingBottom: 12,
                  borderRadius: 0,
                  /* The tile itself now carries the hover/active treatment, so
                     the row stays transparent — no flat white wash. */
                  background: "transparent",
                  border: "0",
                  transition: "background 220ms ease",
                }}
              >
                {/* ─── Active desk wash — a soft accent column that travels
                      with the lit desk (layoutId), giving the active pillar a
                      lamp-lit body behind the dot. Painted FIRST so the glyph,
                      sigil and label stay crisp on top. ─── */}
                {isActive && (
                  <motion.span
                    layoutId="cs-rail-glow"
                    aria-hidden
                    className="absolute pointer-events-none"
                    style={{
                      left: 4,
                      right: 4,
                      top: 3,
                      bottom: 3,
                      borderRadius: 11,
                      background: `linear-gradient(90deg, ${AW.amberWash} 0%, transparent 72%)`,
                    }}
                    transition={{ type: "spring", stiffness: 420, damping: 38 }}
                  />
                )}

                {/* ─── Active bullet dot (travels via layoutId) ───
                      Replaces the previous 2px amber bar.  Same FD recipe
                      used by the cockpit footer pillars to mark the
                      currently-lit destination. */}
                {isActive && (
                  <motion.span
                    layoutId="cs-rail-accent"
                    aria-hidden
                    className="absolute"
                    initial={{ height: 8 }}
                    animate={{ height: 26 }}
                    style={{
                      left: 0,
                      top: "50%",
                      width: 3,
                      marginTop: -13,
                      borderRadius: "0 3px 3px 0",
                      background: AW.amber,
                      boxShadow: `0 0 8px ${AW.amberHalo}, 0 0 1px ${AW.amber}`,
                    }}
                    transition={{ type: "spring", stiffness: 480, damping: 36 }}
                  />
                )}

                {/* ─── Discord-style server tile ───
                      A single big logo plate that fills the rail cap — the
                      slot where a real desk logo image will live. No glyph
                      above, no label below. The tile morphs its corner radius
                      on active/hover (squircle → rounded-rect, Discord's
                      "pill snap"), lifts onto the theme-accent wash when lit,
                      and carries the live pulse in the corner. */}
                <motion.div
                  className="relative flex items-center justify-center font-mono tabular-nums select-none"
                  animate={{
                    borderRadius: isActive ? 16 : isHovered ? 18 : 24,
                    scale: isActive ? 1 : isHovered ? 1.04 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 460, damping: 30 }}
                  style={{
                    width: 46,
                    height: 46,
                    overflow: "hidden",
                    background: isActive
                      ? AW.amberWash
                      : isHovered
                      ? AW.ruleStrong
                      : AW.glassDeep,
                    border: `1px solid ${isActive ? AW.amberHalo : isHovered ? AW.ruleStrong : AW.rule}`,
                    color: isActive ? AW.amber : isHovered ? AW.paper : AW.paperDim,
                    fontSize: 16,
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    boxShadow: isActive
                      ? `0 0 0 1px ${AW.amberHalo}, 0 8px 22px rgba(0,0,0,0.40), inset 0 1px 0 ${AW.ruleSoft}`
                      : `inset 0 1px 0 ${AW.ruleSoft}`,
                    transition: "background 220ms ease, color 220ms ease, border-color 220ms ease, box-shadow 260ms ease",
                  }}
                >
                  {/* Top sheen — the glassy highlight every cockpit plate carries */}
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-1/2 pointer-events-none"
                    style={{
                      background: `linear-gradient(180deg, ${AW.ruleSoft} 0%, transparent 100%)`,
                      opacity: isActive ? 0.9 : 0.5,
                    }}
                  />
                  <span className="relative leading-none">{server.initials}</span>

                  {/* Live pulse, tucked into the tile's corner */}
                  {server.isLive && (
                    <span className="absolute top-1 right-1">
                      <ArchioPulseDot accent={AW.liveRed} size={5} reduced={false} />
                    </span>
                  )}
                </motion.div>
              </button>

              {/* ─── Hover-reveal nameplate (custom glass plate, slides out) ─── */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    key={`reveal-${server.id}`}
                    initial={{ opacity: 0, x: -6, scale: 0.985 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -4, scale: 0.99 }}
                    transition={{ duration: 0.22, ease: [0.22, 0.68, 0.36, 1] }}
                    className="absolute z-[60] pointer-events-none"
                    style={{
                      left: "calc(100% + 10px)",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 208,
                    }}
                  >
                    <div
                      className="rounded-[14px] overflow-hidden relative"
                      style={{
                        background: AW.glassDeep,
                        border: `1px solid ${AW.ruleStrong}`,
                        boxShadow:
                          "0 14px 44px rgba(0,0,0,0.55), 0 4px 14px rgba(0,0,0,0.35)",
                        backdropFilter: "blur(22px) saturate(160%)",
                        WebkitBackdropFilter: "blur(22px) saturate(160%)",
                      }}
                    >
                      {/* ArchioSeam top edge — replaces the linear-gradient hairline.
                          Same shimmer the dossier uses to mark the FOCUS NOW chapter. */}
                      <div className="absolute top-0 left-0 right-0 h-px">
                        <ArchioSeam accent={AW.amber} shimmer />
                      </div>
                      <div className="px-3 pt-2.5 pb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className="font-mono"
                            style={{
                              fontSize: 12,
                              color: AW.paper,
                              letterSpacing: AW.letterHeadline,
                              fontWeight: 600,
                            }}
                          >
                            {server.name}
                          </span>
                          {server.verified && (
                            <span
                              aria-label="Verified mentor desk"
                              style={{
                                fontSize: 10,
                                color: AW.amber,
                                lineHeight: 1,
                                textShadow: `0 0 6px ${AW.amberHalo}`,
                              }}
                            >
                              ◇
                            </span>
                          )}
                          {server.isLive && (
                            <span className="ml-auto inline-flex items-center gap-1">
                              <ArchioPulseDot
                                accent={AW.liveRed}
                                size={5}
                                reduced={false}
                              />
                              <CmtyEyebrow tone="live" size={8} letter={AW.letterEyebrowPremium}>
                                LIVE
                              </CmtyEyebrow>
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex items-center gap-1.5">
                          <CSTierGlyph tier={tier} size={7} />
                          <CmtyEyebrow tone="ashSoft" size={8} letter={AW.letterEyebrow}>
                            {tier === "mentor"
                              ? "MENTOR DESK"
                              : tier === "premium"
                                ? "PREMIUM"
                                : tier === "war"
                                  ? "WAR ROOM"
                                  : tier === "prop"
                                    ? "PROP FIRM"
                                    : "PUBLIC"}
                          </CmtyEyebrow>
                        </div>
                        {server.tagline && (
                          <p
                            className="mt-2"
                            style={{
                              fontSize: 10.5,
                              color: AW.ashSoft,
                              lineHeight: 1.5,
                              letterSpacing: AW.letterBody,
                            }}
                          >
                            {server.tagline}
                          </p>
                        )}
                      </div>
                      {/* ─── Meta strip ───
                          ArchioSeam replaces the previous solid border-top.
                          Numbers use CmtyMagnitude tokens (lead-bold paper /
                          tail-light ashGhost) — same as the dossier KPIs. */}
                      <div className="relative" style={{ marginTop: 2 }}>
                        <ArchioSeam accent={AW.amber} shimmer={false} />
                      </div>
                      <div
                        className="flex items-center gap-3 px-3 py-2"
                        style={{ background: "rgba(0,0,0,0.18)" }}
                      >
                        <span
                          className="font-mono tabular-nums"
                          style={{ fontSize: 9.5, color: AW.ash }}
                        >
                          {server.memberCount.toLocaleString()}{" "}
                          <span style={{ color: AW.ashGhost, letterSpacing: AW.letterEyebrow }}>
                            MEMBERS
                          </span>
                        </span>
                        <span
                          className="font-mono tabular-nums ml-auto"
                          style={{
                            fontSize: 9.5,
                            color: AW.amber,
                            textShadow: `0 0 6px ${AW.amberHalo}`,
                          }}
                        >
                          {getActiveCount(server.id)}{" "}
                          <span style={{ color: AW.ashGhost, letterSpacing: AW.letterEyebrow }}>
                            ACTIVE
                          </span>
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      {/* ───── Bottom ArchioSeam separator + Discover affordance ───── */}
      <div className="mt-auto w-full flex flex-col items-center pb-3">
        <div className="w-7 h-px mb-3 relative">
          <ArchioSeam accent={AW.amber} shimmer={false} />
        </div>
        <motion.button
          type="button"
          aria-label="Discover communities"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center justify-center group focus:outline-none"
          style={{
            width: 58,
            height: 38,
            borderRadius: 12,
            background: AW.glass,
            border: `1px solid ${AW.rule}`,
            transition: "background 220ms ease, border-color 220ms ease",
          }}
        >
          <Plus
            className="w-4 h-4 transition-colors duration-200"
            style={{ color: AW.ashGhost }}
          />
          <span className="sr-only">Discover</span>
        </motion.button>
        <div className="mt-2">
          <CmtyEyebrow tone="ashSoft" size={7.5} letter={AW.letterEyebrowPremium}>
            DISCOVER
          </CmtyEyebrow>
        </div>
      </div>
    </motion.div>
  )
}

/* ════════════════════════════════════════════════════════════════════════
 *  NAV ROW · v2 — Editorial calm
 *
 *  Total redesign away from the harsh "mining-rig" aesthetic.  The previous
 *  iteration shipped four simultaneous active-state cues (background tint +
 *  border + inset amber-halo shadow ring + traveling left bar + drop-shadow
 *  on the icon + text-shadow on the badge).  That much glow inside a 296px
 *  column made the navigator feel cluttered and shouty.
 *
 *  v2 strips it to ONE active cue at a time:
 *
 *    · idle  → ashSoft label + ashGhost icon + transparent surface
 *              + small dim numeric count on the right (no chip, no border)
 *    · hover → paper label + ashSoft icon + 4% white surface tint
 *    · active→ paper label + amber icon (no drop-shadow) + 6% amber tint
 *              + 2px amber left bar (the only motion element)
 *
 *  Labels are sentence-case, 12.5px regular weight (not 11px medium uppercase
 *  eyebrows).  Counts are small ash-toned numerals (no monospace chip frame).
 *  The row breathes at 9px vertical padding instead of 7px.
 *
 *  Result: rows now read like Linear's sidebar — quiet, low-contrast,
 *  professional.  The single amber accent only appears when something is
 *  actually selected, never as a permanent tint.
 * ═════════════════════════════════���════════════════════════════════════ */
const NAV_SPRING = { type: "spring" as const, stiffness: 500, damping: 35 }

/* ════════════════════════════════════════════════════════════════════════
 *  SECTION LABEL · Quiet group break
 *
 *  Replaces the previous trio of full-width amber-rule "ROOM CHANNELS /
 *  SIGNALS / WAR ROOMS" headers.  This is a single dim lowercase label
 *  with two ultra-thin 5%-white hairlines flanking it — almost invisible
 *  unless you're looking for it.  No icon cluster, no amber gradient, no
 *  fanfare.  Just a quiet "what follows is grouped" cue.
 * ══════════════════════════════════════════════════════════════════════ */
/* ════════════════════════════════════════════════════════════════════════
 *  SectionLabel · FLIGHT-DECK EYEBROW RECIPE
 *  ────────────────────────────────────────────────────────────────────────
 *  Replaces the previous italic-lowercase "signals / war rooms" sub-rule
 *  with the cockpit's canonical eyebrow grammar:
 *
 *    •  SIGNALS  ─────────────────────  03
 *
 *    · Leading bullet dot (amber, halo'd)         ← FD destination dot
 *    · Mono-caps label, premium tracking          ← matches `• EXECUTION`
 *    · Hairline rule extending to the right edge  ← FD hairline (14% teal)
 *    · Right-aligned em-dash + 2-digit ordinal    ← matches `— 03` lane
 *
 *  Optional `count` prop renders the magnitude numeral; without it, the
 *  ordinal alone closes the eyebrow strip.
 * ══════════════════════════════════════════════════════════════════════ */
function SectionLabel({
  label,
  ordinal,
  count,
}: {
  label: string
  ordinal?: string
  count?: number
}) {
  return (
    <div
      className="flex items-center"
      style={{ gap: 7, marginTop: 16, marginBottom: 6, paddingInline: 10 }}
    >
      {/* Bullet dot — amber with halo, the FD destination signal */}
      <span
        aria-hidden
        className="rounded-full shrink-0"
        style={{
          width: 4,
          height: 4,
          background: AW.amber,
          boxShadow: `0 0 6px ${AW.amberHalo}`,
        }}
      />
      {/* Mono-caps label, premium tracking */}
      <span
        className="font-mono uppercase shrink-0"
        style={{
          fontSize: 9,
          letterSpacing: AW.letterEyebrowPremium,
          fontWeight: 600,
          color: AW.paper,
        }}
      >
        {label}
      </span>
      {/* Optional inline magnitude count · `· 04` */}
      {typeof count === "number" && (
        <span
          className="font-mono tabular-nums shrink-0"
          style={{
            fontSize: 9,
            letterSpacing: AW.letterEyebrowPremium,
            fontWeight: 500,
            color: AW.ashSoft,
          }}
        >
          <span style={{ color: AW.ashGhost, marginRight: 4 }}>·</span>
          {String(count).padStart(2, "0")}
        </span>
      )}
      {/* Hairline rule extending right */}
      <span
        aria-hidden
        className="flex-1 h-px"
        style={{ background: AW.rule, opacity: 0.6 }}
      />
      {/* Closing em-dash + ordinal numeral */}
      {ordinal && (
        <span
          className="font-mono uppercase tabular-nums shrink-0"
          style={{
            fontSize: 9,
            letterSpacing: AW.letterEyebrowPremium,
            fontWeight: 500,
            color: AW.ashGhost,
          }}
        >
          {`— ${ordinal}`}
        </span>
      )}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════
 *  NavRow · FLIGHT-DECK DESTINATION ROW
 *  ────────────────────────────────────────────────────────────────────────
 *  Replaces the soft-fill amber-bar nav row with the cockpit's destination
 *  grammar.  Each row is a transparent slab bound by a top hairline (skip
 *  on first), with the active state marked by a single bullet dot in the
 *  left gutter (FD layoutId="nav-active-bar" preserved for travel).
 *
 *  Anatomy (left → right):
 *    [• gutter][icon][LABEL · mono-caps][hairline filler][magnitude · NEW]
 *
 *    · Bullet dot replaces the 2px amber bar — same visual language as
 *      the cockpit footer pillars.
 *    · Icon: 12px outline, ashGhost → amber on active.
 *    · Label: humanist sans, 12.5px, paper on active, ashSoft otherwise.
 *      Optional uppercase mono treatment via `mono` prop for system
 *      destinations (Gameplan, Entries, etc.).
 *    · Magnitude: tabular-nums, paper on active, ashGhost otherwise.
 *      Suffix caps (NEW, OPEN, PRO) at 8px, premium tracking — same
 *      recipe as <CmtyMagnitude/>.
 * ════════════════════════════════════════════════���═════════════════════ */
function NavRow({
  icon: Icon,
  label,
  isActive,
  onClick,
  badge,
  badgeTone = "neutral",
  badgeSuffix,
  showRule = true,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  label: string
  isActive: boolean
  onClick: () => void
  badge?: string
  badgeTone?: "neutral" | "amber" | "live"
  badgeSuffix?: string
  showRule?: boolean
}) {
  return (
    <button
      onClick={onClick}
      aria-current={isActive ? "true" : undefined}
      className="group relative w-full flex items-center text-left focus:outline-none"
      style={{
        gap: 9,
        paddingInline: 10,
        paddingBlock: 8,
        borderRadius: 0,
        background: isActive
          ? "rgba(245,158,11,0.04)"
          : "transparent",
        transition: "background 160ms ease, color 160ms ease",
      }}
      onMouseEnter={(e) => {
        if (!isActive) e.currentTarget.style.background = "rgba(94,234,212,0.022)"
      }}
      onMouseLeave={(e) => {
        if (!isActive) e.currentTarget.style.background = "transparent"
      }}
    >
      {/* ── Top hairline — opens the row.  Skipped on first via showRule ── */}
      {showRule && (
        <span
          aria-hidden
          className="absolute left-2 right-2 top-0 h-px pointer-events-none"
          style={{ background: AW.rule, opacity: 0.45 }}
        />
      )}

      {/* ── Active bullet dot in left gutter (travels via layoutId) ── */}
      {isActive && (
        <motion.span
          layoutId="nav-active-bar"
          aria-hidden
          className="absolute"
          style={{
            left: 3,
            top: "50%",
            width: 4,
            height: 4,
            marginTop: -2,
            borderRadius: 999,
            background: AW.amber,
            boxShadow: `0 0 6px ${AW.amberHalo}, 0 0 1px ${AW.amber}`,
          }}
          transition={NAV_SPRING}
        />
      )}

      {/* ── Icon — 12px outline, switches color on active ── */}
      <Icon
        className="w-3 h-3 flex-shrink-0 transition-colors duration-150"
        style={{
          color: isActive ? AW.amber : AW.ashGhost,
          marginLeft: 2,
        }}
      />

      {/* ── Label · humanist sans (matches FD destination titles) ── */}
      <span
        className="flex-1 truncate"
        style={{
          fontSize: 12.5,
          fontWeight: isActive ? 500 : 400,
          letterSpacing: AW.letterHeadline,
          color: isActive ? AW.paper : AW.ashSoft,
          transition: "color 160ms ease, font-weight 160ms ease",
        }}
      >
        {label}
      </span>

      {/* ── Magnitude badge · tabular-nums + premium-tracked suffix caps ── */}
      {badge && (
        <span className="flex items-baseline shrink-0" style={{ gap: 3 }}>
          <span
            className="font-mono tabular-nums"
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: AW.letterNumeric,
              color:
                badgeTone === "amber"
                  ? AW.amber
                  : badgeTone === "live"
                    ? AW.liveRed
                    : isActive
                      ? AW.paper
                      : AW.ashSoft,
              textShadow:
                badgeTone === "amber"
                  ? `0 0 6px ${AW.amberHalo}`
                  : badgeTone === "live"
                    ? `0 0 6px ${AW.liveRedHalo}`
                    : "none",
              transition: "color 160ms ease",
            }}
          >
            {badge}
          </span>
          {badgeSuffix && (
            <span
              className="font-mono uppercase"
              style={{
                fontSize: 8,
                letterSpacing: AW.letterEyebrowPremium,
                fontWeight: 600,
                color: AW.ashGhost,
              }}
            >
              {badgeSuffix}
            </span>
          )}
        </span>
      )}
    </button>
  )
}

export function FloatingCommunityHub() {
  /* The floating left-edge swipe tab is the entry point on every route,
   * including the trading dashboard. (It was briefly relocated into the
   * chart control rail; it now lives back on the left edge, vertically
   * anchored to the control-rail band so it stays put as the deck reveals
   * or the navigator scrolls.) The header CustomEvent bridge below is kept
   * so any external trigger can still toggle the hub. */
  const useHeaderTrigger = false

  const [isOpen, setIsOpen] = useState(false)
  const [isApproaching, setIsApproaching] = useState(false)
  const [activeServer, setActiveServer] = useState<ServerId>("whale-room")
  const [activeView, setActiveView] = useState<ActiveView>("daily-gameplan")
  // Theater — the Live Room folds the desk rail + navigator away so the
  // workspace gets the whole shell. Remembered per device, default on.
  const [theater, setTheater] = useLayoutMemory("lr:theater", true)
  const theaterOn = activeView === "live-stage" && theater
  const [activeWarRoom, setActiveWarRoom] = useState<string | null>(null)
  const [signalFilter, setSignalFilter] = useState<"latest" | "top-rated">("latest")
  const [messageInput, setMessageInput] = useState("")

  const [showDeployModal, setShowDeployModal] = useState(false)
  const [warRoomTicker, setWarRoomTicker] = useState("")
  const [warRoomDuration, setWarRoomDuration] = useState("4h")
  const [showNotifications, setShowNotifications] = useState(false)
  const [showMemberProfile, setShowMemberProfile] = useState(false)

  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const exitTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const approachTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const currentServer = SERVERS.find((s) => s.id === activeServer)!

  // Compute signal hierarchy for trigger indicators
  const hasLiveMentor = SERVERS.some((s) => s.isLive)
  const unreadCount = 7 // mock: total unread across rooms
  const hasExpiringRoom = WAR_ROOMS.some((r) => r.status === "expiring")

  // Most urgent context line for the approach strip
  const urgentContext = hasLiveMentor
    ? "Mentor Alex LIVE"
    : hasExpiringRoom
      ? "War room expiring"
      : unreadCount > 0
        ? `${unreadCount} unread`
        : "Community"

  /* ── Cross-tree bridge to the header trigger ───────────────────────────
   * On /dashboard the entry point is <HeaderCommunityTrigger/>, which lives
   * in the trading-desk chart header (a separate React tree). It toggles us
   * open via a window CustomEvent, and we broadcast our live/unread signal
   * back so its pulse + badge stay in sync. */
  useEffect(() => {
    const onToggle = () => setIsOpen((v) => !v)
    window.addEventListener(COMMUNITY_TOGGLE_EVENT, onToggle)
    return () => window.removeEventListener(COMMUNITY_TOGGLE_EVENT, onToggle)
  }, [])

  useEffect(() => {
    const liveCount = SERVERS.filter((s) => s.isLive).length
    const detail: CommunityIndicators = {
      hasLive: hasLiveMentor,
      liveCount,
      totalUnread: unreadCount,
      topContext: urgentContext,
    }
    const broadcast = () =>
      window.dispatchEvent(new CustomEvent(COMMUNITY_INDICATORS_EVENT, { detail }))
    broadcast()
    // Re-broadcast when the header trigger mounts after us and asks.
    window.addEventListener("community-hub:request-indicators", broadcast)
    return () => window.removeEventListener("community-hub:request-indicators", broadcast)
  }, [hasLiveMentor, unreadCount, urgentContext])

  const handleTriggerHover = () => {
    if (exitTimeoutRef.current) clearTimeout(exitTimeoutRef.current)
    // Immediate approach state (shows label + activity strip)
    approachTimeoutRef.current = setTimeout(() => setIsApproaching(true), 60)
    // Delayed open (gives user time to see the approach strip)
    hoverTimeoutRef.current = setTimeout(() => {
      setIsOpen(true)
      setIsApproaching(false)
    }, 280)
  }

  const handleTriggerLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    if (approachTimeoutRef.current) clearTimeout(approachTimeoutRef.current)
    setIsApproaching(false)
  }

  const handleTriggerClick = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    if (approachTimeoutRef.current) clearTimeout(approachTimeoutRef.current)
    setIsApproaching(false)
    setIsOpen(!isOpen)
  }

  const handleDrawerLeave = () => {
    exitTimeoutRef.current = setTimeout(() => setIsOpen(false), 400)
  }

  const handleDrawerEnter = () => {
    if (exitTimeoutRef.current) clearTimeout(exitTimeoutRef.current)
  }

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  const handleServerChange = (serverId: ServerId) => {
    setActiveServer(serverId)
    setActiveView("forecast-feed")
    setActiveWarRoom(null)
  }

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      setMessageInput("")
    }
  }

  const handleDeployWarRoom = () => {
    console.log("Deploying War Room:", { ticker: warRoomTicker, duration: warRoomDuration })
    setShowDeployModal(false)
    setWarRoomTicker("")
    setWarRoomDuration("4h")
  }

  const sortedSignals = [...SIGNALS].sort((a, b) => {
    if (signalFilter === "top-rated") return (b.rating || 0) - (a.rating || 0)
    return 0
  })

  const renderMainView = () => {
    // Daily Gameplan View
    if (activeView === "daily-gameplan") {
      return <DailyGameplan />
    }

    // Entry Room View
    if (activeView === "entry-room") {
      return <EntryRoom />
    }

    // Leaderboard View
    if (activeView === "leaderboard") {
      return <Leaderboard />
    }

    // War Room Chat View
    if (activeView === "war-room" && activeWarRoom) {
      const room = WAR_ROOMS.find((r) => r.id === activeWarRoom)
      return (
        <div className="flex-1 flex flex-col">
          {/* War Room Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-gradient-to-r from-amber-500/10 to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <Timer className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">#{room?.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                      room?.status === "expiring" ? "bg-red-500/20 text-red-400" : "bg-amber-500/20 text-amber-400"
                    }`}
                  >
                    Expires in {room?.expiresIn}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500">{room?.members} traders active</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-1.5 rounded-md hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
                <Users className="w-4 h-4" />
              </button>
              <button className="p-1.5 rounded-md hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
                <Pin className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* War Room Chat */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {WAR_ROOM_CHAT.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.isCurrentUser ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full bg-gradient-to-br ${msg.userColor} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}
                  >
                    {msg.userAvatar}
                  </div>
                  <div className={`flex-1 max-w-[240px] ${msg.isCurrentUser ? "text-right" : ""}`}>
                    <div className={`flex items-center gap-2 mb-1 ${msg.isCurrentUser ? "justify-end" : ""}`}>
                      <span className="text-xs font-semibold text-white">{msg.userName}</span>
                      <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                    </div>
                    <div
                      className={`inline-block px-3 py-2 rounded-xl text-sm ${
                        msg.isCurrentUser
                          ? "bg-amber-600 text-white rounded-br-sm"
                          : "bg-white/5 text-slate-200 rounded-bl-sm"
                      }`}
                    >
                      {msg.message}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>

          {/* Chat Input */}
          <div className="p-3 border-t border-white/5">
            <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2 border border-white/10 focus-within:border-amber-500/50">
              <Input
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Share your trade update..."
                className="flex-1 bg-transparent border-0 text-sm text-white placeholder:text-slate-500 focus-visible:ring-0 p-0 h-auto"
              />
              <button
                onClick={handleSendMessage}
                className="p-1.5 rounded-md bg-amber-500 hover:bg-amber-600 text-white transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )
    }

    // Call History View
    if (activeView === "call-history") {
      return <LiveCallHistory />
    }

    // Dashboard View
    if (activeView === "dashboard") {
      return <LiveCallsDashboard />
    }

    // Live Stage View — the Live Room (components/live-room)
    if (activeView === "live-stage") {
      return (
        <LiveRoom
          messageInput={messageInput}
          setMessageInput={setMessageInput}
          onSendMessage={handleSendMessage}
          onLeave={() => setActiveView("forecast-feed")}
          theater={theater}
          onToggleTheater={() => setTheater(!theater)}
        />
      )
    }

    // Forecast Feed View (Default)
    return (
      <div className="flex-1 flex flex-col">
        {/* Forecast Feed Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold text-white">Official Signals</span>
          </div>
          {/* Filter Toggles */}
          <div className="flex items-center gap-1 bg-white/5 rounded-lg p-0.5">
            <button
              onClick={() => setSignalFilter("latest")}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                signalFilter === "latest" ? "bg-emerald-500/20 text-emerald-400" : "text-slate-400 hover:text-white"
              }`}
            >
              Latest
            </button>
            <button
              onClick={() => setSignalFilter("top-rated")}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                signalFilter === "top-rated" ? "bg-emerald-500/20 text-emerald-400" : "text-slate-400 hover:text-white"
              }`}
            >
              Top Rated
            </button>
          </div>
        </div>

        {/* Signal Cards Grid */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-3">
            {sortedSignals.map((signal, idx) => (
              <motion.div
                key={signal.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-emerald-500/30 hover:bg-white/[0.07] transition-all group"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-mono font-bold text-white">{signal.asset}</span>
                    {signal.verified && (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-bold uppercase flex items-center gap-1">
                        <Shield className="w-2.5 h-2.5" />
                        Verified
                      </span>
                    )}
                    {signal.rating && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[9px] font-bold">
                        {signal.rating}%
                      </span>
                    )}
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                      signal.bias === "LONG" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {signal.bias === "LONG" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {signal.bias}
                  </span>
                </div>

                {/* Price Grid */}
                <div className="grid grid-cols-3 gap-3 mb-3 font-mono text-sm">
                  <div>
                    <div className="text-slate-500 text-[10px] uppercase tracking-wider mb-1">Entry</div>
                    <div className="text-white font-bold">{signal.entry}</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-[10px] uppercase tracking-wider mb-1">Stop</div>
                    <div className="text-red-400 font-bold">{signal.stop}</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-[10px] uppercase tracking-wider mb-1">Target</div>
                    <div className="text-emerald-400 font-bold">{signal.target}</div>
                  </div>
                </div>

                {/* Meta */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-3 border-t border-white/5 mb-3">
                  <span className="font-semibold">R:R {signal.rr}</span>
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`w-5 h-5 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-[8px] font-bold text-white`}
                    >
                      {signal.mentorAvatar}
                    </div>
                    <span>by {signal.mentor}</span>
                  </div>
                  <span>{signal.time}</span>
                </div>

                {/* Copy Button */}
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-full h-8 bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/30 text-xs hover:text-emerald-400 transition-all"
                >
                  <Copy className="w-3 h-3 mr-1.5" />
                  Copy Trade
                </Button>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </div>
    )
  }

  // ══════════════════════════════════════════════════════════════════
  // AUTHORITY ZONE — unified constants, utilities, derived state
  // ══════════════════════════════════════════════════════════════════

  const SPRING_SHELL = { type: "spring" as const, stiffness: 360, damping: 32 }
  const SPRING_SNAPPY = { type: "spring" as const, stiffness: 500, damping: 35 }
  const SPRING_RAIL = { type: "spring" as const, stiffness: 480, damping: 32 }
  const EASE_PREMIUM = [0.22, 0.68, 0.36, 1] as const

  const getServerIndicatorColor = (color: string) => {
    if (color.includes("emerald")) return "rgb(16,185,129)"
    if (color.includes("purple") || color.includes("pink")) return "rgb(168,85,247)"
    if (color.includes("amber") || color.includes("orange")) return "rgb(245,158,11)"
    if (color.includes("sky") || color.includes("blue")) return "rgb(56,189,248)"
    if (color.includes("rose") || color.includes("red")) return "rgb(244,63,94)"
    return "rgb(148,163,184)"
  }

  const getServerUnread = (id: ServerId) => {
    const map: Record<ServerId, number> = { "whale-room": 3, "crypto-elite": 2, "gold-masters": 0, "ny-traders": 1, "mentor-hub": 0 }
    return map[id] || 0
  }

  const getServerPurpose = (id: ServerId) => {
    const map: Record<ServerId, string> = {
      "whale-room": "Institutional flow analysis",
      "crypto-elite": "Crypto signals & analysis",
      "gold-masters": "Precious metals trading",
      "ny-traders": "NY session scalping",
      "mentor-hub": "Direct mentor access",
    }
    return map[id] || ""
  }

  const getServerActive = (id: ServerId) => {
    const map: Record<ServerId, number> = { "whale-room": 142, "crypto-elite": 89, "gold-masters": 34, "ny-traders": 67, "mentor-hub": 23 }
    return map[id] || 0
  }

  const totalUnread = SERVERS.reduce((sum, s) => sum + getServerUnread(s.id), 0)
  const liveServerCount = SERVERS.filter((s) => s.isLive).length
  const currentIndicatorColor = getServerIndicatorColor(currentServer.color)

  // Navigator row helper — generates consistent row styling
  const navRowClass = (isActive: boolean, color: string) =>
    `w-full flex items-center gap-2 px-2.5 py-[7px] rounded-lg text-xs transition-all duration-150 relative ${
      isActive
        ? `bg-${color}-500/[0.07] text-${color}-300`
        : "text-slate-400/70 hover:text-white/80 hover:bg-white/[0.025]"
    }`

  return (
    <>
      {/* ══════════════════════════════════════════════════════════ */}
      {/* BACKDROP — environmental depth separation                */}
      {/* ══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="community-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE_PREMIUM }}
            className="fixed inset-0 z-[49] cursor-pointer"
            onClick={() => setIsOpen(false)}
            style={{
              background: "radial-gradient(ellipse 140% 120% at -5% 50%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.32) 40%, rgba(0,0,0,0.18) 100%)",
              backdropFilter: "blur(4px) saturate(0.75) brightness(0.95)",
            }}
          />
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* PART A — FLOATING TRIGGER                                */}
      {/* ══════════════════════════════════════════════════════════ */}
      {/* Vertically pinned to the chart control-rail band via a fixed
          viewport anchor (top: var). It is deliberately NOT tied to the
          navigator's DOM position, so revealing/concealing the flight deck
          or scrolling the desk never shifts the tab — it "floats outside"
          the navigator while sitting in the same vertical range. */}
      <div
        className="fixed left-0 z-[52]"
        style={{ top: "var(--community-tab-top, 47%)" }}
      >
        {/* The -50% centering lives on this inner div, NOT on the fixed wrapper:
            a transform on the wrapper would make it the containing block for the
            fixed MAIN SHELL below and pin the shell to the tab's vertical anchor. */}
        <div style={{ transform: "translateY(-50%)" }}>
        <AnimatePresence initial={false}>
          {!isOpen && !useHeaderTrigger && (
            <motion.div
              key="hub-trigger-wrapper"
              initial={{ x: -60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -60, opacity: 0 }}
              transition={SPRING_SHELL}
              className="relative"
            >
              <motion.button
                onMouseEnter={handleTriggerHover}
                onMouseLeave={handleTriggerLeave}
                onClick={handleTriggerClick}
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.96, x: 1 }}
                className="relative flex items-center rounded-r-2xl overflow-hidden group cursor-pointer"
                style={{
                  background: "linear-gradient(145deg, #0b0d14 0%, #0a0c12 40%, #080a0f 100%)",
                  backdropFilter: "blur(24px) saturate(1.2)",
                  boxShadow: `
                    6px 0 32px rgba(0,0,0,0.5),
                    2px 0 12px rgba(0,0,0,0.35),
                    inset 0 1px 0 rgba(255,255,255,0.04),
                    inset 0 -1px 0 rgba(0,0,0,0.2)
                  `,
                  border: "1px solid rgba(255,255,255,0.055)",
                  borderLeft: "none",
                }}
                aria-label="Open Community Hub"
              >
                {/* Left edge accent — colored connection line */}
                <div className="absolute left-0 top-3 bottom-3 w-[2px] rounded-r-full pointer-events-none"
                  style={{ background: `linear-gradient(180deg, transparent, ${currentIndicatorColor}40, transparent)` }}
                />

                {/* Icon container */}
                <div className="flex items-center justify-center w-[54px] h-[56px] relative">
                  <Radio className="w-[18px] h-[18px] text-emerald-400/90 transition-all duration-300 group-hover:text-emerald-300 group-hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.35)]" />

                  {/* Ambient ring on hover */}
                  <motion.div
                    className="absolute inset-2.5 rounded-full pointer-events-none"
                    animate={{
                      boxShadow: isApproaching
                        ? "inset 0 0 0 1px rgba(255,255,255,0.05), 0 0 12px rgba(16,185,129,0.06)"
                        : "inset 0 0 0 0px transparent",
                      scale: isApproaching ? 1 : 0.85,
                    }}
                    transition={{ duration: 0.35 }}
                  />
                </div>

                {/* Approach reveal — label only (status sub-lines removed
                    per design: the tab simply reads "Community"). */}
                <motion.div
                  initial={false}
                  animate={{ width: isApproaching ? 104 : 0, opacity: isApproaching ? 1 : 0 }}
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  <div className="flex flex-col justify-center pr-4 pl-0.5 py-1.5">
                    <span className="text-[11px] font-semibold text-white/65 tracking-[0.12em] uppercase">
                      Community
                    </span>
                  </div>
                </motion.div>

                {/* T1: Live — red ping */}
                {hasLiveMentor && (
                  <span className="absolute top-2.5 right-2.5 flex h-2.5 w-2.5 pointer-events-none">
                    <span className="animate-ping absolute inset-0 rounded-full bg-red-500 opacity-35" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
                  </span>
                )}

                {/* T2: Unread count */}
                {totalUnread > 0 && (
                  <span className="absolute -bottom-1.5 right-1.5 min-w-[17px] h-[17px] rounded-full text-[8px] font-bold text-white/75 flex items-center justify-center px-0.5 pointer-events-none"
                    style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.05)", boxShadow: "0 2px 8px rgba(0,0,0,0.35)" }}
                  >
                    {totalUnread}
                  </span>
                )}

                {/* T3: Ambient presence */}
                {!hasLiveMentor && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-emerald-500/35 animate-pulse pointer-events-none" />
                )}

                {/* Top edge highlight */}
                <div className="absolute top-0 left-6 right-0 h-px pointer-events-none"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.05) 40%, rgba(255,255,255,0.03) 80%, transparent)" }}
                />

                {/* Bottom edge shadow */}
                <div className="absolute bottom-0 left-6 right-0 h-px pointer-events-none"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.3) 50%, transparent)" }}
                />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
        </div>

        {/* ════════════���═════════════════════════════════════════════ */}
        {/* MAIN SHELL — collaborative environment                   */}
        {/* ══════════════════════════════════════════════════════════ */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="hub-shell"
              initial={{ x: "-100%", opacity: 0.4 }}
              animate={{ x: "0%", opacity: 1 }}
              exit={{ x: "-100%", opacity: 0.4 }}
              transition={SPRING_SHELL}
              onMouseEnter={handleDrawerEnter}
              onMouseLeave={handleDrawerLeave}
              className="fixed left-0 top-0 h-[100dvh] w-screen md:top-[3vh] md:h-[94vh] md:w-[calc(100vw-96px)] md:min-w-[min(860px,100vw)] md:rounded-r-2xl z-50 overflow-hidden"
              style={{
                background: "linear-gradient(180deg, #0d0f16 0%, #0b0d12 5%, #090b0f 50%, #08090d 100%)",
                boxShadow: `
                  20px 0 80px rgba(0,0,0,0.55),
                  8px 0 32px rgba(0,0,0,0.4),
                  3px 0 10px rgba(0,0,0,0.35),
                  inset -1px 0 0 rgba(255,255,255,0.02)
                `,
              }}
            >
              {/* Shell edge system — right */}
              <div className="absolute right-0 top-0 bottom-0 w-px pointer-events-none z-30"
                style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 35%, rgba(255,255,255,0.015) 65%, rgba(255,255,255,0.07) 100%)" }}
              />
              <div className="absolute right-[1px] top-0 bottom-0 w-px pointer-events-none z-30"
                style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.01) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.008) 100%)" }}
              />

              {/* Shell edge system — top */}
              <div className="absolute top-0 left-0 right-0 h-px pointer-events-none z-30"
                style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.06) 75%, rgba(255,255,255,0.02) 100%)" }}
              />

              {/* Shell edge system — bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-px pointer-events-none z-30 rounded-br-2xl"
                style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.01) 0%, rgba(255,255,255,0.025) 50%, rgba(255,255,255,0.01) 100%)" }}
              />

              {/* Grain texture */}
              <div className="absolute inset-0 pointer-events-none z-[1] rounded-r-2xl opacity-[0.018]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "repeat",
                  backgroundSize: "128px 128px",
                }}
              />

              {/* ═══════════════════════════════════════════════════════════ */}
              {/* ═══ PART B — COMMUNITY NAMEPLATE HEADER (60px)          ═══ */}
              {/* ═══                                                        */}
              {/* ═══ Replaces the old two-zone header (status chip +        */}
              {/* ═══ gradient room chip on the left, controls on the right) */}
              {/* ═══ with a three-zone stratum in the Flight Deck idiom:    */}
              {/* ═══                                                        */}
              {/* ═══   LEFT       ─ tier glyph · status pulse · LIVE n      */}
              {/* ═══   CENTER     ─ CSNameplate (────●  NAME · TIER  ●────) */}
              {/* ═══               with FdLiveTick UTC and ONLINE count.    */}
              {/* ═══   RIGHT      ─ minimal mono notification + close.      */}
              {/* ═══                                                        */}
              {/* ═══ The active community's identity is now the FIRST       */}
              {/* ═══ thing the eye finds — a single centred plate in the    */}
              {/* ═══ same visual family as Flight Deck and the temporal     */}
              {/* ═══ anchor rail.                                           */}
              {/* ═══════════════════════════════════════════════════════════ */}
              {(() => {
                const tier = (currentServer.tier ?? "public") as CSTier
                const tierLabel =
                  tier === "mentor"  ? "Mentor Desk" :
                  tier === "premium" ? "Premium"     :
                  tier === "war"     ? "War Room"    :
                  tier === "prop"    ? "Prop Firm"   :
                                       "Public"
                return (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.05, ease: EASE_PREMIUM }}
                    className="relative z-20 flex items-center h-[60px] px-4 select-none"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,0.014) 0%, rgba(255,255,255,0.004) 100%)",
                    }}
                  >
                    {/* Top ArchioSeam — replaces the static linear-gradient hairline.
                        Same primitive that opens chapters in active-window-dossier.
                        Shimmer activates only when *something* in the panel is live. */}
                    <div className="absolute top-0 left-0 right-0 h-px pointer-events-none">
                      <ArchioSeam accent={AW.amber} shimmer={liveServerCount > 0} />
                    </div>

                    {/* Bottom ArchioSeam — replaces the dashed border. Single
                        source of truth for chapter divisions across the panel. */}
                    <div className="absolute bottom-0 left-0 right-0 h-px pointer-events-none">
                      <ArchioSeam accent={AW.amber} shimmer={liveServerCount > 0} />
                    </div>

                    {/* ───── LEFT — status + tier ───── */}
                    {/* Kept as a flex-1 spacer on mobile (invisible) so the nameplate
                        stays centred; its content would collide with the nameplate. */}
                    <div className="flex items-center gap-3 flex-1 min-w-0 overflow-hidden invisible md:visible">
                      <div className="flex items-center gap-1.5">
                        {currentServer.isLive ? (
                          <ArchioPulseDot accent={AW.liveRed} size={6} reduced={false} />
                        ) : (
                          <span
                            aria-hidden
                            className="rounded-full"
                            style={{
                              width: 6,
                              height: 6,
                              background: AW.ashGhost,
                            }}
                          />
                        )}
                        <CmtyEyebrow
                          size={9}
                          tone={currentServer.isLive ? "live" : "ashSoft"}
                          letter={AW.letterEyebrowPremium}
                        >
                          {currentServer.isLive ? "LIVE" : "IDLE"}
                        </CmtyEyebrow>
                      </div>

                      <span
                        aria-hidden
                        className="w-px h-3"
                        style={{ background: AW.rule }}
                      />

                      <div className="flex items-center gap-1.5">
                        <CSTierGlyph tier={tier} size={9} />
                        <CmtyEyebrow size={9} tone="ashSoft" letter={AW.letterEyebrow}>
                          {tierLabel.toUpperCase()}
                        </CmtyEyebrow>
                      </div>

                      {liveServerCount > 0 && (
                        <>
                          <span
                            aria-hidden
                            className="w-px h-3"
                            style={{ background: AW.rule }}
                          />
                          <span
                            className="font-mono tabular-nums uppercase"
                            style={{
                              fontSize: 9,
                              letterSpacing: AW.letterEyebrowPremium,
                              color: AW.liveRed,
                              fontWeight: 600,
                              textShadow: `0 0 6px ${AW.liveRedHalo}`,
                            }}
                          >
                            {String(liveServerCount).padStart(2, "0")}{" "}
                            <span style={{ color: AW.ashSoft, textShadow: "none" }}>LIVE</span>
                          </span>
                        </>
                      )}
                    </div>

                    {/* ───── CENTER — Nameplate ���─���──
                          Replaced legacy CSNameplate (gradient-line wrapper) with
                          the canonical CmtyNameplate which composes
                          NameplateHairline + NameplateDot end-caps — pixel-perfect
                          match to the dossier's section identity (──●  TITLE  ●──). */}
                    <div className="flex flex-col items-center gap-0.5 shrink-0">
                      <CmtyNameplate
                        title={
                          <span className="inline-flex items-center" style={{ gap: 8 }}>
                            <motion.span
                              key={currentServer.id}
                              initial={{ opacity: 0, y: 3 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: AW.durHeadlineMorph, ease: AW.ease }}
                              style={{ display: "inline-block" }}
                            >
                              {currentServer.name}
                            </motion.span>
                            {currentServer.verified && (
                              <span
                                aria-label="Verified desk"
                                style={{
                                  fontSize: 10,
                                  color: AW.amber,
                                  lineHeight: 1,
                                  textShadow: `0 0 6px ${AW.amberHalo}`,
                                }}
                              >
                                ◇
                              </span>
                            )}
                            <span
                              aria-hidden
                              className="font-mono uppercase"
                              style={{
                                fontSize: 9,
                                letterSpacing: AW.letterEyebrow,
                                color: AW.ashSoft,
                                fontWeight: 500,
                              }}
                            >
                              · {tierLabel}
                            </span>
                          </span>
                        }
                        accent={AW.amber}
                        paddingX={14}
                      />
                      <div className="flex items-center gap-2 mt-0.5">
                        <FdLiveTick label="UTC" showSeconds={false} size={9} />
                        <span
                          aria-hidden
                          className="rounded-full"
                          style={{
                            width: 2,
                            height: 2,
                            background: AW.ashGhost,
                            opacity: 0.7,
                          }}
                        />
                        <span
                          className="font-mono tabular-nums uppercase"
                          style={{
                            fontSize: 9,
                            letterSpacing: AW.letterEyebrowPremium,
                            color: AW.ashSoft,
                            fontWeight: 600,
                          }}
                        >
                          {getServerActive(currentServer.id)}{" "}
                          <span style={{ color: AW.ashGhost }}>ONLINE</span>
                        </span>
                      </div>
                    </div>

                    {/* ───── RIGHT — controls ───── */}
                    <div className="flex items-center gap-1 flex-1 justify-end">
                      <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        aria-label="Notifications"
                        aria-pressed={showNotifications}
                        className="relative inline-flex items-center justify-center group focus:outline-none"
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 10,
                          background: showNotifications
                            ? AW.amberWash
                            : "transparent",
                          border: `1px solid ${
                            showNotifications ? AW.amberHalo : "transparent"
                          }`,
                          transition:
                            "background 200ms ease, border-color 200ms ease",
                        }}
                      >
                        <Bell
                          className="w-3.5 h-3.5 transition-colors duration-200"
                          style={{
                            color: showNotifications ? AW.amber : AW.ashSoft,
                          }}
                        />
                        {totalUnread > 0 && (
                          <span
                            className="absolute inline-flex items-center justify-center font-mono tabular-nums"
                            style={{
                              top: 4,
                              right: 4,
                              minWidth: 12,
                              height: 12,
                              paddingLeft: 2.5,
                              paddingRight: 2.5,
                              borderRadius: 6,
                              background: AW.amber,
                              color: AW.ink,
                              fontSize: 8,
                              fontWeight: 700,
                              letterSpacing: AW.letterNumeric,
                              boxShadow: `0 0 8px ${AW.amberHalo}`,
                            }}
                          >
                            {Math.min(totalUnread, 9)}
                          </span>
                        )}
                      </button>
                      <button
                        onClick={() => setIsOpen(false)}
                        aria-label="Close (Esc)"
                        title="Close (Esc)"
                        className="inline-flex items-center justify-center hover:bg-white/[0.035] focus:outline-none"
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 10,
                          background: "transparent",
                          border: "1px solid transparent",
                          transition: "background 180ms ease",
                        }}
                      >
                        <X
                          className="w-3.5 h-3.5"
                          style={{ color: AW.ashSoft }}
                        />
                      </button>
                    </div>
                  </motion.div>
                )
              })()}

              {/* Notification Center */}
              <NotificationCenter isOpen={showNotifications} onClose={() => setShowNotifications(false)} />

              {/* ═══ THREE-COLUMN INTERIOR ═══ */}
              <div className="flex overflow-hidden" style={{ height: "calc(100% - 60px)" }}>

                {/* ══════════════════════════════════════════════════════ */}
                {/* ══ Column 1: IDENTITY RAIL (78px)                  ══ */}
                {/* ══                                                    */}
                {/* ══ Replaces the Discord-style gradient bubble grid.   */}
                {/* ══ Each community is now a slim glass slab marked by  */}
                {/* ══ a mono sigil and a geometric tier glyph. A single  */}
                {/* ══ accent bar physically travels between rows on      */}
                {/* ══ selection (layoutId="cs-rail-accent"), so the user */}
                {/* ══ feels the move rather than seeing two states swap. */}
                {/* ═�����                                                    */}
                {/* ══ Hover reveals a custom glass nameplate to the      */}
                {/* ══ right — name, verified mark, tier, members,        */}
                {/* ══ tagline — replacing the Radix tooltip.             */}
                {/* ══════════════════════════════════════════��═══════════ */}
                {/* Below md the Live Room owns the whole shell; the rail and the
                    navigator return with LEAVE (activeView → forecast-feed). */}
                {/* Theater: the rail folds to 0 so the room owns the shell;
                    the room header's THEATER key (⌘\) brings it back. */}
                <motion.div
                  className={`shrink-0 overflow-hidden ${activeView === "live-stage" ? "hidden md:flex" : "flex"}`}
                  initial={false}
                  animate={{ width: theaterOn ? 0 : 78, opacity: theaterOn ? 0 : 1 }}
                  transition={{ duration: 0.32, ease: EASE_PREMIUM }}
                  aria-hidden={theaterOn || undefined}
                >
                  <CommunityIdentityRail
                    servers={SERVERS}
                    activeServer={activeServer}
                    onServerChange={handleServerChange}
                    getActiveCount={getServerActive}
                  />
                </motion.div>


                {/* ════════════════════════════════════════════════════════════
                 *  COLUMN 2 · NAVIGATOR — 296px (was 244px → 172px originally)
                 *
                 *  Widened from 172px → 244px to fix three structural defects
                 *  that surfaced once the Vantary-Archio language landed:
                 *
                 *    1. Room name truncated to "W…" (Whale Room → "W…")
                 *    2. Purpose copy ("INSTITUTIONAL FLOW ANALYSIS") wrapped
                 *       to 3 lines because no truncate constraint existed
                 *    3. LIVE NOW play/JOIN chip clipped behind right edge
                 *
                 *  244px gives:
                 *    · 36px sigil + 12px gap + ~140px name+purpose stack +
                 *      24px chevron + 32px lateral padding = 244px (clean fit)
                 *    · Magnitudes (MEMBERS / ACTIVE / NEW) breathe at 11px
                 *    · LIVE NOW JOIN CTA fully visible alongside 847 LISTENING
                 *    · War-room rows fit "short-btc-scalp" + expiring chip
                 *
                 *  The column still respects the panel's overall budget — at
                 *  the smallest panel width (860px), Stage receives 522px,
                 *  which exceeds the dossier's 480px breakpoint comfortably.
                 * ══════════════════════════════════════════════════════════ */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: theaterOn ? 0 : 1, width: theaterOn ? 0 : 244 }}
                  transition={{ duration: 0.32, ease: EASE_PREMIUM }}
                  aria-hidden={theaterOn || undefined}
                  className={`flex-col relative shrink-0 overflow-hidden ${activeView === "live-stage" ? "hidden md:flex" : "flex"}`}
                  style={{
                    /* Translucent Flight-Deck glass, one step LIGHTER than the
                       desk rail (glass → glassStrong vs the rail's
                       glassStrong → glassDeep). This builds the natural
                       Discord depth ladder: rail = darkest plate, navigator =
                       mid plate, stage = the lit content beyond. */
                    background: `linear-gradient(180deg, ${AW.glass} 0%, ${AW.glassStrong} 100%)`,
                    backdropFilter: "blur(20px) saturate(150%)",
                    WebkitBackdropFilter: "blur(20px) saturate(150%)",
                  }}
                >
                  {/* ══ PART F — Navigator right edge / seam to stage ══
                        Accent-tinted hairline that pinches to transparent at
                        top & bottom — the exact seam grammar the desk rail
                        uses, never a hard white line. */}
                  <div className="absolute right-0 top-0 bottom-0 w-px pointer-events-none z-10"
                    style={{ background: `linear-gradient(180deg, transparent 0%, ${AW.ruleSoft} 16%, ${AW.rule} 50%, ${AW.ruleSoft} 84%, transparent 100%)` }}
                  />
                  {/* Navigator inner shadow — soft recession against the stage */}
                  <div className="absolute right-0 top-0 bottom-0 w-[8px] pointer-events-none z-10"
                    style={{ background: "linear-gradient(270deg, rgba(0,0,0,0.18) 0%, transparent 100%)" }}
                  />
                  {/* Ambient "desk-lamp" accent glow — the same slow breath the
                      rail carries at its crown, tying the two columns together. */}
                  <motion.div
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-32 pointer-events-none z-0"
                    style={{ background: `radial-gradient(120% 70% at 30% 0%, ${AW.amberWash} 0%, transparent 70%)` }}
                    animate={{ opacity: [0.45, 0.85, 0.45] }}
                    transition={{ duration: 7.3, repeat: Infinity, ease: "easeInOut" }}
                  />

                  {/* ═══ PART C — ROOM COMMAND PLATE · ARCHIO LANGUAGE ═══
                          The active community's identity strip.  Repaved against
                          canonical Archio:
                            · Gradient avatar bubble  → CSSigil (mono initials)
                            · Solid red status pill   → ArchioPulseDot + CmtyEyebrow
                            · Hand-rolled CSS chips   → CmtyEyebrow + AW tokens
                            · Hard border-bottom      → ArchioSeam
                            · Members/Active footnote → CmtyMagnitude pair (lead-bold
                                                        paper / tail-light ash) — same
                                                        treatment as the dossier KPIs */}
                  {(() => {
                    const serverUnread = getServerUnread(currentServer.id)
                    const purpose = getServerPurpose(currentServer.id)
                    const roomActive = getServerActive(currentServer.id)

                    return (
                      <motion.button
                        key={currentServer.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: AW.durContentFade, ease: AW.ease }}
                        whileTap={{ scale: 0.998 }}
                        className="relative w-full text-left group"
                      >
                        {/* Top-edge ArchioSeam · replaces the room-tinted accent
                            line.  Single accent across the entire panel — amber. */}
                        <motion.div
                          key={`accent-${currentServer.id}`}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 0.4, ease: AW.ease }}
                          className="absolute top-0 left-0 right-0 h-px origin-left z-10"
                        >
                          <ArchioSeam accent={AW.amber} shimmer={currentServer.isLive} />
                        </motion.div>

                        {/* Plate surface — FLIGHT DECK RECIPE
                            ════════════════════════════════════════════════════
                            Replaces the avatar-circle + headline-row layout
                            with the cockpit's numbered-lane idiom (mirrors
                            "— 01" / "— 02" lanes in <FlightDeckCockpit/>):

                              • TIER · PURPOSE              ← micro-cap eyebrow
                              ─── 01  ──────────────────    ← em-dash + numeral
                              Server Name [LIVE]            ← humanist headline
                                          1,247 MEMBERS · 12 NEW
                                                            (magnitude meta)

                            Single hairline at top (FD uses hairlines, not
                            ArchioSeam shimmer for plate frames). Bottom seam
                            stays only when the room is live, as a status cue.
                            ��═══════════════════════════════════════════════════ */}
                        <div
                          className="px-3 pt-2.5 pb-2.5 transition-all duration-200 group-hover:bg-white/[0.012] relative"
                        >
                          {/* Bottom hairline — pure rule, no shimmer */}
                          <div
                            className="absolute bottom-0 left-3 right-3 h-px"
                            style={{ background: AW.rule }}
                          />

                          {/* ── Eyebrow row · TIER · PURPOSE ── */}
                          <div className="flex items-center gap-1.5 mb-1.5">
                            {currentServer.isLive ? (
                              <ArchioPulseDot
                                accent={AW.liveRed}
                                size={5}
                                reduced={false}
                              />
                            ) : (
                              <span
                                aria-hidden
                                className="rounded-full"
                                style={{
                                  width: 5,
                                  height: 5,
                                  background: AW.amber,
                                  boxShadow: `0 0 6px ${AW.amberHalo}`,
                                }}
                              />
                            )}
                            <CmtyEyebrow
                              tone={currentServer.isLive ? "live" : "ashSoft"}
                              size={8.5}
                              letter={AW.letterEyebrowPremium}
                              className="truncate"
                            >
                              {currentServer.isLive ? "LIVE" : "ROOM"}
                              <span style={{ color: AW.ashGhost, margin: "0 6px" }}>·</span>
                              {purpose}
                            </CmtyEyebrow>
                          </div>

                          {/* ── Numbered lane — em-dash + 2-digit lane code ──
                              The lane code is the room's ordinal in the user's
                              joined-rooms list, so each plate gets a stable
                              cockpit identifier (01, 02, 03 …). */}
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              aria-hidden
                              className="font-mono"
                              style={{
                                fontSize: 10,
                                letterSpacing: AW.letterEyebrow,
                                color: AW.ashSoft,
                                fontWeight: 500,
                                lineHeight: 1,
                              }}
                            >
                              {`— ${String(
                                Math.max(
                                  1,
                                  SERVERS.findIndex((s) => s.id === currentServer.id) + 1,
                                ),
                              ).padStart(2, "0")}`}
                            </span>
                            <span
                              aria-hidden
                              className="flex-1 h-px"
                              style={{ background: AW.rule }}
                            />
                          </div>

                          {/* ── Humanist headline + chevron ── */}
                          <div className="flex items-start justify-between gap-2">
                            <p
                              className="font-sans truncate min-w-0"
                              style={{
                                fontSize: 15,
                                lineHeight: 1.18,
                                letterSpacing: AW.letterHeadline,
                                fontWeight: 500,
                                color: AW.paper,
                              }}
                            >
                              {currentServer.name}
                              {currentServer.verified && (
                                <span
                                  aria-label="Verified desk"
                                  style={{
                                    fontSize: 10,
                                    color: AW.amber,
                                    marginLeft: 6,
                                    textShadow: `0 0 6px ${AW.amberHalo}`,
                                  }}
                                >
                                  ◇
                                </span>
                              )}
                            </p>
                            <ChevronDown
                              className="w-3 h-3 mt-1 shrink-0 transition-colors duration-150 group-hover:text-[var(--paper)]"
                              style={{ color: AW.ashGhost }}
                            />
                          </div>

                          {/* ── Meta strip — magnitude numerals (FD recipe) ── */}
                          <div className="flex items-center gap-3 mt-2">
                            <CmtyMagnitude
                              value={currentServer.memberCount.toLocaleString()}
                              suffix="MEMBERS"
                              size={11}
                              tone="paper"
                            />
                            {serverUnread > 0 && (
                              <>
                                <span
                                  aria-hidden
                                  className="w-px h-2.5"
                                  style={{ background: AW.rule }}
                                />
                                <CmtyMagnitude
                                  value={String(serverUnread)}
                                  suffix="NEW"
                                  size={11}
                                  tone="paper"
                                />
                              </>
                            )}
                          </div>
                        </div>
                      </motion.button>
                    )
                  })()}

                  {/* ═══════════════════════════════════════════════════════════
                   *  NAVIGATOR — v3 EDITORIAL CALM
                   *
                   *  Total redesign.  The previous iteration was a stack of
                   *  loud chapter markers (CmtyNameplate "──●  LIVE NOW  ●──"),
                   *  multiple ArchioSeam dividers between every section, three
                   *  full-width amber-fading rule headers (ROOM CHANNELS,
                   *  SIGNALS, WAR ROOMS), a heavily-bordered LIVE NOW card with
                   *  a breath animation + radial wash + 3 internal seams, and
                   *  monospace-uppercase chip badges with text-shadow halos on
                   *  every row.  In a 296px column that read as "harsh" — too
                   *  many simultaneous accents fighting for attention.
                   *
                   *  v3 strips it down to FOUR elements:
                   *
                   *    1. ONE compact LIVE NOW card  (avatar + session + JOIN)
                   *    2. ONE channel list           (5 rows, calm sentence-case)
                   *    3. ONE micro-section break    (lowercase italic label,
                   *                                   single dim hairline)
                   *                                  for "signals" + "war rooms"
                   *    4. ONE quiet ghost CTA        ("+ Open war room")
                   *
                   *  No more amber gradient rules.  No more uppercase mono
                   *  eyebrows in the chrome.  No more chip badges with
                   *  text-shadows.  No more breath animations or radial washes.
                   *
                   *  The single amber accent shows up ONLY on the active row,
                   *  the LIVE pulse dot, and the JOIN button — three places
                   *  total, max.  Everything else is paper + ash neutrals.
                   * ═══��═════════════════════════════════════════════════════ */}
                  <ScrollArea className="flex-1 w-full [&>div>div]:!block">
                    <div className="w-[244px] max-w-[244px] px-2.5 pt-3 pb-3">

                      {/* ── LIVE NOW · compact session card ──────────────��─────
                            Single border, single LIVE pulse, single JOIN button.
                            No nameplate header, no breath animation, no chapter
                            mark, no radial wash.  Just a clean session card with
                            mentor avatar + headline + listening count.

                            Active state lights the left bar amber and shifts
                            background to a slight amber tint — same restraint
                            applied to NavRow.
                       ─────────���─────────────────────────────────────────── */}
                      {/* ── LIVE NOW · Macro Alert Sheet recipe ─────────────────
                            Rebuilt to match the Flight Deck's macro alert card:
                              · Eyebrow strip:   `• LIVE NOW · ROOM`  +  `01 EVENT`
                                                 counter, ArchioSeam hairline below.
                              · Body grammar:    LEFT TIME GUTTER (`45m / IN`) →
                                                 amber alert chip (triangle in
                                                 amberWash) → humanist headline
                                                 `NY Session Trading` → soft ash
                                                 subtitle `Mentor Alex`.
                              · Sparkle footer:  Sparkles glyph + LISTENING magnitude
                                                 (847) + chevron, separated from
                                                 body by a second ArchioSeam.
                            Surface is transparent (no glass fill, no border) —
                            only ArchioSeam hairlines bound the card, identical
                            to the macro alert sheet in the cockpit.
                       ───────────────────────────────────────────────────── */}
                      <motion.button
                        whileTap={{ scale: 0.992 }}
                        onClick={() => {
                          setActiveView("live-stage")
                          setActiveWarRoom(null)
                        }}
                        aria-label="Join NY Session Trading with Mentor Alex"
                        aria-current={activeView === "live-stage" ? "true" : undefined}
                        className="group relative w-full text-left focus:outline-none block"
                        style={{
                          padding: 0,
                          background: "transparent",
                          border: "0",
                          transition: "background 200ms ease",
                        }}
                      >
                        {/* Top ArchioSeam — opens the alert chapter */}
                        <div className="relative h-px w-full">
                          <ArchioSeam accent={AW.amber} shimmer />
                        </div>

                        {/* Eyebrow strip · • LIVE NOW · ROOM       01 EVENT */}
                        <div
                          className="flex items-center"
                          style={{
                            paddingTop: 8,
                            paddingBottom: 6,
                            paddingInline: 10,
                            gap: 6,
                          }}
                        >
                          <ArchioPulseDot
                            accent={AW.liveRed}
                            size={4}
                            reduced={false}
                          />
                          <span
                            className="font-mono uppercase"
                            style={{
                              fontSize: 9,
                              letterSpacing: AW.letterEyebrowPremium,
                              fontWeight: 600,
                              color: AW.liveRed,
                              textShadow: `0 0 6px ${AW.liveRedHalo}`,
                            }}
                          >
                            LIVE NOW
                          </span>
                          <span
                            aria-hidden
                            style={{ color: AW.ashGhost, fontSize: 9, lineHeight: 1 }}
                          >
                            ·
                          </span>
                          <span
                            className="font-mono uppercase"
                            style={{
                              fontSize: 9,
                              letterSpacing: AW.letterEyebrow,
                              fontWeight: 500,
                              color: AW.ashSoft,
                            }}
                          >
                            ROOM
                          </span>
                          <span
                            className="ml-auto font-mono uppercase tabular-nums"
                            style={{
                              fontSize: 9,
                              letterSpacing: AW.letterEyebrowPremium,
                              fontWeight: 600,
                              color: AW.paper,
                            }}
                          >
                            01{" "}
                            <span
                              style={{ color: AW.ashGhost, fontWeight: 500 }}
                            >
                              EVENT
                            </span>
                          </span>
                        </div>

                        {/* Body row · time gutter + amber chip + headline ── */}
                        <div
                          className="flex items-start"
                          style={{
                            paddingInline: 10,
                            paddingBottom: 9,
                            gap: 10,
                          }}
                        >
                          {/* LEFT TIME GUTTER — magnitude + suffix caps */}
                          <div
                            className="flex flex-col items-start shrink-0"
                            style={{ minWidth: 36, paddingTop: 1 }}
                          >
                            <span
                              className="font-mono tabular-nums"
                              style={{
                                fontSize: 13,
                                lineHeight: 1,
                                fontWeight: 600,
                                color: AW.paper,
                                letterSpacing: AW.letterNumeric,
                              }}
                            >
                              45m
                            </span>
                            <span
                              className="font-mono uppercase"
                              style={{
                                fontSize: 8,
                                letterSpacing: AW.letterEyebrowPremium,
                                fontWeight: 600,
                                color: AW.ashGhost,
                                marginTop: 2,
                              }}
                            >
                              IN
                            </span>
                          </div>

                          {/* AMBER ALERT CHIP — triangle glyph in amberWash */}
                          <span
                            aria-hidden
                            className="inline-flex items-center justify-center shrink-0"
                            style={{
                              width: 18,
                              height: 18,
                              marginTop: 1,
                              borderRadius: 5,
                              background: AW.amberWash,
                              border: `1px solid ${AW.amberHalo}`,
                            }}
                          >
                            <AlertTriangle
                              className="w-2.5 h-2.5"
                              style={{
                                color: AW.amber,
                                filter: `drop-shadow(0 0 4px ${AW.amberHalo})`,
                              }}
                            />
                          </span>

                          {/* HEADLINE + SUBTITLE */}
                          <div className="flex-1 min-w-0">
                            <p
                              className="font-sans truncate"
                              style={{
                                fontSize: 13.5,
                                lineHeight: 1.2,
                                fontWeight: 500,
                                color: AW.paper,
                                letterSpacing: AW.letterHeadline,
                              }}
                            >
                              NY Session Trading
                            </p>
                            <p
                              className="font-mono uppercase truncate mt-0.5"
                              style={{
                                fontSize: 9,
                                letterSpacing: AW.letterEyebrow,
                                fontWeight: 500,
                                color: AW.ashSoft,
                              }}
                            >
                              MENTOR ALEX · HIGH IMPACT
                            </p>
                          </div>
                        </div>

                        {/* Bottom ArchioSeam — closes the alert chapter */}
                        <div className="relative h-px w-full">
                          <ArchioSeam accent={AW.amber} shimmer={false} />
                        </div>

                        {/* Sparkle footer · LISTENING magnitude + chevron */}
                        <div
                          className="flex items-center"
                          style={{
                            paddingTop: 7,
                            paddingBottom: 8,
                            paddingInline: 10,
                            gap: 6,
                          }}
                        >
                          <Sparkles
                            className="w-3 h-3 shrink-0"
                            style={{
                              color: AW.amber,
                              filter: `drop-shadow(0 0 4px ${AW.amberHalo})`,
                            }}
                          />
                          <span
                            className="font-mono tabular-nums"
                            style={{
                              fontSize: 11,
                              fontWeight: 600,
                              color: AW.paper,
                              letterSpacing: AW.letterNumeric,
                            }}
                          >
                            847
                          </span>
                          <span
                            className="font-mono uppercase"
                            style={{
                              fontSize: 9,
                              letterSpacing: AW.letterEyebrowPremium,
                              fontWeight: 500,
                              color: AW.ashGhost,
                            }}
                          >
                            LISTENING
                          </span>
                          <span
                            className="ml-auto font-mono uppercase"
                            style={{
                              fontSize: 8.5,
                              letterSpacing: AW.letterEyebrowPremium,
                              fontWeight: 600,
                              color:
                                activeView === "live-stage"
                                  ? AW.amber
                                  : AW.ashSoft,
                              transition: "color 200ms ease",
                            }}
                          >
                            JOIN ›
                          </span>
                        </div>
                      </motion.button>

                      {/* ── CHANNELS — FD destination block ────────────────────
                            Five FD-style destination rows.  First row drops its
                            top hairline (showRule=false) since the LIVE NOW
                            card's bottom seam already serves as the opening
                            chapter break.  Each badge gains a suffix-caps
                            qualifier (NEW / OPEN / PRO) following the cockpit
                            magnitude recipe (CmtyMagnitude).
                       ───────────────────────────────────────────────────── */}
                      <div className="mt-3">
                        <NavRow
                          icon={FileText}
                          label="Gameplan"
                          isActive={activeView === "daily-gameplan"}
                          onClick={() => { setActiveView("daily-gameplan"); setActiveWarRoom(null) }}
                          badge="01"
                          badgeSuffix="NEW"
                          badgeTone="amber"
                          showRule={false}
                        />
                        <NavRow
                          icon={Target}
                          label="Entries"
                          isActive={activeView === "entry-room"}
                          onClick={() => { setActiveView("entry-room"); setActiveWarRoom(null) }}
                          badge="03"
                          badgeSuffix="OPEN"
                        />
                        <NavRow
                          icon={Trophy}
                          label="Rankings"
                          isActive={activeView === "leaderboard"}
                          onClick={() => { setActiveView("leaderboard"); setActiveWarRoom(null) }}
                        />
                        <NavRow
                          icon={History}
                          label="Call history"
                          isActive={activeView === "call-history"}
                          onClick={() => { setActiveView("call-history"); setActiveWarRoom(null) }}
                          badge="07"
                          badgeSuffix="LOGGED"
                        />
                        <NavRow
                          icon={BarChart3}
                          label="Dashboard"
                          isActive={activeView === "dashboard"}
                          onClick={() => { setActiveView("dashboard"); setActiveWarRoom(null) }}
                          badge="PRO"
                          badgeTone="amber"
                        />
                      </div>

                      {/* ── SIGNALS — FD eyebrow chapter break ─────────────────
                            New SectionLabel recipe: bullet dot + mono-caps
                            label + count + hairline rule + ordinal suffix.
                            Identical grammar to the cockpit's `• EXECUTION`
                            destination headers.
                       ───────────────────────────────────────────────────── */}
                      <SectionLabel label="SIGNALS" ordinal="01" count={SIGNALS.length} />
                      <div>
                        <NavRow
                          icon={BarChart3}
                          label="Official signals"
                          isActive={activeView === "forecast-feed" && !activeWarRoom}
                          onClick={() => { setActiveView("forecast-feed"); setActiveWarRoom(null) }}
                          badge={String(SIGNALS.length).padStart(2, "0")}
                          badgeSuffix="LIVE"
                          badgeTone="live"
                          showRule={false}
                        />
                      </div>

                      {/* ── WAR ROOMS — FD eyebrow + channel rows ─────────── */}
                      <SectionLabel label="WAR ROOMS" ordinal="02" count={WAR_ROOMS.length} />
                      <div>
                        {WAR_ROOMS.map((room, idx) => {
                          const isActive = activeWarRoom === room.id
                          const isExpiring = room.status === "expiring"
                          return (
                            <button
                              key={room.id}
                              onClick={() => { setActiveView("war-room"); setActiveWarRoom(room.id) }}
                              aria-current={isActive ? "true" : undefined}
                              className="group relative w-full flex items-center text-left focus:outline-none"
                              style={{
                                gap: 9,
                                paddingInline: 10,
                                paddingBlock: 8,
                                borderRadius: 0,
                                background: isActive
                                  ? "rgba(245,158,11,0.04)"
                                  : "transparent",
                                transition: "background 160ms ease",
                              }}
                              onMouseEnter={(e) => {
                                if (!isActive) e.currentTarget.style.background = "rgba(94,234,212,0.022)"
                              }}
                              onMouseLeave={(e) => {
                                if (!isActive) e.currentTarget.style.background = "transparent"
                              }}
                            >
                              {/* Top hairline (skipped on first to avoid
                                  double-rule with SectionLabel) */}
                              {idx > 0 && (
                                <span
                                  aria-hidden
                                  className="absolute left-2 right-2 top-0 h-px pointer-events-none"
                                  style={{ background: AW.rule, opacity: 0.45 }}
                                />
                              )}
                              {/* Active bullet dot */}
                              {isActive && (
                                <motion.span
                                  layoutId="nav-active-bar"
                                  aria-hidden
                                  className="absolute"
                                  style={{
                                    left: 3,
                                    top: "50%",
                                    width: 4,
                                    height: 4,
                                    marginTop: -2,
                                    borderRadius: 999,
                                    background: AW.amber,
                                    boxShadow: `0 0 6px ${AW.amberHalo}, 0 0 1px ${AW.amber}`,
                                  }}
                                  transition={NAV_SPRING}
                                />
                              )}
                              {/* Hash mark — channel grammar */}
                              <Hash
                                className="w-3 h-3 flex-shrink-0"
                                style={{
                                  color: isActive ? AW.amber : AW.ashGhost,
                                  marginLeft: 2,
                                }}
                              />
                              <span
                                className="flex-1 truncate"
                                style={{
                                  fontSize: 12.5,
                                  fontWeight: isActive ? 500 : 400,
                                  letterSpacing: AW.letterHeadline,
                                  color: isActive ? AW.paper : AW.ashSoft,
                                  transition: "color 160ms ease, font-weight 160ms ease",
                                }}
                              >
                                {room.name}
                              </span>
                              {/* Countdown magnitude — live red on expiring */}
                              <span className="flex items-baseline shrink-0" style={{ gap: 3 }}>
                                <span
                                  className="font-mono tabular-nums"
                                  style={{
                                    fontSize: 11,
                                    fontWeight: 600,
                                    letterSpacing: AW.letterNumeric,
                                    color: isExpiring
                                      ? AW.liveRed
                                      : isActive
                                        ? AW.paper
                                        : AW.ashSoft,
                                    textShadow: isExpiring
                                      ? `0 0 6px ${AW.liveRedHalo}`
                                      : "none",
                                    transition: "color 160ms ease",
                                  }}
                                >
                                  {room.expiresIn}
                                </span>
                                <span
                                  className="font-mono uppercase"
                                  style={{
                                    fontSize: 8,
                                    letterSpacing: AW.letterEyebrowPremium,
                                    fontWeight: 600,
                                    color: AW.ashGhost,
                                  }}
                                >
                                  LEFT
                                </span>
                              </span>
                            </button>
                          )
                        })}

                        {/* ── DEPLOY CTA · FD destination row recipe ──────────
                              Reskinned as a Flight-Deck destination row: top
                              hairline opens the chapter, plus-glyph gutter
                              icon, mono-caps `DEPLOY · WAR ROOM` label paired
                              with humanist subtitle, right-aligned `LOCKED`
                              magnitude with crown glyph.  No border, no shine
                              sweep, no fill — only a teal hover wash, matching
                              every other FD destination row.
                         ─────────────────────────────────────────────────── */}
                        <TooltipProvider delayDuration={150}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => setShowDeployModal(true)}
                                className="group relative w-full flex items-center focus:outline-none"
                                style={{
                                  gap: 9,
                                  paddingInline: 10,
                                  paddingBlock: 9,
                                  marginTop: 0,
                                  borderRadius: 0,
                                  background: "transparent",
                                  transition: "background 160ms ease",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = "rgba(245,158,11,0.04)"
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = "transparent"
                                }}
                              >
                                {/* Top hairline — opens the chapter */}
                                <span
                                  aria-hidden
                                  className="absolute left-2 right-2 top-0 h-px pointer-events-none"
                                  style={{ background: AW.rule, opacity: 0.45 }}
                                />
                                <Plus
                                  className="w-3 h-3 flex-shrink-0"
                                  style={{ color: AW.ashGhost, marginLeft: 2 }}
                                />
                                <div className="flex-1 min-w-0 flex flex-col items-start">
                                  <span
                                    className="font-mono uppercase truncate"
                                    style={{
                                      fontSize: 9,
                                      letterSpacing: AW.letterEyebrowPremium,
                                      fontWeight: 600,
                                      color: AW.amber,
                                      lineHeight: 1.05,
                                      textShadow: `0 0 6px ${AW.amberHalo}`,
                                    }}
                                  >
                                    DEPLOY
                                  </span>
                                  <span
                                    className="truncate"
                                    style={{
                                      fontSize: 12,
                                      fontWeight: 400,
                                      letterSpacing: AW.letterHeadline,
                                      color: AW.ashSoft,
                                      lineHeight: 1.3,
                                      marginTop: 1,
                                    }}
                                  >
                                    Open a war room
                                  </span>
                                </div>
                                <span
                                  className="flex items-baseline shrink-0"
                                  style={{ gap: 3 }}
                                >
                                  <Crown
                                    className="w-2.5 h-2.5 flex-shrink-0"
                                    style={{
                                      color: AW.amber,
                                      filter: `drop-shadow(0 0 4px ${AW.amberHalo})`,
                                      marginRight: 2,
                                    }}
                                  />
                                  <span
                                    className="font-mono uppercase"
                                    style={{
                                      fontSize: 8.5,
                                      letterSpacing: AW.letterEyebrowPremium,
                                      fontWeight: 600,
                                      color: AW.ashSoft,
                                    }}
                                  >
                                    LOCKED
                                  </span>
                                </span>
                              </button>
                            </TooltipTrigger>
                            <TooltipContent
                              side="right"
                              sideOffset={8}
                              className="rounded-md"
                              style={{
                                background: "rgba(15,17,25,0.96)",
                                border: "1px solid rgba(255,255,255,0.06)",
                                padding: "8px 10px",
                                backdropFilter: "blur(16px)",
                                WebkitBackdropFilter: "blur(16px)",
                              }}
                            >
                              <div className="flex items-center" style={{ gap: 8 }}>
                                <Crown
                                  className="w-3 h-3"
                                  style={{ color: AW.amber }}
                                />
                                <span
                                  style={{
                                    fontSize: 11,
                                    color: AW.paperDim,
                                    letterSpacing: AW.letterBody,
                                    fontWeight: 400,
                                  }}
                                >
                                  High-accuracy traders only
                                </span>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </ScrollArea>

                  {/* ╔══════════════════════════════════════════════════════════╗ */}
                  {/* ║  USER DOCK — FLIGHT-DECK FOOTER-PILLAR LANGUAGE          ║ */}
                  {/* ║                                                          ║ */}
                  {/* ║  Replaces the rounded-card user panel with the cockpit's ║ */}
                  {/* ║  bottom-pillar grammar.  Anatomy:                        ║ */}
                  {/* ║                                                          ║ */}
                  {/* ║    ──────────────────────────────────────────���────────  ║ */}
                  {/* ║    • OPERATOR ─ TIER · CALLS                  UTC 14:32 ║ */}
                  {/* ║    [Σ]  You              Win-rate    PnL    Settings    ║ */}
                  {/* ║         ONLINE · 3 OPEN  72.4%       +8.4%             ║ */}
                  {/* ║    ───────────────────────────────────────────────────  ║ */}
                  {/* ║                                                          ║ */}
                  {/* ║  · ArchioSeam top edge  → opens the dock chapter         ║ */}
                  {/* ║  · Eyebrow strip        → mono-caps + UTC tick           ║ */}
                  {/* ║  · CSSigil (square 32)  → unchanged identity glyph       ║ */}
                  {/* ║  · Magnitude pair       → win-rate · PnL, FD recipe      ║ */}
                  {/* ║  · No fill, no radius   → matches every other pillar    ║ */}
                  {/* ╚══════════════════════════════════════════════════════════╝ */}
                  <div
                    className="relative"
                    style={{
                      paddingInline: 10,
                      paddingTop: 7,
                      paddingBottom: 8,
                      background: "rgba(0,0,0,0.18)",
                    }}
                  >
                    {/* Top ArchioSeam — opens the dock as a chapter */}
                    <div className="absolute top-0 left-0 right-0 h-px">
                      <ArchioSeam accent={AW.amber} shimmer={false} />
                    </div>

                    {/* ── Eyebrow strip · OPERATOR · TIER · CALLS · UTC ── */}
                    <div className="flex items-center" style={{ gap: 6, marginBottom: 7 }}>
                      <span
                        aria-hidden
                        className="rounded-full shrink-0"
                        style={{
                          width: 4,
                          height: 4,
                          background: AW.amber,
                          boxShadow: `0 0 6px ${AW.amberHalo}`,
                        }}
                      />
                      <CmtyEyebrow
                        tone="paper"
                        size={9}
                        letter={AW.letterEyebrowPremium}
                        className="shrink-0"
                      >
                        OPERATOR
                      </CmtyEyebrow>
                      <span style={{ color: AW.ashGhost, fontSize: 9 }}>·</span>
                      <CmtyEyebrow
                        tone="ashSoft"
                        size={9}
                        letter={AW.letterEyebrowPremium}
                        className="shrink-0"
                      >
                        TIER 02 · 03 OPEN
                      </CmtyEyebrow>
                      <span
                        aria-hidden
                        className="flex-1 h-px"
                        style={{ background: AW.rule, opacity: 0.5 }}
                      />
                      <span
                        className="font-mono tabular-nums shrink-0"
                        style={{
                          fontSize: 9,
                          letterSpacing: AW.letterEyebrowPremium,
                          fontWeight: 500,
                          color: AW.ashGhost,
                        }}
                      >
                        UTC 14:32
                      </span>
                    </div>

                    {/* ── Operator row — sigil + identity + magnitudes ── */}
                    <button
                      onClick={() => setShowMemberProfile(true)}
                      className="group w-full flex items-center text-left transition-colors duration-150"
                      style={{
                        gap: 9,
                        paddingInline: 0,
                        paddingBlock: 2,
                        background: "transparent",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(94,234,212,0.025)"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent"
                      }}
                    >
                      <div className="relative shrink-0">
                        <CSSigil initials="Y" active={false} size={32} />
                        <span className="absolute -bottom-0.5 -right-0.5">
                          <ArchioPulseDot
                            accent={AW.liveRed}
                            size={5}
                            reduced={false}
                          />
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="font-sans truncate"
                          style={{
                            fontSize: 12,
                            letterSpacing: AW.letterHeadline,
                            color: AW.paper,
                            fontWeight: 500,
                            lineHeight: 1.15,
                          }}
                        >
                          You
                        </p>
                        <CmtyEyebrow
                          tone="ashSoft"
                          size={8.5}
                          letter={AW.letterEyebrowPremium}
                        >
                          ONLINE · LANE 02
                        </CmtyEyebrow>
                      </div>

                      {/* Magnitude pair · win-rate / PnL — FD recipe */}
                      <div
                        className="flex flex-col items-end shrink-0"
                        style={{ gap: 1 }}
                      >
                        <div className="flex items-baseline" style={{ gap: 3 }}>
                          <span
                            className="font-mono tabular-nums"
                            style={{
                              fontSize: 12,
                              fontWeight: 600,
                              letterSpacing: AW.letterNumeric,
                              color: AW.paper,
                              lineHeight: 1,
                            }}
                          >
                            72.4
                          </span>
                          <span
                            className="font-mono uppercase"
                            style={{
                              fontSize: 8,
                              letterSpacing: AW.letterEyebrowPremium,
                              fontWeight: 600,
                              color: AW.ashGhost,
                            }}
                          >
                            % WIN
                          </span>
                        </div>
                        <div className="flex items-baseline" style={{ gap: 3 }}>
                          <span
                            className="font-mono tabular-nums"
                            style={{
                              fontSize: 10.5,
                              fontWeight: 600,
                              letterSpacing: AW.letterNumeric,
                              color: AW.amber,
                              textShadow: `0 0 6px ${AW.amberHalo}`,
                              lineHeight: 1,
                            }}
                          >
                            +8.4
                          </span>
                          <span
                            className="font-mono uppercase"
                            style={{
                              fontSize: 8,
                              letterSpacing: AW.letterEyebrowPremium,
                              fontWeight: 600,
                              color: AW.ashGhost,
                            }}
                          >
                            % PNL
                          </span>
                        </div>
                      </div>

                      <Settings
                        className="w-3.5 h-3.5 transition-colors duration-150 shrink-0"
                        style={{ color: AW.ashGhost, marginLeft: 4 }}
                      />
                    </button>
                  </div>
                </motion.div>

                {/* ══ PART E — Column 3: Active Stage ══ */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.14, ease: EASE_PREMIUM }}
                  className="flex-1 min-w-0 flex flex-col overflow-hidden relative"
                  style={{ background: "linear-gradient(180deg, #0a0b10 0%, #090a0e 100%)" }}
                >
                  {/* Stage top inset shadow — creates depth recession */}
                  <div className="absolute top-0 left-0 right-0 h-[3px] pointer-events-none z-10"
                    style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, transparent 100%)" }}
                  />

                  {/* Stage left inset shadow — creates depth from navigator seam */}
                  <div className="absolute left-0 top-0 bottom-0 w-[4px] pointer-events-none z-10"
                    style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.1) 0%, transparent 100%)" }}
                  />

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeWarRoom || activeView}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -3 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="flex-1 flex flex-col min-h-0 relative"
                    >
                      {/* ── FD Cartouche shell — right-pane wrapper ──────────
                            Wraps every right-pane template (Forecast Feed,
                            Daily Gameplan, Entry Room, Leaderboard, Call
                            History, Dashboard, Live Stage) in the same
                            cockpit cartouche.  The shell contributes:
                              · faint dot-grid background — matches the
                                Flight Deck viewport texture.
                              · top ArchioSeam — opens the chapter, shimmer
                                only when something in the panel is live.
                              · top eyebrow strip — `• ROOM · <TEMPLATE>` +
                                right-aligned UTC tick, identical recipe to
                                the cockpit destination header.
                            War-room chat owns its custom chrome below this
                            band, so the shell appears as a continuation of
                            the Flight Deck, not a foreign panel.
                       ───────────────────────────────────────────────────── */}
                      {activeView !== "war-room" && (() => {
                        const tpl =
                          activeView === "live-stage"     ? { eyebrow: "MENTOR STAGE",       num: "01" } :
                          activeView === "forecast-feed"  ? { eyebrow: "FORECAST · SIGNALS", num: "02" } :
                          activeView === "daily-gameplan" ? { eyebrow: "DAILY GAMEPLAN",     num: "03" } :
                          activeView === "entry-room"     ? { eyebrow: "ENTRY ROOM",         num: "04" } :
                          activeView === "leaderboard"    ? { eyebrow: "LEADERBOARD",        num: "05" } :
                          activeView === "call-history"   ? { eyebrow: "CALL HISTORY",       num: "06" } :
                          activeView === "dashboard"      ? { eyebrow: "LIVE DASHBOARD",     num: "07" } :
                                                            { eyebrow: "FORECAST · ROOM",    num: "00" }
                        return (
                          <>
                            {/* Faint dot-grid backdrop · matches FD viewport */}
                            <div
                              aria-hidden
                              className="absolute inset-0 pointer-events-none"
                              style={{
                                backgroundImage:
                                  `radial-gradient(${AW.rule} 0.6px, transparent 0.6px)`,
                                backgroundSize: "16px 16px",
                                opacity: 0.4,
                                maskImage:
                                  "radial-gradient(120% 80% at 50% 0%, #000 30%, transparent 75%)",
                                WebkitMaskImage:
                                  "radial-gradient(120% 80% at 50% 0%, #000 30%, transparent 75%)",
                              }}
                            />
                            {/* Top ArchioSeam — opens the cartouche chapter */}
                            <div className="relative h-px w-full pointer-events-none">
                              <ArchioSeam
                                accent={AW.amber}
                                shimmer={liveServerCount > 0}
                              />
                            </div>
                            {/* Eyebrow strip · • ROOM · <TEMPLATE>      — NN */}
                            <div
                              className="relative flex items-center"
                              style={{
                                paddingTop: 6,
                                paddingBottom: 6,
                                paddingInline: 14,
                                gap: 6,
                              }}
                            >
                              <span
                                aria-hidden
                                className="rounded-full"
                                style={{
                                  width: 4,
                                  height: 4,
                                  background: AW.amber,
                                  boxShadow: `0 0 6px ${AW.amberHalo}`,
                                }}
                              />
                              <span
                                className="font-mono uppercase"
                                style={{
                                  fontSize: 9,
                                  letterSpacing: AW.letterEyebrowPremium,
                                  fontWeight: 600,
                                  color: AW.ashSoft,
                                }}
                              >
                                ROOM
                              </span>
                              <span
                                aria-hidden
                                style={{ color: AW.ashGhost, fontSize: 9, lineHeight: 1 }}
                              >
                                ·
                              </span>
                              <span
                                className="font-mono uppercase"
                                style={{
                                  fontSize: 9,
                                  letterSpacing: AW.letterEyebrowPremium,
                                  fontWeight: 600,
                                  color: AW.paper,
                                }}
                              >
                                {tpl.eyebrow}
                              </span>
                              <span
                                aria-hidden
                                className="flex-1 h-px"
                                style={{ background: AW.rule, opacity: 0.6 }}
                              />
                              <span
                                className="font-mono uppercase tabular-nums"
                                style={{
                                  fontSize: 9,
                                  letterSpacing: AW.letterEyebrowPremium,
                                  fontWeight: 600,
                                  color: AW.ashGhost,
                                }}
                              >
                                — {tpl.num}
                              </span>
                            </div>
                            {/* Closing hairline rule */}
                            <span
                              aria-hidden
                              className="block h-px w-full pointer-events-none"
                              style={{ background: AW.rule, opacity: 0.55 }}
                            />
                          </>
                        )
                      })()}

                      <div className="flex-1 flex flex-col min-h-0 relative">
                        {renderMainView()}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* Member Profile Modal */}
              <MemberProfile isOpen={showMemberProfile} onClose={() => setShowMemberProfile(false)} />

              <AnimatePresence>
                {showDeployModal && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowDeployModal(false)}
                      className="absolute inset-0 bg-black/60 backdrop-blur-sm z-30"
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 20 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] rounded-xl shadow-2xl z-40 overflow-hidden"
                      style={{ background: "#111318", border: "1px solid rgba(245,158,11,0.15)" }}
                    >
                      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-gradient-to-r from-amber-500/10 to-transparent">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                            <Zap className="w-5 h-5 text-amber-400" />
                          </div>
                          <div>
                            <h2 className="text-lg font-semibold text-white">Deploy War Room</h2>
                            <p className="text-[10px] text-slate-400">Launch a temporary strike channel</p>
                          </div>
                        </div>
                        <button onClick={() => setShowDeployModal(false)} className="p-1 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="p-5 space-y-5">
                        <div className="space-y-2">
                          <Label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Trade Idea / Ticker</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400"><Hash className="w-4 h-4" /></span>
                            <Input value={warRoomTicker} onChange={(e) => setWarRoomTicker(e.target.value.toLowerCase().replace(/\s+/g, "-"))} placeholder="shorting-es-at-4150" className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-amber-500/50" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Duration</Label>
                          <Select value={warRoomDuration} onValueChange={setWarRoomDuration}>
                            <SelectTrigger className="w-full bg-white/5 border-white/10 text-white focus:border-amber-500/50"><SelectValue /></SelectTrigger>
                            <SelectContent className="bg-[#111318] border-white/10">
                              <SelectItem value="1h" className="text-white focus:bg-amber-500/20">1 Hour</SelectItem>
                              <SelectItem value="4h" className="text-white focus:bg-amber-500/20">4 Hours</SelectItem>
                              <SelectItem value="24h" className="text-white focus:bg-amber-500/20">24 Hours</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-[10px] text-slate-500 flex items-center gap-1.5 px-1"><Timer className="w-3 h-3 text-amber-400" />This channel will auto-archive when the timer expires.</p>
                        </div>
                        {warRoomTicker && (
                          <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                            <p className="text-[10px] text-slate-400 mb-1.5">Channel Preview</p>
                            <div className="flex items-center gap-2">
                              <Hash className="w-4 h-4 text-amber-400" />
                              <span className="text-sm font-medium text-white">{warRoomTicker}</span>
                              <Timer className="w-3.5 h-3.5 text-amber-400 ml-auto" />
                              <span className="text-xs text-amber-400">{warRoomDuration}</span>
                            </div>
                          </motion.div>
                        )}
                      </div>
                      <div className="flex items-center gap-3 px-5 py-4 border-t border-white/5 bg-black/20">
                        <Button variant="ghost" onClick={() => setShowDeployModal(false)} className="flex-1 text-slate-400 hover:text-white hover:bg-white/5">Cancel</Button>
                        <Button onClick={handleDeployWarRoom} disabled={!warRoomTicker} className="flex-1 bg-amber-500 hover:bg-amber-600 text-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
                          <Zap className="w-4 h-4 mr-1.5" />Deploy
                        </Button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
