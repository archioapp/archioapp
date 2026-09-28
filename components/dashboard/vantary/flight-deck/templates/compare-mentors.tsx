"use client"

/* ═════════════════════════════════════════════════════════════════════════
   <CompareMentorsTemplate />

   The marquee template of the Universal Template Engine. Mentor Hall →
   Compare Mentors. The decision-support surface for choosing whose
   process should influence the trader's process.

   This template is the reference implementation for every other
   destination. It defines the language and rhythm that the other
   fifteen destinations will adopt: picker → presets → mission briefing
   → eight-axis telemetry quad → three advisory sheets (PRIMARY · RISK ·
   OPPORTUNITY) → schedule matrix of last-ten trades head to head →
   destination bay → drill-forward rail.

   Reads from compareMentors() in oracle-data.ts. Pure render — every
   number, advantage, tradeoff, and warning is derived deterministically
   from the two MentorProfile inputs. Same A vs B always produces the
   same advisory copy. Different mentors produce structurally different
   advisories because the helper inspects the actual telemetry.

   The template wraps every interactive surface in motion + EASE_V
   curves and the doctrine glass treatment. Risk advisory pre-opens by
   default; primary advisory pre-opens by default; opportunity
   collapses by default — same convention as the Oracle answer surface.
   ═════════════════════════════════════════════════════════════════════════ */

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Users,
  Sparkles,
  ArrowLeftRight,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  CircleSlash,
  AlertTriangle,
  Lightbulb,
  X,
  PlayCircle,
  CalendarDays,
  PlusCircle,
} from "lucide-react"

import { VANTARY, EASE_V } from "../../vantary-theme"
import {
  MENTORS,
  findMentorById,
  compareMentors,
  type MentorProfile,
  type MentorComparison,
  type MentorAxisComparison,
  type MentorTradeRecord,
} from "../../oracle-data"
import {
  FdCorners,
  FdDashedRule,
  FdRouteId,
  FdRangeRing,
  FdMagnitude,
} from "../flight-deck-primitives"
import { TemplateShell } from "../template-shell"
import type { DrillForwardSuggestion } from "../template-types"

/* ── Public API ─────────────────────────────────────────────────────── */

export interface CompareMentorsTemplateProps {
  /** Pre-selected mentor A (e.g. from a click path). */
  initialMentorAId?: string
  /** Pre-selected mentor B (e.g. from a click path). */
  initialMentorBId?: string
  /** Optional resolver hint when only one mentor was named in NL path. */
  resolverNote?: string
  /** Echo of the raw natural-language query if relevant. */
  rawQuery?: string
  /** Close handler. */
  onClose?: () => void
  /** Pin handler. */
  onPin?: () => void
  /** Whether template is currently pinned. */
  pinned?: boolean
}

export function CompareMentorsTemplate({
  initialMentorAId,
  initialMentorBId,
  resolverNote,
  rawQuery,
  onClose,
  onPin,
  pinned = false,
}: CompareMentorsTemplateProps) {
  // Default mentor A to the user's most-followed if none specified.
  const defaultA = React.useMemo(
    () => MENTORS.find((m) => m.followed) ?? MENTORS[0],
    [],
  )

  const [mentorAId, setMentorAId] = React.useState<string | undefined>(
    initialMentorAId ?? defaultA.id,
  )
  const [mentorBId, setMentorBId] = React.useState<string | undefined>(initialMentorBId)
  const [pickerSlot, setPickerSlot] = React.useState<"A" | "B" | null>(
    initialMentorBId ? null : "B",
  )

  React.useEffect(() => {
    if (initialMentorAId) setMentorAId(initialMentorAId)
    if (initialMentorBId) {
      setMentorBId(initialMentorBId)
      setPickerSlot(null)
    }
  }, [initialMentorAId, initialMentorBId])

  const mentorA = findMentorById(mentorAId)
  const mentorB = findMentorById(mentorBId)
  const ready = !!(mentorA && mentorB)

  const comparison: MentorComparison | null = React.useMemo(() => {
    if (!mentorA || !mentorB) return null
    return compareMentors(mentorA, mentorB)
  }, [mentorA, mentorB])

  const swap = React.useCallback(() => {
    setMentorAId((a) => {
      const newA = mentorBId
      setMentorBId(a)
      return newA
    })
  }, [mentorBId])

  const drillers: DrillForwardSuggestion[] = React.useMemo(() => {
    if (!comparison) return []
    const arr: DrillForwardSuggestion[] = [
      {
        id: "drill.both-vs-me",
        routeId: "D01",
        label: "Compare both to me",
        hint: "Holds your live performance against both mentors.",
        urgency: "medium",
      },
      {
        id: "drill.where-disagree",
        routeId: "D02",
        label: "Show me where they disagree",
        hint: "Filters their last 50 calls to only the divergent ones.",
        urgency: "medium",
      },
    ]
    if (comparison.nextBestFitMentorId) {
      const nextBest = findMentorById(comparison.nextBestFitMentorId)
      if (nextBest) {
        arr.push({
          id: "drill.swap-next-best",
          routeId: "D03",
          label: `Swap ${comparison.mentorA.name.split(" ")[0]} for ${nextBest.name.split(" ")[0]}`,
          hint: "Closest behavioural fit excluding the current pair.",
          urgency: "low",
          onSelect: () => setMentorAId(nextBest.id),
        })
      }
    }
    arr.push({
      id: "drill.replay-last-five",
      routeId: "D04",
      label: `Replay ${comparison.mentorB.name.split(" ")[0]}'s last 5 calls`,
      hint: "Walks the last five entries with rationale.",
      urgency: "low",
    })
    arr.push({
      id: "drill.subscribe-to-b",
      routeId: "D05",
      label: comparison.mentorB.followed
        ? `Add ${comparison.mentorB.name.split(" ")[0]} to your group`
        : `Follow ${comparison.mentorB.name.split(" ")[0]}`,
      hint: "Adds them to your daily mentor feed.",
      urgency: "low",
    })
    return arr
  }, [comparison])

  // Eyebrow + headline derived from selection state.
  const eyebrow = ready
    ? "MENTOR HALL · COMPARE · LIVE"
    : "MENTOR HALL · COMPARE · STAGING"
  const headline = ready
    ? comparison!.headline
    : "Compare two mentors side by side."
  const subheadline = ready
    ? `${comparison!.mentorA.name} ${"\u2194"} ${comparison!.mentorB.name}. Process, telemetry, and tradeoffs.`
    : "Pick two mentors. The eight-axis telemetry, advisories, and last-ten trades render side by side."

  return (
    <TemplateShell
      id="mentors.compare-mentors"
      eyebrow={eyebrow}
      routeId="T-09"
      headline={headline}
      subheadline={subheadline}
      prelude={
        rawQuery ? (
          <span>
            <span style={{ color: VANTARY.ashSoft }}>You asked: </span>
            <span style={{ color: VANTARY.paper, fontStyle: "italic" }}>
              {"\u201C"}
              {rawQuery}
              {"\u201D"}
            </span>
            {resolverNote && (
              <>
                <br />
                <span style={{ color: VANTARY.amber }}>{resolverNote}</span>
              </>
            )}
          </span>
        ) : (
          <span>
            Choose two mentors and the surface paints their session window, style,
            instruments, win rate, average R, frequency, governance, and temperament
            on the same canvas — plus their last ten trades, side by side.
          </span>
        )
      }
      sources={["MentorVault", "ProofOfEdge", "BrokerLedger"]}
      lastRefreshed="just now"
      onClose={onClose}
      onPin={onPin}
      pinned={pinned}
      inputs={
        <MentorPicker
          mentorA={mentorA}
          mentorB={mentorB}
          activeSlot={pickerSlot}
          onActivateSlot={setPickerSlot}
          onPickA={(id) => {
            setMentorAId(id)
            if (!mentorBId) setPickerSlot("B")
            else setPickerSlot(null)
          }}
          onPickB={(id) => {
            setMentorBId(id)
            setPickerSlot(null)
          }}
          onClearA={() => setMentorAId(undefined)}
          onClearB={() => setMentorBId(undefined)}
          onSwap={swap}
        />
      }
      resolver={
        <PresetRail
          onPreset={(presetId) => {
            const pair = resolvePreset(presetId)
            if (pair) {
              setMentorAId(pair[0])
              setMentorBId(pair[1])
              setPickerSlot(null)
            }
          }}
        />
      }
      renderPlan={
        ready ? (
          <CompareMentorsBody comparison={comparison!} onSwap={swap} />
        ) : (
          <PickToContinueState
            mentorA={mentorA}
            mentorB={mentorB}
            note={resolverNote}
          />
        )
      }
      drillForward={drillers}
    />
  )
}

