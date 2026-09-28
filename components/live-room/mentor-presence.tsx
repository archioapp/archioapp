"use client"

import * as React from "react"
import { Crown, Mic, Star, Bookmark } from "lucide-react"
import { TinySparkline } from "@/components/dashboard/vantary/cartouche/gadget-primitives"
import { useThemeAccent } from "@/components/vantary-glass"
import { LR, lrMix } from "./live-room-tokens"
import { LrPane, LrEyebrow, LrStat, LrCoin, LrGhostButton, LrLiveDot, LrSheen, LrBubbles, useReducedMotion } from "./live-room-primitives"
import { useSession } from "./session-store"
import { MENTOR, AUDIENCE } from "./session-state"

export function MentorPresence({ delay = 0 }: { delay?: number }) {
  const s = useSession()
  const reduce = useReducedMotion()
  const { primary } = useThemeAccent()
  const [hover, setHover] = React.useState(false)

  return (
    <LrPane labelledBy="lr-mentor-title" delay={delay} lift onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      {!reduce && hover && <LrSheen id="mentor" />}
      {!reduce && hover && <LrBubbles id="mentor" />}

      <div className="relative z-[2] flex flex-col gap-4 p-4">
        {/* identity row */}
        <div className="flex items-start gap-3 min-w-0">
          <span className="relative shrink-0">
            <LrCoin initials={MENTOR.initials} size={44} radius={14} ring />
            <span
              className="absolute -bottom-1 -right-1 inline-flex items-center justify-center rounded-full"
              style={{ width: 16, height: 16, background: LR.primaryInk, border: `1px solid ${lrMix(LR.down, 0.4)}` }}
              title="Speaking"
            >
              <Mic size={8} style={{ color: LR.down }} />
            </span>
          </span>

          <div className="flex-1 min-w-0 flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <h3 id="lr-mentor-title" className="font-sans truncate" style={{ fontSize: 16, fontWeight: 600, color: LR.paper, letterSpacing: "-0.01em", lineHeight: 1.2 }}>
                {MENTOR.name}
              </h3>
              <Crown size={12} style={{ color: LR.primary }} aria-label="Top mentor" />
              <LrLiveDot tone="up" size={5} />
            </div>
            <span className="font-sans truncate" style={{ fontSize: 11, color: LR.ashSoft }}>{MENTOR.title}</span>
            <span className="font-mono uppercase truncate" style={{ fontSize: 9, letterSpacing: "0.16em", color: LR.primary, opacity: 0.85, marginTop: 2 }}>
              {MENTOR.status}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <LrGhostButton label={s.following ? "Unfollow mentor" : "Follow mentor"} active={s.following} onClick={() => s.dispatch({ type: "toggle", key: "following" })} size={30}>
              <Star size={13} fill={s.following ? "currentColor" : "none"} />
            </LrGhostButton>
            <LrGhostButton label={s.bookmarked ? "Remove bookmark" : "Bookmark session"} active={s.bookmarked} onClick={() => s.dispatch({ type: "toggle", key: "bookmarked" })} size={30}>
              <Bookmark size={13} fill={s.bookmarked ? "currentColor" : "none"} />
            </LrGhostButton>
          </div>
        </div>

        {/* stats */}
        <div className="grid grid-cols-3 gap-3">
          <LrStat label="Win rate" value={`${MENTOR.winRate}%`} tone="paper" sub={`${MENTOR.streak} streak`} />
          <LrStat label="Accuracy" value={`${MENTOR.accuracy}%`} tone="paper" sub={`${MENTOR.sessions} sessions`} />
          <LrStat label="P&L" value={MENTOR.pnl} tone="up" sub="verified" />
        </div>

        {/* presence strip */}
        <div className="flex items-center gap-3 pt-3 min-w-0" style={{ borderTop: `1px solid ${LR.recess.border}` }}>
          <span className="inline-flex items-center shrink-0" aria-label={`${AUDIENCE.total} listening`}>
            {AUDIENCE.coins.map((c, i) => (
              <span key={c.initials} style={{ marginLeft: i === 0 ? 0 : -7, zIndex: 4 - i }} title={c.name}>
                <LrCoin initials={c.initials} size={22} radius={999} style={{ boxShadow: `0 0 0 2px ${LR.primaryInk}` }} />
              </span>
            ))}
          </span>
          <span className="font-mono tabular-nums shrink-0" style={{ fontSize: 12, color: LR.paper }}>{AUDIENCE.total}</span>
          <LrEyebrow size={9} weight={500} className="shrink-0">{AUDIENCE.active} active</LrEyebrow>
          <span className="flex-1 min-w-3" />
          <span className="shrink-0 hidden sm:block" aria-hidden>
            <TinySparkline data={AUDIENCE.pulse} width={72} height={18} accent={primary} showRidingDot scanSweep={false} />
          </span>
          <LrEyebrow tone="primary" size={9} className="shrink-0">{AUDIENCE.level}</LrEyebrow>
        </div>
      </div>
    </LrPane>
  )
}
