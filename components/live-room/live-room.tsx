"use client"

/**
 * LIVE ROOM — composition (Masterplan II · the workspace)
 *
 *   RoomHeader
 *   └─ Workspace
 *      ├─ INSPECTOR  deck of 8 keys · ONE card (mentor | instrument | tool)
 *      ┃  draggable vertical divider
 *      └─ STAGE      screen hero (chart fills) ━ draggable ━ talk dock (collapsible)
 *
 * The room never scrolls. Only the inspector's card and the talk feed scroll
 * inside themselves. Below 880px of container width the inspector becomes a
 * 44px rail + a slide-over drawer. Layout is driven by CSS container queries
 * on the room root and the panes, so the room adapts to whatever width the
 * shell gives it — never to the window.
 */

import * as React from "react"
import { LR } from "./live-room-tokens"
import { SessionProvider } from "./session-store"
import { RoomHeader } from "./room-header"
import { WorkspaceRoot, Workspace } from "./workspace"
import { InspectorPane } from "./inspector"
import { InstrumentRail, InspectorDrawer } from "./inspector-drawer"
import { StageScreen } from "./stage-screen"
import { StageDiscussion, TalkHandle } from "./stage-discussion"

const CSS = `
.lr-root{container-type:inline-size;container-name:lr}
.lr-scroll-x{scrollbar-width:none}
.lr-scroll-x::-webkit-scrollbar{display:none}
.lr-feed{scrollbar-width:thin;scrollbar-color:${LR.chipBorder} transparent}
.lr-feed::-webkit-scrollbar{width:5px;height:5px}
.lr-feed::-webkit-scrollbar-thumb{background:${LR.chipBorder};border-radius:999px}
.lr-lens-grid{grid-template-columns:minmax(0,1fr)}
.lr-wells{grid-template-columns:minmax(0,1fr)}
.lr-spine-grid{grid-template-columns:minmax(0,1fr);gap:4px}
.lr-spine-grid[data-rail] .lr-node-tile{min-height:0}
.lr-dossier-grid{grid-template-columns:minmax(0,1fr)}
@container (min-width:640px){.lr-spine-grid{grid-template-columns:repeat(7,minmax(0,1fr));gap:8px}.lr-dossier-grid{grid-template-columns:minmax(0,1.15fr) minmax(0,1fr)}}
.lr-corners{display:none}
.lr-hide-xs{display:none!important}
.lr-hide-md{display:none!important}
.lr-instruments{display:none}
.lr-gutter{width:36px!important}
.lr-tick,.lr-hint{display:none}
@container (min-width:480px){
  .lr-lens-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
  .lr-wells{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@container (min-width:540px){
  .lr-tick,.lr-hint{display:inline-flex}
}
@container lr (min-width:640px){
  .lr-corners{display:contents}
  .lr-hide-xs{display:inline-flex!important}
  .lr-instruments{display:inline-flex}
  .lr-gutter{width:44px!important}
}
@container lr (min-width:1280px){
  .lr-hide-md{display:inline-flex!important}
}
/* the inspector's card is narrow by design — no corner brackets in it */
.lr-inspector-stage .lr-corners{display:none}
/* screen header — the panel is its own container; readouts return as it widens.
   Under 520px the eyebrow + LIVE chip step aside (the transport bar already says LIVE). */
.lr-scr-hl,.lr-scr-ct{display:none!important}
@container (min-width:720px){.lr-scr-hl{display:inline-flex!important}}
@container (min-width:880px){.lr-scr-ct{display:inline-flex!important}}
@container (max-width:519px){.lr-scr-eyebrow,.lr-scr-dash,.lr-scr-live{display:none!important}}
@media (prefers-reduced-motion:reduce){
  .lr-root *{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}
}
`

export interface LiveRoomProps {
  messageInput?: string
  setMessageInput?: (v: string) => void
  onSendMessage?: () => void
  onLeave?: () => void
  /** theater mode — the shell has folded its own chrome around the room */
  theater?: boolean
  onToggleTheater?: () => void
  className?: string
}

export function LiveRoom({ messageInput, setMessageInput, onSendMessage, onLeave, theater, onToggleTheater, className = "" }: LiveRoomProps) {
  return (
    <SessionProvider>
      <WorkspaceRoot
        className={`flex-1 ${className}`}
        style={{ background: LR.veil.bg, backdropFilter: LR.veil.blur, WebkitBackdropFilter: LR.veil.blur }}
      >
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <RoomHeader onLeave={onLeave} theater={theater} onToggleTheater={onToggleTheater} />
        <Workspace
          inspector={<InspectorPane />}
          rail={<InstrumentRail />}
          screen={<StageScreen />}
          talk={<StageDiscussion dock messageInput={messageInput} setMessageInput={setMessageInput} onSendMessage={onSendMessage} />}
          talkHandle={<TalkHandle />}
        />
        <InspectorDrawer />
      </WorkspaceRoot>
    </SessionProvider>
  )
}

export default LiveRoom