/* ═════════════════════════════════════════════════════════════════════
   PICKER — multi-source two-slot mentor selector
   ─────────────────────────────────────────────────────────────────────
   Four tabs: FOLLOWING · MY GROUP · LIBRARY · SEARCH. The picker keeps
   slot state visible at the top (Mentor A / Mentor B chips), and the
   tabbed body underneath is filtered to whichever slot is currently
   active. Inactive slots show their selection as a clickable chip with
   a small swap affordance between them.
   ═════════════════════════════════════════════════════════════════════ */

type PickerTab = "following" | "group" | "library" | "search"

function MentorPicker({
  mentorA,
  mentorB,
  activeSlot,
  onActivateSlot,
  onPickA,
  onPickB,
  onClearA,
  onClearB,
  onSwap,
}: {
  mentorA?: MentorProfile
  mentorB?: MentorProfile
  activeSlot: "A" | "B" | null
  onActivateSlot: (s: "A" | "B" | null) => void
  onPickA: (id: string) => void
  onPickB: (id: string) => void
  onClearA: () => void
  onClearB: () => void
  onSwap: () => void
}) {
  const [tab, setTab] = React.useState<PickerTab>("following")
  const [search, setSearch] = React.useState("")

  const filtered = React.useMemo(() => {
    let pool = MENTORS
    if (tab === "following") pool = pool.filter((m) => m.followed)
    if (tab === "group") pool = pool.filter((m) => !!m.groupId)
    if (tab === "search" && search.trim()) {
      const q = search.toLowerCase()
      pool = MENTORS.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.archetype.toLowerCase().includes(q) ||
          m.signature.toLowerCase().includes(q) ||
          (m.instruments ?? m.specialityPairs).some((p) => p.toLowerCase().includes(q)),
      )
    }
    return pool
  }, [tab, search])

  const tabs: { id: PickerTab; label: string; routeId: string; count?: number }[] = [
    { id: "following", label: "FOLLOWING", routeId: "P01", count: MENTORS.filter((m) => m.followed).length },
    { id: "group", label: "MY GROUP", routeId: "P02", count: MENTORS.filter((m) => !!m.groupId).length },
    { id: "library", label: "LIBRARY", routeId: "P03", count: MENTORS.length },
    { id: "search", label: "SEARCH", routeId: "P04" },
  ]

  return (
    <div>
      {/* Slot chips */}
      <div className="flex items-stretch gap-3">
        <PickerSlot
          label="MENTOR A"
          routeId="A"
          mentor={mentorA}
          active={activeSlot === "A"}
          onActivate={() => onActivateSlot("A")}
          onClear={onClearA}
        />
        <button
          type="button"
          onClick={onSwap}
          aria-label="Swap mentor A and mentor B"
          disabled={!(mentorA && mentorB)}
          className="self-center inline-flex items-center justify-center rounded-sm transition-colors"
          style={{
            width: 30,
            height: 30,
            border: `1px solid ${VANTARY.rule}`,
            background: VANTARY.glassDeep,
            opacity: mentorA && mentorB ? 1 : 0.4,
          }}
        >
          <ArrowLeftRight size={13} strokeWidth={1.5} color={VANTARY.ashSoft} />
        </button>
        <PickerSlot
          label="MENTOR B"
          routeId="B"
          mentor={mentorB}
          active={activeSlot === "B"}
          onActivate={() => onActivateSlot("B")}
          onClear={onClearB}
        />
      </div>

      {/* Tabs row */}
      <div className="flex items-center gap-2 mt-4 flex-wrap">
        {tabs.map((t) => {
          const isActive = tab === t.id
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className="inline-flex items-center gap-2 transition-colors"
              style={{
                padding: "6px 12px",
                background: isActive ? VANTARY.amberWash : VANTARY.glassDeep,
                border: `1px solid ${isActive ? VANTARY.amberHalo : VANTARY.rule}`,
                borderRadius: 4,
              }}
            >
              <FdRouteId id={t.routeId} tone={isActive ? "active" : "neutral"} />
              <span
                className="font-mono uppercase"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.22em",
                  color: isActive ? VANTARY.amber : VANTARY.ash,
                  fontWeight: 600,
                }}
              >
                {t.label}
              </span>
              {typeof t.count === "number" && (
                <span
                  className="font-mono tabular-nums"
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.18em",
                    color: isActive ? VANTARY.amber : VANTARY.ashSoft,
                  }}
                >
                  {String(t.count).padStart(2, "0")}
                </span>
              )}
            </button>
          )
        })}
        <span aria-hidden style={{ flex: 1, height: 1, background: VANTARY.rule }} />
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 9,
            letterSpacing: "0.22em",
            color: VANTARY.ashSoft,
          }}
        >
          {activeSlot ? `FILLING SLOT ${activeSlot}` : "SELECTION COMPLETE"}
        </span>
      </div>

      {/* Search input — only visible when search tab is active */}
      <AnimatePresence initial={false}>
        {tab === "search" && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: EASE_V }}
            className="overflow-hidden"
          >
            <div
              className="flex items-center gap-2 mt-3"
              style={{
                background: VANTARY.glassDeep,
                border: `1px solid ${VANTARY.rule}`,
                borderRadius: 4,
                padding: "8px 12px",
              }}
            >
              <Search size={13} strokeWidth={1.5} color={VANTARY.ashSoft} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search every mentor (name · method · instrument)…"
                className="font-sans flex-1 bg-transparent outline-none"
                style={{
                  fontSize: 13.5,
                  color: VANTARY.paper,
                  letterSpacing: "-0.005em",
                }}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="inline-flex items-center justify-center"
                >
                  <X size={11} strokeWidth={1.5} color={VANTARY.ashSoft} />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result list */}
      <div
        className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2"
        role="listbox"
        aria-label={`Mentor list — ${tab}`}
      >
        {filtered.length === 0 && (
          <EmptyTabState tab={tab} />
        )}
        {filtered.map((m) => {
          const selectedAs =
            mentorA?.id === m.id ? "A"
            : mentorB?.id === m.id ? "B"
            : null
          return (
            <MentorRow
              key={m.id}
              mentor={m}
              selectedAs={selectedAs}
              activeSlot={activeSlot}
              onPick={() => {
                if (activeSlot === "A") {
                  onPickA(m.id)
                } else if (activeSlot === "B") {
                  onPickB(m.id)
                } else if (!mentorB) {
                  onPickB(m.id)
                } else if (!mentorA) {
                  onPickA(m.id)
                } else {
                  // Default: replace B
                  onPickB(m.id)
                }
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

function PickerSlot({
  label,
  routeId,
  mentor,
  active,
  onActivate,
  onClear,
}: {
  label: string
  routeId: string
  mentor?: MentorProfile
  active: boolean
  onActivate: () => void
  onClear: () => void
}) {
  return (
    <button
      type="button"
      onClick={onActivate}
      className="flex items-center gap-3 flex-1 text-left transition-colors group"
      style={{
        padding: "10px 12px",
        background: active ? VANTARY.amberWash : VANTARY.glassDeep,
        border: `1px solid ${active ? VANTARY.amberHalo : VANTARY.rule}`,
        borderRadius: 4,
        minHeight: 56,
      }}
    >
      <div
        className="inline-flex items-center justify-center font-mono uppercase shrink-0"
        style={{
          width: 34,
          height: 34,
          background: VANTARY.glass,
          border: `1px solid ${mentor ? VANTARY.amberHalo : VANTARY.rule}`,
          borderRadius: 3,
          fontSize: 11,
          letterSpacing: "0.06em",
          color: mentor ? VANTARY.amber : VANTARY.ashSoft,
          fontWeight: 600,
        }}
      >
        {mentor?.monogram ?? routeId}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className="font-mono uppercase"
            style={{
              fontSize: 9,
              letterSpacing: "0.22em",
              color: active ? VANTARY.amber : VANTARY.ashSoft,
              fontWeight: 600,
            }}
          >
            {label}
          </span>
          {active && !mentor && (
            <span
              className="font-mono uppercase"
              style={{
                fontSize: 9,
                letterSpacing: "0.18em",
                color: VANTARY.amber,
              }}
            >
              · PICK ONE
            </span>
          )}
        </div>
        {mentor ? (
          <div className="flex items-baseline gap-2 mt-0.5">
            <span
              className="font-sans truncate"
              style={{
                fontSize: 14,
                color: VANTARY.paper,
                fontWeight: 500,
                letterSpacing: "-0.005em",
              }}
            >
              {mentor.name}
            </span>
            <span
              className="font-mono uppercase"
              style={{
                fontSize: 9,
                letterSpacing: "0.18em",
                color: VANTARY.ashSoft,
              }}
            >
              · {mentor.archetype}
            </span>
          </div>
        ) : (
          <div
            className="font-sans"
            style={{
              fontSize: 13,
              color: VANTARY.ashSoft,
              fontStyle: "italic",
              marginTop: 2,
            }}
          >
            No mentor selected
          </div>
        )}
      </div>
      {mentor && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onClear()
          }}
          aria-label={`Remove ${mentor.name}`}
          className="inline-flex items-center justify-center shrink-0"
          style={{
            width: 18,
            height: 18,
            border: `1px solid ${VANTARY.rule}`,
            borderRadius: 99,
          }}
        >
          <X size={9} strokeWidth={1.5} color={VANTARY.ashSoft} />
        </button>
      )}
    </button>
  )
}

function MentorRow({
  mentor,
  selectedAs,
  activeSlot,
  onPick,
}: {
  mentor: MentorProfile
  selectedAs: "A" | "B" | null
  activeSlot: "A" | "B" | null
  onPick: () => void
}) {
  const [hover, setHover] = React.useState(false)
  const isSelected = !!selectedAs
  return (
    <button
      type="button"
      onClick={onPick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      role="option"
      aria-selected={isSelected}
      className="flex items-center gap-3 text-left transition-colors"
      style={{
        padding: "10px 12px",
        background: isSelected ? VANTARY.amberWash : hover ? VANTARY.glassDeep : "transparent",
        border: `1px solid ${isSelected ? VANTARY.amberHalo : hover ? VANTARY.rule : VANTARY.ruleSoft}`,
        borderRadius: 4,
      }}
    >
      <div
        className="inline-flex items-center justify-center font-mono uppercase shrink-0"
        style={{
          width: 30,
          height: 30,
          background: VANTARY.glass,
          border: `1px solid ${VANTARY.rule}`,
          borderRadius: 3,
          fontSize: 10,
          letterSpacing: "0.06em",
          color: hover || isSelected ? VANTARY.amber : VANTARY.ashSoft,
          fontWeight: 600,
        }}
      >
        {mentor.monogram}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span
            className="font-sans truncate"
            style={{
              fontSize: 13.5,
              color: VANTARY.paper,
              fontWeight: 500,
              letterSpacing: "-0.005em",
            }}
          >
            {mentor.name}
          </span>
          <span
            className="font-mono uppercase"
            style={{
              fontSize: 9,
              letterSpacing: "0.18em",
              color: VANTARY.ashSoft,
            }}
          >
            · {mentor.archetype}
          </span>
          {mentor.followed && (
            <span
              className="font-mono uppercase"
              style={{
                fontSize: 8.5,
                letterSpacing: "0.18em",
                color: VANTARY.amber,
                padding: "1px 5px",
                border: `1px solid ${VANTARY.amberHalo}`,
                borderRadius: 99,
              }}
            >
              FOLLOWING
            </span>
          )}
          {!!mentor.groupId && (
            <span
              className="font-mono uppercase"
              style={{
                fontSize: 8.5,
                letterSpacing: "0.18em",
                color: VANTARY.ashSoft,
                padding: "1px 5px",
                border: `1px solid ${VANTARY.rule}`,
                borderRadius: 99,
              }}
            >
              GROUP
            </span>
          )}
        </div>
        <div
          className="font-sans truncate mt-0.5"
          style={{
            fontSize: 12,
            color: VANTARY.ashSoft,
            letterSpacing: "-0.005em",
          }}
        >
          {mentor.signature}
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span
          className="font-mono uppercase tabular-nums"
          style={{
            fontSize: 10,
            letterSpacing: "0.18em",
            color: VANTARY.ashSoft,
          }}
        >
          WR {mentor.winRate}%
        </span>
        {selectedAs && (
          <span
            className="inline-flex items-center justify-center font-mono uppercase"
            style={{
              width: 22,
              height: 22,
              border: `1px solid ${VANTARY.amberHalo}`,
              background: VANTARY.amberWash,
              borderRadius: 3,
              fontSize: 10,
              color: VANTARY.amber,
              fontWeight: 700,
            }}
          >
            {selectedAs}
          </span>
        )}
      </div>
    </button>
  )
}

function EmptyTabState({ tab }: { tab: PickerTab }) {
  const message =
    tab === "following"
      ? "You're not following any mentors yet. Switch to Library to discover."
      : tab === "group"
      ? "No mentors in any of your groups yet. Switch to Library or Following."
      : tab === "search"
      ? "No matches. Try a name, an archetype, or an instrument."
      : "No mentors found."
  return (
    <div
      className="col-span-full flex items-center gap-3 px-4 py-4"
      style={{
        background: VANTARY.glassDeep,
        border: `1px dashed ${VANTARY.rule}`,
        borderRadius: 4,
      }}
    >
      <CircleSlash size={13} strokeWidth={1.5} color={VANTARY.ashSoft} />
      <span
        className="font-sans"
        style={{
          fontSize: 13,
          color: VANTARY.ashSoft,
          fontStyle: "italic",
        }}
      >
        {message}
      </span>
    </div>
  )
}

/* ═════════════════════════════════════════════════════════════════════
   PRESETS — auto-fill chips
   ───────────────────────────────────────────────────────────────────── */

type PresetId =
  | "morning-session"
  | "swing-vs-day"
  | "most-vs-least-watched"
  | "never-compared"
  | "scaling-fit"

const PRESETS: { id: PresetId; label: string; routeId: string; hint: string }[] = [
  { id: "morning-session", routeId: "Q01", label: "My morning-session mentors", hint: "Both anchor in your London-window pool." },
  { id: "swing-vs-day", routeId: "Q02", label: "Swing vs day traders I follow", hint: "Highest-frequency vs lowest-frequency among followed." },
  { id: "most-vs-least-watched", routeId: "Q03", label: "Most vs least watched", hint: "Crowd-leader against quiet specialist." },
  { id: "never-compared", routeId: "Q04", label: "Mentors I've never compared", hint: "Two from your group with zero compare history." },
  { id: "scaling-fit", routeId: "Q05", label: "Scaling-stage fits", hint: "Larger-R curves built to absorb scaling variance." },
]

function PresetRail({ onPreset }: { onPreset: (id: PresetId) => void }) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span
        className="font-mono uppercase"
        style={{
          fontSize: 9,
          letterSpacing: "0.22em",
          color: VANTARY.ashSoft,
          paddingRight: 4,
        }}
      >
        AUTO-FILL ·
      </span>
      {PRESETS.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => onPreset(p.id)}
          title={p.hint}
          className="inline-flex items-center gap-2 transition-colors"
          style={{
            padding: "6px 10px",
            background: VANTARY.glassDeep,
            border: `1px solid ${VANTARY.rule}`,
            borderRadius: 4,
          }}
        >
          <FdRouteId id={p.routeId} tone="neutral" />
          <Sparkles size={11} strokeWidth={1.5} color={VANTARY.ashSoft} />
          <span
            className="font-sans"
            style={{
              fontSize: 12.5,
              color: VANTARY.paper,
              letterSpacing: "-0.005em",
              fontWeight: 500,
            }}
          >
            {p.label}
          </span>
        </button>
      ))}
    </div>
  )
}

function resolvePreset(id: PresetId): [string, string] | null {
  const followed = MENTORS.filter((m) => m.followed)
  switch (id) {
    case "morning-session": {
      const morning = followed.filter(
        (m) => m.sessionWindow === "London" || m.sessionWindow === "NY AM",
      )
      if (morning.length >= 2) return [morning[0].id, morning[1].id]
      return null
    }
    case "swing-vs-day": {
      const day = followed.find((m) => m.style === "day" || m.style === "scalp")
      const swing = followed.find((m) => m.style === "swing" || m.style === "position")
      if (day && swing) return [day.id, swing.id]
      return null
    }
    case "most-vs-least-watched": {
      const sorted = [...followed].sort(
        (a, b) => (b.watchedCount ?? 0) - (a.watchedCount ?? 0),
      )
      if (sorted.length >= 2) return [sorted[0].id, sorted[sorted.length - 1].id]
      return null
    }
    case "never-compared": {
      const fresh = MENTORS.filter((m) => (m.comparisonCount ?? 0) <= 1)
      if (fresh.length >= 2) return [fresh[0].id, fresh[1].id]
      return null
    }
    case "scaling-fit": {
      const scalers = MENTORS.filter((m) => (m.growthStageFit ?? []).includes("scaling"))
      if (scalers.length >= 2) return [scalers[0].id, scalers[1].id]
      return null
    }
  }
}

/* ═════════════════════════════════════════════════════════════════════
   PRE-COMPARISON STATE — visible "pick to continue" body
   ───────────────────────────────────────────────────────────────────── */

function PickToContinueState({
  mentorA,
  mentorB,
  note,
}: {
  mentorA?: MentorProfile
  mentorB?: MentorProfile
  note?: string
}) {
  const missing = !mentorA ? "A" : !mentorB ? "B" : null
  return (
    <div
      className="relative px-4 py-5"
      style={{
        background: VANTARY.glassDeep,
        border: `1px dashed ${VANTARY.rule}`,
        borderRadius: 4,
      }}
    >
      <FdCorners />
      <div
        className="font-mono uppercase"
        style={{
          fontSize: 10,
          letterSpacing: "0.22em",
          color: VANTARY.amber,
          fontWeight: 600,
          marginBottom: 6,
        }}
      >
        STAGING · PICK TO CONTINUE
      </div>
      <div
        className="font-sans"
        style={{
          fontSize: 13.5,
          color: VANTARY.ash,
          lineHeight: 1.55,
          maxWidth: 680,
        }}
      >
        {note
          ? note
          : missing
          ? `Pick ${missing === "A" ? "the first" : "the second"} mentor to render the comparison. The picker above filters by Following, Group, Library, or Search.`
          : "Pick two mentors to render the comparison."}
      </div>
    </div>
  )
}

/* ═════════════════════════════════════════════════════════════════════
   COMPARE MENTORS BODY — the main render plan
   ─────────────────────────────────────────────────────────────────────
   This is what paints when both slots are filled. The body has five
   sub-zones, in order, each separated by an FdDashedRule:

     · Mission briefing  — headline, hero ring, side-by-side identity
     · Telemetry quad    — eight-axis comparison grid
     · Advisory sheets   — PRIMARY / RISK / OPPORTUNITY (collapsible)
     · Schedule matrix   — last 10 trades head to head
     · Destination bay   — orbit-ring action tiles
   ═════════════════════════════════════════════════════════════════════ */

function CompareMentorsBody({
  comparison,
  onSwap,
}: {
  comparison: MentorComparison
  onSwap: () => void
}) {
  return (
    <div className="space-y-5">
      <MissionBriefing comparison={comparison} onSwap={onSwap} />
      <FdDashedRule />
      <TelemetryQuad axes={comparison.axes} />
      <FdDashedRule />
      <AdvisorySheets comparison={comparison} />
      <FdDashedRule />
      <ScheduleMatrix comparison={comparison} />
      <FdDashedRule />
      <DestinationBay comparison={comparison} />
    </div>
  )
}

/* ── Mission briefing ──────────────────────────────────────────────── */

function MissionBriefing({
  comparison,
  onSwap,
}: {
  comparison: MentorComparison
  onSwap: () => void
}) {
  const { mentorA, mentorB, headline, readout, fitScoreDelta } = comparison
  const a = mentorA
  const b = mentorB
  const aFirst = a.name.split(" ")[0]
  const bFirst = b.name.split(" ")[0]
  const fitA = 0.5 + Math.max(-0.4, Math.min(0.4, fitScoreDelta / 200))
  const fitB = 1 - fitA

  return (
    <div
      className="relative p-5 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_180px] gap-5 md:gap-6 items-stretch"
      style={{
        background: VANTARY.glass,
        border: `1px solid ${VANTARY.rule}`,
        borderRadius: 6,
      }}
    >
      <FdCorners />

      {/* Mentor A identity */}
      <MentorIdentityBlock mentor={a} slotLabel="MENTOR A" tone="primary" />

      {/* Center stripe — swap + delta */}
      <div className="hidden md:flex flex-col items-center justify-center gap-3">
        <button
          type="button"
          onClick={onSwap}
          aria-label="Swap mentors"
          className="inline-flex items-center justify-center rounded-full transition-colors"
          style={{
            width: 32,
            height: 32,
            border: `1px solid ${VANTARY.rule}`,
            background: VANTARY.glassDeep,
          }}
        >
          <ArrowLeftRight size={13} strokeWidth={1.5} color={VANTARY.ashSoft} />
        </button>
        <div
          className="font-mono uppercase tabular-nums text-center"
          style={{
            fontSize: 9,
            letterSpacing: "0.22em",
            color: VANTARY.ashSoft,
            writingMode: "horizontal-tb",
          }}
        >
          {fitScoreDelta > 0
            ? `${aFirst} +${Math.round(fitScoreDelta)}`
            : fitScoreDelta < 0
            ? `${bFirst} +${Math.round(-fitScoreDelta)}`
            : "EVEN"}
        </div>
      </div>

      {/* Mentor B identity */}
      <MentorIdentityBlock mentor={b} slotLabel="MENTOR B" tone="counter" />

      {/* Hero ring */}
      <div className="flex flex-col items-center justify-center">
        <FdRangeRing size={120} pct={Math.abs(fitScoreDelta) / 100 + 0.5} />
        <div
          className="font-mono uppercase text-center mt-2"
          style={{
            fontSize: 9,
            letterSpacing: "0.22em",
            color: VANTARY.ashSoft,
          }}
        >
          FIT-SCORE Δ
        </div>
        <div className="mt-1 flex items-baseline gap-1">
          <FdMagnitude
            value={`${fitScoreDelta >= 0 ? "+" : "−"}${Math.abs(Math.round(fitScoreDelta))}`}
            size={28}
            tone={fitScoreDelta > 0 ? "ok" : fitScoreDelta < 0 ? "warn" : undefined}
          />
        </div>
      </div>

      {/* Headline + readout — full-width below the grid */}
      <div className="md:col-span-4 mt-2">
        <h3
          className="font-sans"
          style={{
            fontSize: 22,
            lineHeight: 1.25,
            letterSpacing: "-0.018em",
            color: VANTARY.paper,
            fontWeight: 600,
            textWrap: "balance",
          }}
        >
          {headline}
        </h3>
        <ul className="mt-3 space-y-1.5">
          {readout.map((line, i) => (
            <li
              key={i}
              className="flex items-start gap-2 font-sans"
              style={{
                fontSize: 13.5,
                lineHeight: 1.55,
                color: VANTARY.ash,
                textWrap: "pretty",
              }}
            >
              <span
                aria-hidden
                className="shrink-0"
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: 99,
                  background: VANTARY.amber,
                  marginTop: 8,
                }}
              />
              <span>{line}</span>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3 mt-3">
          <FdRouteId id="A · " tone="neutral" />
          <span
            className="font-sans"
            style={{ fontSize: 11.5, color: VANTARY.ashSoft, fontStyle: "italic" }}
          >
            Fit-score blends session window, style, and instrument overlap against your focus pool.
          </span>
        </div>
      </div>
    </div>
  )
}

function MentorIdentityBlock({
  mentor,
  slotLabel,
  tone,
}: {
  mentor: MentorProfile
  slotLabel: string
  tone: "primary" | "counter"
}) {
  const accent = tone === "primary" ? VANTARY.amber : VANTARY.paper
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <FdRouteId id={slotLabel} tone={tone === "primary" ? "active" : "neutral"} />
        <span aria-hidden style={{ flex: 1, height: 1, background: VANTARY.rule }} />
      </div>
      <div className="flex items-center gap-3">
        <div
          className="inline-flex items-center justify-center font-mono uppercase shrink-0"
          style={{
            width: 44,
            height: 44,
            background: VANTARY.glassDeep,
            border: `1px solid ${tone === "primary" ? VANTARY.amberHalo : VANTARY.rule}`,
            borderRadius: 4,
            fontSize: 13,
            letterSpacing: "0.06em",
            color: accent,
            fontWeight: 600,
          }}
        >
          {mentor.monogram}
        </div>
        <div className="min-w-0">
          <div
            className="font-sans truncate"
            style={{
              fontSize: 18,
              color: VANTARY.paper,
              fontWeight: 600,
              letterSpacing: "-0.012em",
            }}
          >
            {mentor.name}
          </div>
          <div
            className="font-mono uppercase"
            style={{
              fontSize: 10,
              letterSpacing: "0.20em",
              color: VANTARY.ashSoft,
            }}
          >
            {mentor.archetype} · {mentor.years}Y
          </div>
        </div>
      </div>
      <div
        className="font-sans"
        style={{
          fontSize: 12.5,
          color: VANTARY.ash,
          lineHeight: 1.5,
          textWrap: "pretty",
        }}
      >
        {mentor.signature}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {mentor.followed && (
          <span
            className="font-mono uppercase"
            style={{
              fontSize: 8.5,
              letterSpacing: "0.18em",
              color: VANTARY.amber,
              padding: "2px 6px",
              border: `1px solid ${VANTARY.amberHalo}`,
              borderRadius: 99,
            }}
          >
            FOLLOWING
          </span>
        )}
        {!!mentor.groupId && (
          <span
            className="font-mono uppercase"
            style={{
              fontSize: 8.5,
              letterSpacing: "0.18em",
              color: VANTARY.ashSoft,
              padding: "2px 6px",
              border: `1px solid ${VANTARY.rule}`,
              borderRadius: 99,
            }}
          >
            GROUP
          </span>
        )}
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 8.5,
            letterSpacing: "0.18em",
            color: VANTARY.ashSoft,
            padding: "2px 6px",
            border: `1px solid ${VANTARY.rule}`,
            borderRadius: 99,
          }}
        >
          n={mentor.sampleSize}
        </span>
      </div>
    </div>
  )
}

/* ── Telemetry quad — eight-axis grid ──────────────────────────────── */

function TelemetryQuad({
  axes,
}: {
  axes: readonly MentorAxisComparison[]
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 9,
            letterSpacing: "0.24em",
            color: VANTARY.amber,
            fontWeight: 600,
          }}
        >
          TELEMETRY · EIGHT-AXIS COMPARISON
        </span>
        <FdDashedRule className="flex-1" />
        <FdRouteId id="T-08" tone="neutral" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {axes.map((axis) => (
          <AxisCard key={axis.id} axis={axis} />
        ))}
      </div>
    </div>
  )
}

function AxisCard({ axis }: { axis: MentorAxisComparison }) {
  const [hover, setHover] = React.useState(false)
  const winnerTone =
    axis.leader === "A" ? VANTARY.amber : axis.leader === "B" ? VANTARY.paper : VANTARY.ashSoft
  return (
    <motion.div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative p-3"
      style={{
        background: VANTARY.glass,
        border: `1px solid ${hover ? VANTARY.amberHalo : VANTARY.rule}`,
        borderRadius: 4,
        minHeight: 148,
      }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18, ease: EASE_V }}
    >
      <FdCorners inset={6} size={6} />
      <div className="flex items-center gap-2">
        <FdRouteId id={axis.routeId} tone={hover ? "active" : "neutral"} />
        <span
          className="font-mono uppercase truncate"
          style={{
            fontSize: 9,
            letterSpacing: "0.22em",
            color: hover ? VANTARY.amber : VANTARY.ashSoft,
            fontWeight: 600,
          }}
        >
          {axis.label}
        </span>
        <span aria-hidden style={{ flex: 1, height: 1, background: VANTARY.rule }} />
        {axis.sharedOrDivergent === "shared" && (
          <CheckCircle2 size={11} strokeWidth={1.5} color={VANTARY.ashSoft} />
        )}
      </div>

      {/* Side-by-side values */}
      <div className="grid grid-cols-2 gap-3 mt-3">
        <ValueCell
          slot="A"
          value={axis.mentorAValue}
          isLeader={axis.leader === "A"}
        />
        <ValueCell
          slot="B"
          value={axis.mentorBValue}
          isLeader={axis.leader === "B"}
        />
      </div>

      {/* Tiny visual */}
      <div className="mt-3">
        <AxisTinyVisual axis={axis} />
      </div>

      {/* Interpretation */}
      <p
        className="font-sans mt-2"
        style={{
          fontSize: 11.5,
          lineHeight: 1.45,
          color: VANTARY.ash,
          textWrap: "pretty",
        }}
      >
        {axis.shortInterpretation}
      </p>

      {/* Optional risk implication */}
      {axis.riskImplication && (
        <p
          className="font-sans mt-1"
          style={{
            fontSize: 11,
            lineHeight: 1.4,
            color: VANTARY.warnEdge,
            textWrap: "pretty",
          }}
        >
          {axis.riskImplication}
        </p>
      )}
    </motion.div>
  )
}

function ValueCell({
  slot,
  value,
  isLeader,
}: {
  slot: "A" | "B"
  value: string
  isLeader: boolean
}) {
  return (
    <div
      style={{
        background: isLeader ? VANTARY.amberWash : VANTARY.glassDeep,
        border: `1px solid ${isLeader ? VANTARY.amberHalo : VANTARY.ruleSoft}`,
        borderRadius: 3,
        padding: "6px 8px",
      }}
    >
      <div
        className="font-mono uppercase"
        style={{
          fontSize: 8.5,
          letterSpacing: "0.22em",
          color: isLeader ? VANTARY.amber : VANTARY.ashSoft,
          fontWeight: 600,
        }}
      >
        {slot}
      </div>
      <div
        className="font-sans tabular-nums"
        style={{
          fontSize: 14,
          color: isLeader ? VANTARY.amber : VANTARY.paper,
          fontWeight: 600,
          letterSpacing: "-0.005em",
          marginTop: 2,
        }}
      >
        {value}
      </div>
    </div>
  )
}

function AxisTinyVisual({ axis }: { axis: MentorAxisComparison }) {
  switch (axis.tinyVisualType) {
    case "delta-bar":
      return <DeltaBar axis={axis} />
    case "discipline-meter":
      return <DisciplineMeter axis={axis} />
    case "frequency-spark":
      return <FrequencySpark axis={axis} />
    case "session-chips":
    case "shared-chips":
      return <SharedChips axis={axis} />
    case "temperament-vector":
      return <TemperamentVector axis={axis} />
    default:
      return null
  }
}

function DeltaBar({ axis }: { axis: MentorAxisComparison }) {
  const delta = axis.delta ?? 0
  const max = Math.max(20, Math.abs(delta) * 2)
  const aPct = Math.min(1, Math.max(0, 0.5 + delta / 2 / max))
  return (
    <div>
      <div
        className="relative h-1 rounded-full overflow-hidden"
        style={{ background: VANTARY.glassDeep, border: `1px solid ${VANTARY.ruleSoft}` }}
      >
        <div
          className="absolute top-0 bottom-0"
          style={{
            left: `${aPct * 100}%`,
            transform: "translateX(-50%)",
            width: 1,
            background: VANTARY.amber,
          }}
        />
        <div
          className="absolute top-0 bottom-0 left-0"
          style={{
            width: `${Math.min(100, Math.abs(delta) * 4)}%`,
            background: delta > 0
              ? `linear-gradient(90deg, transparent, ${VANTARY.amberWash})`
              : `linear-gradient(90deg, ${VANTARY.amberWash}, transparent)`,
          }}
        />
      </div>
      <div
        className="font-mono uppercase tabular-nums mt-1.5"
        style={{
          fontSize: 9,
          letterSpacing: "0.18em",
          color: VANTARY.ashSoft,
        }}
      >
        Δ {delta > 0 ? "+" : ""}{delta.toFixed(2)}
      </div>
    </div>
  )
}

function DisciplineMeter({ axis }: { axis: MentorAxisComparison }) {
  const aVal = parseInt(axis.mentorAValue) || 0
  const bVal = parseInt(axis.mentorBValue) || 0
  return (
    <div className="flex items-center gap-2">
      <Meter slot="A" value={aVal} max={100} isLeader={axis.leader === "A"} />
      <Meter slot="B" value={bVal} max={100} isLeader={axis.leader === "B"} />
    </div>
  )
}

function Meter({
  slot,
  value,
  max,
  isLeader,
}: {
  slot: string
  value: number
  max: number
  isLeader: boolean
}) {
  const pct = Math.max(0, Math.min(1, value / max))
  return (
    <div className="flex-1">
      <div
        className="relative h-1 rounded-full overflow-hidden"
        style={{ background: VANTARY.glassDeep, border: `1px solid ${VANTARY.ruleSoft}` }}
      >
        <div
          className="absolute top-0 left-0 bottom-0"
          style={{
            width: `${pct * 100}%`,
            background: isLeader ? VANTARY.amber : VANTARY.ashSoft,
          }}
        />
      </div>
    </div>
  )
}

function FrequencySpark({ axis }: { axis: MentorAxisComparison }) {
  const aVal = parseInt(axis.mentorAValue) || 0
  const bVal = parseInt(axis.mentorBValue) || 0
  const max = Math.max(aVal, bVal, 1)
  const bars = 12
  return (
    <div className="flex items-end gap-2">
      <SparkRow value={aVal} max={max} bars={bars} isLeader={axis.leader === "A"} />
      <SparkRow value={bVal} max={max} bars={bars} isLeader={axis.leader === "B"} />
    </div>
  )
}

function SparkRow({
  value,
  max,
  bars,
  isLeader,
}: {
  value: number
  max: number
  bars: number
  isLeader: boolean
}) {
  const filled = Math.round((value / max) * bars)
  return (
    <div className="flex-1 flex items-end gap-px">
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className="flex-1"
          style={{
            height: i < filled ? 12 : 4,
            background: i < filled
              ? (isLeader ? VANTARY.amber : VANTARY.ashSoft)
              : VANTARY.ruleSoft,
            transition: "height 240ms cubic-bezier(0.22,1,0.36,1)",
          }}
        />
      ))}
    </div>
  )
}

function SharedChips({ axis }: { axis: MentorAxisComparison }) {
  const isShared = axis.sharedOrDivergent === "shared"
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="font-mono uppercase"
        style={{
          fontSize: 8.5,
          letterSpacing: "0.18em",
          color: isShared ? VANTARY.amber : VANTARY.ashSoft,
          padding: "2px 6px",
          background: isShared ? VANTARY.amberWash : VANTARY.glassDeep,
          border: `1px solid ${isShared ? VANTARY.amberHalo : VANTARY.rule}`,
          borderRadius: 99,
        }}
      >
        {isShared ? "CONVERGENT" : axis.sharedOrDivergent === "divergent" ? "DIVERGENT" : "PARTIAL"}
      </span>
    </div>
  )
}

function TemperamentVector({ axis }: { axis: MentorAxisComparison }) {
  const isShared = axis.sharedOrDivergent === "shared"
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="font-mono uppercase"
        style={{
          fontSize: 8.5,
          letterSpacing: "0.18em",
          color: isShared ? VANTARY.amber : VANTARY.ashSoft,
          padding: "2px 6px",
          background: isShared ? VANTARY.amberWash : VANTARY.glassDeep,
          border: `1px solid ${isShared ? VANTARY.amberHalo : VANTARY.rule}`,
          borderRadius: 99,
        }}
      >
        {isShared ? "ALIGNED" : "DIVERGENT"}
      </span>
    </div>
  )
}

/* ── Advisory sheets — PRIMARY · RISK · OPPORTUNITY ────────────────── */

function AdvisorySheets({
  comparison,
}: {
  comparison: MentorComparison
}) {
  return (
    <div className="space-y-3">
      <AdvisorySheet
        kind="primary"
        defaultOpen
        eyebrow="PRIMARY · WHO LEADS WHERE"
        routeId="ADV-P"
        leftHeader={`${comparison.mentorA.name.split(" ")[0]}`}
        rightHeader={`${comparison.mentorB.name.split(" ")[0]}`}
        leftItems={comparison.mentorAAdvantages}
        rightItems={comparison.mentorBAdvantages}
      />
      <AdvisorySheet
        kind="risk"
        defaultOpen
        eyebrow={`RISK · WHAT YOU GIVE UP SWITCHING ${comparison.mentorA.name.split(" ")[0]} → ${comparison.mentorB.name.split(" ")[0]}`}
        routeId="ADV-R"
        items={comparison.tradeoffs}
        secondaryItems={comparison.riskWarnings}
        secondaryEyebrow="BEHAVIOURAL WARNINGS"
      />
      <AdvisorySheet
        kind="opportunity"
        defaultOpen={false}
        eyebrow="OPPORTUNITY · COMPLEMENTARY ZONES"
        routeId="ADV-O"
        items={comparison.complementaryZones}
        footer={comparison.bestFitRecommendation}
      />
    </div>
  )
}

function AdvisorySheet({
  kind,
  defaultOpen,
  eyebrow,
  routeId,
  leftHeader,
  rightHeader,
  leftItems,
  rightItems,
  items,
  secondaryItems,
  secondaryEyebrow,
  footer,
}: {
  kind: "primary" | "risk" | "opportunity"
  defaultOpen: boolean
  eyebrow: string
  routeId: string
  leftHeader?: string
  rightHeader?: string
  leftItems?: readonly string[]
  rightItems?: readonly string[]
  items?: readonly string[]
  secondaryItems?: readonly string[]
  secondaryEyebrow?: string
  footer?: string
}) {
  const [open, setOpen] = React.useState(defaultOpen)
  const accent =
    kind === "risk" ? VANTARY.warnEdge : kind === "opportunity" ? VANTARY.amber : VANTARY.amber
  const wash =
    kind === "risk" ? VANTARY.warnWash : kind === "opportunity" ? VANTARY.amberWash : VANTARY.glass
  const border =
    kind === "risk" ? VANTARY.warnEdge : kind === "opportunity" ? VANTARY.amberHalo : VANTARY.rule
  const Icon =
    kind === "risk" ? AlertTriangle : kind === "opportunity" ? Lightbulb : CheckCircle2

  return (
    <div
      style={{
        background: wash,
        border: `1px solid ${border}`,
        borderRadius: 6,
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center gap-3 px-4 py-3"
      >
        <FdRouteId id={routeId} tone={kind === "risk" ? "warn" : "active"} />
        <Icon size={13} strokeWidth={1.5} color={accent} />
        <span
          className="font-mono uppercase text-left"
          style={{
            fontSize: 10,
            letterSpacing: "0.22em",
            color: accent,
            fontWeight: 600,
          }}
        >
          {eyebrow}
        </span>
        <span aria-hidden style={{ flex: 1, height: 1, background: VANTARY.rule }} />
        <motion.span
          aria-hidden
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.24, ease: EASE_V }}
        >
          <ChevronDown size={13} strokeWidth={1.5} color={accent} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: EASE_V }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              <FdDashedRule />
              <div className="pt-3">
                {leftItems && rightItems ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AdvisoryColumn header={leftHeader ?? "A"} items={leftItems} />
                    <AdvisoryColumn header={rightHeader ?? "B"} items={rightItems} />
                  </div>
                ) : (
                  <AdvisoryList items={items ?? []} />
                )}
                {secondaryItems && secondaryItems.length > 0 && (
                  <div className="mt-4">
                    {secondaryEyebrow && (
                      <div
                        className="font-mono uppercase mb-2"
                        style={{
                          fontSize: 9,
                          letterSpacing: "0.22em",
                          color: VANTARY.warnEdge,
                          fontWeight: 600,
                        }}
                      >
                        {secondaryEyebrow}
                      </div>
                    )}
                    <AdvisoryList items={secondaryItems} tone="warn" />
                  </div>
                )}
                {footer && (
                  <div
                    className="mt-4 px-3 py-2 font-sans"
                    style={{
                      fontSize: 12.5,
                      lineHeight: 1.5,
                      color: VANTARY.amber,
                      background: VANTARY.amberWash,
                      border: `1px solid ${VANTARY.amberHalo}`,
                      borderRadius: 3,
                      fontStyle: "italic",
                    }}
                  >
                    {footer}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function AdvisoryColumn({
  header,
  items,
}: {
  header: string
  items: readonly string[]
}) {
  return (
    <div>
      <div
        className="font-mono uppercase mb-2"
        style={{
          fontSize: 9,
          letterSpacing: "0.22em",
          color: VANTARY.amber,
          fontWeight: 600,
        }}
      >
        {header}
      </div>
      <AdvisoryList items={items} />
    </div>
  )
}

function AdvisoryList({
  items,
  tone = "neutral",
}: {
  items: readonly string[]
  tone?: "neutral" | "warn"
}) {
  return (
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li
          key={i}
          className="flex items-start gap-2 font-sans"
          style={{
            fontSize: 13,
            lineHeight: 1.5,
            color: tone === "warn" ? VANTARY.paper : VANTARY.ash,
            textWrap: "pretty",
          }}
        >
          <span
            aria-hidden
            className="shrink-0"
            style={{
              width: 4,
              height: 4,
              borderRadius: 99,
              background: tone === "warn" ? VANTARY.warnEdge : VANTARY.amber,
              marginTop: 7,
            }}
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

/* ── Schedule matrix — last 10 trades head-to-head ─────────────────── */

function ScheduleMatrix({
  comparison,
}: {
  comparison: MentorComparison
}) {
  const aTrades = comparison.mentorA.lastTenTrades ?? []
  const bTrades = comparison.mentorB.lastTenTrades ?? []
  const rows = Math.max(aTrades.length, bTrades.length)
  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 9,
            letterSpacing: "0.24em",
            color: VANTARY.amber,
            fontWeight: 600,
          }}
        >
          SCHEDULE MATRIX · LAST 10 TRADES HEAD-TO-HEAD
        </span>
        <FdDashedRule className="flex-1" />
        <FdRouteId id="SCH-10" tone="neutral" />
      </div>
      <div
        className="grid gap-0"
        style={{
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
          background: VANTARY.glass,
          border: `1px solid ${VANTARY.rule}`,
          borderRadius: 6,
          overflow: "hidden",
        }}
      >
        <ScheduleHeader
          slotLabel="A"
          mentorName={comparison.mentorA.name}
          totalR={aTrades.reduce((s, t) => s + t.rOutcome, 0)}
        />
        <ScheduleHeader
          slotLabel="B"
          mentorName={comparison.mentorB.name}
          totalR={bTrades.reduce((s, t) => s + t.rOutcome, 0)}
        />
        {Array.from({ length: rows }).map((_, i) => (
          <React.Fragment key={i}>
            <ScheduleCell trade={aTrades[i]} slot="A" rowIdx={i} />
            <ScheduleCell trade={bTrades[i]} slot="B" rowIdx={i} />
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

function ScheduleHeader({
  slotLabel,
  mentorName,
  totalR,
}: {
  slotLabel: string
  mentorName: string
  totalR: number
}) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-2"
      style={{
        background: VANTARY.glassDeep,
        borderBottom: `1px solid ${VANTARY.rule}`,
      }}
    >
      <FdRouteId id={slotLabel} tone="active" />
      <span
        className="font-sans truncate"
        style={{
          fontSize: 13,
          color: VANTARY.paper,
          fontWeight: 600,
          letterSpacing: "-0.005em",
        }}
      >
        {mentorName}
      </span>
      <span aria-hidden style={{ flex: 1, height: 1, background: VANTARY.rule }} />
      <span
        className="font-mono uppercase tabular-nums"
        style={{
          fontSize: 10,
          letterSpacing: "0.18em",
          color: totalR >= 0 ? VANTARY.amber : VANTARY.warnEdge,
        }}
      >
        Σ {totalR > 0 ? "+" : ""}
        {totalR.toFixed(1)}R
      </span>
    </div>
  )
}

function ScheduleCell({
  trade,
  slot,
  rowIdx,
}: {
  trade?: MentorTradeRecord
  slot: string
  rowIdx: number
}) {
  if (!trade) {
    return (
      <div
        className="px-4 py-2"
        style={{
          borderBottom: `1px solid ${VANTARY.ruleSoft}`,
          background: VANTARY.glass,
          minHeight: 56,
        }}
      />
    )
  }
  const pos = trade.rOutcome >= 0
  return (
    <div
      className="px-4 py-2 flex flex-col gap-1"
      style={{
        borderBottom: `1px solid ${VANTARY.ruleSoft}`,
        background: rowIdx % 2 === 0 ? VANTARY.glass : VANTARY.glassDeep,
      }}
    >
      <div className="flex items-center gap-2">
        <FdRouteId id={`${slot}.${(rowIdx + 1).toString().padStart(2, "0")}`} tone="neutral" />
        <span
          className="font-mono tabular-nums"
          style={{
            fontSize: 9,
            letterSpacing: "0.16em",
            color: VANTARY.ashSoft,
          }}
        >
          {trade.date.slice(5)}
        </span>
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 8.5,
            letterSpacing: "0.18em",
            color: VANTARY.ashSoft,
          }}
        >
          · {trade.session}
        </span>
        <span aria-hidden style={{ flex: 1, height: 1, background: VANTARY.ruleSoft }} />
        <span
          className="font-mono tabular-nums"
          style={{
            fontSize: 11,
            letterSpacing: "0.06em",
            color: pos ? VANTARY.amber : VANTARY.warnEdge,
            fontWeight: 600,
          }}
        >
          {pos ? "+" : ""}
          {trade.rOutcome.toFixed(1)}R
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span
          className="font-sans truncate"
          style={{
            fontSize: 12.5,
            color: VANTARY.paper,
            fontWeight: 500,
            letterSpacing: "-0.005em",
          }}
        >
          {trade.instrument}
        </span>
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 9,
            letterSpacing: "0.18em",
            color: VANTARY.ashSoft,
          }}
        >
          {trade.side}
        </span>
        <span
          className="font-sans truncate"
          style={{
            fontSize: 12,
            color: VANTARY.ashSoft,
            letterSpacing: "-0.005em",
          }}
        >
          · {trade.setup}
        </span>
      </div>
      {trade.note && (
        <div
          className="font-sans truncate"
          style={{
            fontSize: 11,
            color: VANTARY.ashSoft,
            fontStyle: "italic",
          }}
        >
          {trade.note}
        </div>
      )}
    </div>
  )
}

/* ── Destination bay — orbit-ring action tiles ─────────────────────── */

function DestinationBay({
  comparison,
}: {
  comparison: MentorComparison
}) {
  const a = comparison.mentorA
  const b = comparison.mentorB
  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 9,
            letterSpacing: "0.24em",
            color: VANTARY.amber,
            fontWeight: 600,
          }}
        >
          DESTINATION BAY · NEXT MOVES
        </span>
        <FdDashedRule className="flex-1" />
        <FdRouteId id="BAY-03" tone="neutral" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <BayTile
          routeId="B01"
          icon={PlayCircle}
          label={`Watch ${a.name.split(" ")[0]}'s next live session`}
          hint={a.sessionWindow ? `Anchored in ${a.sessionWindow} window.` : "Live session window."}
          accent={a.followed ? "primary" : "neutral"}
          ringPct={0.84}
        />
        <BayTile
          routeId="B02"
          icon={ArrowLeftRight}
          label={`Replay ${b.name.split(" ")[0]}'s last 3 setups`}
          hint="Walks the last three entries with rationale."
          accent="primary"
          ringPct={0.62}
        />
        <BayTile
          routeId="B03"
          icon={b.followed ? CalendarDays : PlusCircle}
          label={
            b.followed
              ? `Book a 1-on-1 with ${b.name.split(" ")[0]}`
              : `Add ${b.name.split(" ")[0]} to your group`
          }
          hint={
            b.followed
              ? "Opens scheduling on the Review Room rail."
              : "Adds them to your daily mentor feed."
          }
          accent="neutral"
          ringPct={0.45}
        />
      </div>
    </div>
  )
}

function BayTile({
  routeId,
  icon: Icon,
  label,
  hint,
  accent,
  ringPct,
}: {
  routeId: string
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; color?: string }>
  label: string
  hint: string
  accent: "primary" | "neutral"
  ringPct: number
}) {
  const [hover, setHover] = React.useState(false)
  return (
    <button
      type="button"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative flex items-center gap-3 px-4 py-3 text-left transition-colors"
      style={{
        background: hover ? VANTARY.amberWash : VANTARY.glass,
        border: `1px solid ${hover ? VANTARY.amberHalo : VANTARY.rule}`,
        borderRadius: 6,
        minHeight: 92,
      }}
    >
      <FdCorners inset={6} size={6} />
      <FdRangeRing size={50} pct={ringPct} accent={accent === "primary" ? VANTARY.amber : VANTARY.ashSoft} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <FdRouteId id={routeId} tone={hover ? "active" : "neutral"} />
          <Icon size={11} strokeWidth={1.5} color={hover ? VANTARY.amber : VANTARY.ashSoft} />
        </div>
        <div
          className="font-sans"
          style={{
            fontSize: 13,
            color: hover ? VANTARY.amber : VANTARY.paper,
            fontWeight: 500,
            letterSpacing: "-0.005em",
            lineHeight: 1.35,
            textWrap: "pretty",
          }}
        >
          {label}
        </div>
        <div
          className="font-sans mt-0.5"
          style={{
            fontSize: 11.5,
            color: VANTARY.ashSoft,
            lineHeight: 1.4,
            textWrap: "pretty",
          }}
        >
          {hint}
        </div>
      </div>
      <ChevronRight size={13} strokeWidth={1.5} color={hover ? VANTARY.amber : VANTARY.ashSoft} />
    </button>
  )
}
