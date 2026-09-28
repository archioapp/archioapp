"use client"

/* ═══════════════════════════════════════════════════════════════════════════
 *  TRADING DESK · INSTITUTIONAL CONFLUENCE NAVIGATOR
 *  ─────────────────────────────────────────────────────────────────────────
 *  The bay header's centerpiece. Replaces what used to be a single
 *  "TRADING DESK · EUR/USD · 1.0843" eyebrow + ticker line with a full
 *  two-row editorial navigator inspired by the Institutional Signal
 *  Terminal (`components/execution-copilot/signal-terminal-header.tsx`)
 *  but recoded into the VANTARY hairline editorial language.
 *
 *  ROW A — IDENTITY & TICKER
 *  ┌────────────────────────────────────────────────────────────────────┐
 *  │ ▌▍▎▏  TRADING DESK             EUR / USD   1.0843  ▲ 0.12%   ⌕  ⚙ │
 *  │       Institutional Confluence                                      │
 *  └────────────────────────────────────────────────────────────────────┘
 *  Six-bar editorial glyph, an eyebrow + subtitle title block, a large
 *  symbol/price/change ticker pill, a search-modal trigger, and a
 *  customize-gear that opens a popover.
 *
 *  ROW B — NAVIGATOR STRIP
 *  ┌────────────────────────────────────────────────────────────────────┐
 *  │ ★ EUR/USD  BTC/USDT │ FUTURES  INDEX  FX*  METALS  CRYPTO  STOCK │ R│
 *  └────────────────────────────────────────────────────────────────────┘
 *  Pinned favourites strip on the left, hideable category dropdowns in
 *  the middle, recents trail on the right. Every chip has a hover
 *  dropdown of the instruments in that category. The whole strip is
 *  customizable via the gear's popover (toggle which categories show,
 *  manage favourites, clear recents).
 *
 *  All preferences (visible categories, favourites, recents) persist
 *  through TdPersistedState in `./data.ts` and `./provider.tsx` — survive
 *  reloads, scoped to the bay's localStorage key.
 *
 *  Pure VANTARY tokens (amber / paper / ash / rule). Zero hard-coded
 *  colors. Full a11y (radiogroup semantics, escape-to-close popovers,
 *  outside-click dismissal, focus trapping inside popovers).
 * ═══════════════════════════════════════════════════════════════════════ */

import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Settings2,
  Star,
  X,
  ChevronDown,
  Pin,
  History,
  Share2,
} from "lucide-react"

import { useTradingDesk } from "./provider"
import {
  DEMO_SYMBOLS,
  TdSymbol,
  TdSymbolCategory,
  TD_CATEGORIES_ORDER,
  TD_CATEGORY_LABELS,
  TD_CATEGORY_COUNTS,
  getSymbolsByCategory,
} from "./data"
import { VANTARY } from "../vantary-theme"

/* ════════════════════════════════════════════════════════════════════════════
 *  1.  EDITORIAL GLYPH  ·  six-bar mark
 *  ─────────────────────────────────────────────────────────────────────────
 *  Recoded from the equalizer SVG in `signal-terminal-header.tsx` but in the
 *  VANTARY editorial language — hairline strokes, asymmetric heights that
 *  read as a stylised price chart, amber accent on the centre bar to anchor
 *  the eye. Pure SVG, scales cleanly, single foreground colour.
 * ════════════════════════════════════════════════════════════════════════ */

export const NavGlyph = memo(function NavGlyph({
  size = 22,
  accent = VANTARY.amber,
  ink = VANTARY.paper,
}: {
  size?: number
  accent?: string
  ink?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      role="presentation"
    >
      <path d="M3.5 9.04 V14.96"  stroke={ink}    strokeWidth="1.4" strokeLinecap="round" />
      <path d="M7.04 6.5  V17.5"  stroke={ink}    strokeWidth="1.4" strokeLinecap="round" />
      <path d="M10.58 3.5 V20.5"  stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14.13 6.5  V17.5" stroke={ink}    strokeWidth="1.4" strokeLinecap="round" />
      <path d="M17.67 9.04 V14.96"stroke={ink}    strokeWidth="1.4" strokeLinecap="round" />
      <path d="M21.21 11.25 V12.75" stroke={ink}  strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
})

/* ════════════════════════════════════════════════════════════════════════════
 *  2.  TITLE BLOCK  ·  glyph + eyebrow + subtitle
 * ════════════════════════════════════════════════════════════════════════ */

const NavTitleBlock = memo(function NavTitleBlock() {
  return (
    <div className="flex items-center gap-3 flex-shrink-0">
      <NavGlyph size={22} />
      <div className="flex flex-col leading-tight">
        {/* Eyebrow uses paperDim — same subdued treatment the rest of
            the dashboard uses for section eyebrows ("● THE DECK · …",
            "● LIVE EQUITY VOLUME", "● ACTIVE WINDOWS"). The accent is
            reserved for true activation cues below. */}
        <span
          className="font-mono uppercase whitespace-nowrap"
          style={{
            fontSize:      11,
            letterSpacing: "0.32em",
            color:         VANTARY.paperDim,
            fontWeight:    500,
          }}
        >
          TRADING DESK
        </span>
        <span
          className="whitespace-nowrap font-serif italic hidden md:inline"
          style={{
            fontSize:    10.5,
            color:       VANTARY.ashSoft,
            marginTop:   1,
            letterSpacing: "0.04em",
          }}
        >
          Institutional Confluence Navigator
        </span>
      </div>
    </div>
  )
})

/* ════════════════════════════════════════════════════════════════════════════
 *  3.  TICKER PILL  ·  current symbol · last · change
 *  ─────────────────────────────────────────────────────────────────────────
 *  The "EUR/USD · 1.0843 · ▲ 0.12%" line — rendered as a single editorial
 *  pill that doubles as a target for the favourites pin button. Hover
 *  reveals the pin/unpin micro-button.
 * ════════════════════════════════════════════════════════════════════════ */

const NavTickerPill = memo(function NavTickerPill() {
  const { state, selectors, actions } = useTradingDesk()
  const sym = selectors.currentSymbol
  const isUp = (sym.fakeChangePct ?? 0) >= 0
  const isPinned = (state.navFavorites ?? []).includes(sym.id)

  return (
    <div
      role="group"
      aria-label={`Current instrument ${sym.displayName}`}
      className="flex items-center gap-3 flex-shrink-0"
      style={{
        padding:      "5px 12px 5px 14px",
        border:       `1px solid ${VANTARY.rule}`,
        borderRadius: 3,
        background:   VANTARY.ink ?? VANTARY.paper,
      }}
    >
      <span
        className="font-mono uppercase tabular-nums whitespace-nowrap"
        style={{ fontSize: 12.5, color: VANTARY.paper, fontWeight: 500, letterSpacing: "0.06em" }}
      >
        {sym.displayName.split(" · ")[0]}
      </span>

      <span aria-hidden style={{ width: 1, height: 12, background: VANTARY.rule }} />

      <span
        className="font-mono tabular-nums whitespace-nowrap"
        style={{ fontSize: 13, color: VANTARY.paper, fontWeight: 500 }}
      >
        {sym.fakeLast?.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 4,
        })}
      </span>

      {sym.fakeChangePct !== undefined && (
        <span
          className="font-mono tabular-nums whitespace-nowrap"
          style={{
            fontSize:   11,
            color:      isUp ? VANTARY.amber : VANTARY.paperDim,
            fontWeight: 500,
          }}
        >
          {isUp ? "▲" : "▼"} {Math.abs(sym.fakeChangePct).toFixed(2)}%
        </span>
      )}

      <button
        type="button"
        onClick={() => actions.nav.toggleFavorite(sym.id)}
        aria-label={isPinned ? "Unpin from favourites" : "Pin to favourites"}
        title={isPinned ? "Unpin from favourites" : "Pin to favourites"}
        className="flex items-center justify-center"
        style={{
          width:  22,
          height: 22,
          marginLeft: 2,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          color:  isPinned ? VANTARY.amber : VANTARY.ashSoft,
          transition: "color 0.18s",
        }}
      >
        {isPinned
          ? <Star size={12} strokeWidth={1.6} fill={VANTARY.amber} />
          : <Star size={12} strokeWidth={1.4} />}
      </button>
    </div>
  )
})

/* ════════════════════════════════════════════════════════════════════════════
 *  4.  CATEGORY CHIP  ·  hoverable dropdown of instruments in that category
 *  ─────────────────────────────────────────────────────────────────────────
 *  Hovers and clicks both open the dropdown (so it works for trackpad and
 *  touch). Click-outside dismisses. Active category (the one currently
 *  selected) gets the amber underline.
 * ════════════════════════════════════════════════════════════════════════ */

function CategoryChip({ cat }: { cat: TdSymbolCategory }) {
  const { state, actions } = useTradingDesk()
  const symbols = useMemo(() => getSymbolsByCategory(cat), [cat])
  const def     = TD_CATEGORY_LABELS[cat]
  const count   = TD_CATEGORY_COUNTS[cat]

  // The currently-selected symbol's category gets the amber accent.
  const currentSym = useMemo(
    () => DEMO_SYMBOLS.find(s => s.id === state.symbolId),
    [state.symbolId],
  )
  const isCurrent = currentSym?.category === cat

  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement | null>(null)

  // Click-outside + escape close
  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onDoc)
    document.addEventListener("keydown",   onKey)
    return () => {
      document.removeEventListener("mousedown", onDoc)
      document.removeEventListener("keydown",   onKey)
    }
  }, [open])

  return (
    <div ref={wrapRef} className="relative" style={{ minWidth: 0 }}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`${def.long} (${count})`}
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 font-mono uppercase whitespace-nowrap relative"
        style={{
          padding:       "5px 9px",
          fontSize:      10,
          letterSpacing: "0.20em",
          color:         isCurrent ? VANTARY.amber : VANTARY.paperDim,
          fontWeight:    isCurrent ? 500 : 400,
          background:    "transparent",
          border:        "none",
          cursor:        "pointer",
          transition:    "color 0.18s",
        }}
      >
        <span style={{ position: "relative" }}>
          {def.short}
          {isCurrent && (
            <motion.span
              aria-hidden
              layoutId="td-nav-cat-underline"
              style={{
                position:   "absolute",
                left:       0,
                right:      0,
                bottom:     -3,
                height:     1.5,
                background: VANTARY.amber,
              }}
              transition={{ type: "spring", stiffness: 360, damping: 32 }}
            />
          )}
        </span>
        <span
          className="font-mono tabular-nums"
          style={{
            fontSize: 9,
            color:    VANTARY.ashSoft,
            opacity:  0.85,
          }}
        >
          {count}
        </span>
        <ChevronDown
          size={10}
          strokeWidth={1.4}
          color={VANTARY.ashSoft}
          style={{
            transition: "transform 0.18s",
            transform:  open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{   opacity: 0, y: -4 }}
            transition={{ duration: 0.14 }}
            style={{
              position:   "absolute",
              top:        "calc(100% + 6px)",
              left:       0,
              minWidth:   240,
              maxHeight:  360,
              overflowY:  "auto",
              background: VANTARY.ink ?? VANTARY.paper,
              border:     `1px solid ${VANTARY.rule}`,
              borderRadius: 3,
              boxShadow:  "0 12px 28px -16px rgba(0,0,0,0.45)",
              zIndex:     50,
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between"
              style={{
                padding:      "8px 12px",
                borderBottom: `1px solid ${VANTARY.rule}`,
              }}
            >
              <span
                className="font-mono uppercase"
                style={{ fontSize: 9.5, letterSpacing: "0.22em", color: VANTARY.paperDim, fontWeight: 500 }}
              >
                {def.long}
              </span>
              <span
                className="font-mono tabular-nums"
                style={{ fontSize: 9.5, color: VANTARY.ashSoft }}
              >
                {count} INSTRUMENTS
              </span>
            </div>

            {/* List */}
            {symbols.map(sym => {
              const active = sym.id === state.symbolId
              const pinned = (state.navFavorites ?? []).includes(sym.id)
              return (
                <div
                  key={sym.id}
                  role="menuitem"
                  className="flex items-center gap-2 group"
                  style={{
                    padding:       "8px 12px",
                    borderBottom:  `1px solid ${VANTARY.rule}`,
                    background:    active ? VANTARY.amberWash : "transparent",
                    cursor:        "pointer",
                    transition:    "background 0.18s",
                  }}
                  onClick={() => {
                    actions.setSymbol(sym.id)
                    setOpen(false)
                  }}
                  onMouseEnter={e => {
                    if (!active) (e.currentTarget as HTMLElement).style.background = VANTARY.rule
                  }}
                  onMouseLeave={e => {
                    if (!active) (e.currentTarget as HTMLElement).style.background = "transparent"
                  }}
                >
                  <span
                    className="font-mono tabular-nums"
                    style={{
                      fontSize:   12,
                      color:      active ? VANTARY.amber : VANTARY.paper,
                      fontWeight: active ? 500 : 400,
                      flex:       1,
                      minWidth:   0,
                      overflow:   "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {sym.displayName}
                  </span>
                  {sym.fakeChangePct !== undefined && (
                    <span
                      className="font-mono tabular-nums whitespace-nowrap"
                      style={{
                        fontSize: 10,
                        color:    sym.fakeChangePct >= 0 ? VANTARY.amber : VANTARY.paperDim,
                      }}
                    >
                      {sym.fakeChangePct >= 0 ? "▲" : "▼"} {Math.abs(sym.fakeChangePct).toFixed(2)}%
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      actions.nav.toggleFavorite(sym.id)
                    }}
                    aria-label={pinned ? "Unpin from favourites" : "Pin to favourites"}
                    className="flex items-center justify-center"
                    style={{
                      width:      18,
                      height:     18,
                      border:     "none",
                      background: "transparent",
                      cursor:     "pointer",
                      color:      pinned ? VANTARY.amber : VANTARY.ashSoft,
                    }}
                  >
                    {pinned
                      ? <Pin size={10} strokeWidth={1.6} fill={VANTARY.amber} />
                      : <Pin size={10} strokeWidth={1.4} />}
                  </button>
                </div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
 *  5.  FAVOURITES STRIP  ·  pinned instruments at-a-glance
 * ════════════════════════════════════════════════════════════════════════ */

const FavoritesStrip = memo(function FavoritesStrip() {
  const { state, selectors, actions } = useTradingDesk()
  // Defensive fallback to [] — guards against pre-heal HYDRATE renders
  // and stale-HMR provider modules where the selector field is missing.
  const favs = selectors.favoriteSymbols ?? []

  if (favs.length === 0) {
    return (
      <span
        className="font-mono uppercase whitespace-nowrap hidden md:inline"
        style={{ fontSize: 9.5, letterSpacing: "0.22em", color: VANTARY.ashSoft, opacity: 0.65 }}
      >
        ★ NO FAVOURITES YET
      </span>
    )
  }

  return (
    <div className="flex items-center gap-1.5">
      <Star size={11} strokeWidth={1.5} color={VANTARY.amber} />
      {favs.map(sym => {
        const active = sym.id === state.symbolId
        return (
          <button
            key={sym.id}
            type="button"
            onClick={() => actions.setSymbol(sym.id)}
            aria-label={`Switch to ${sym.displayName}`}
            aria-pressed={active}
            className="font-mono uppercase tabular-nums whitespace-nowrap"
            style={{
              padding:       "3px 8px",
              fontSize:      10,
              letterSpacing: "0.16em",
              color:         active ? VANTARY.amber : VANTARY.paperDim,
              fontWeight:    active ? 500 : 400,
              background:    active ? VANTARY.amberWash : "transparent",
              border:        `1px solid ${active ? VANTARY.amberHalo : VANTARY.rule}`,
              borderRadius:  2,
              cursor:        "pointer",
              transition:    "color 0.18s, background 0.18s, border-color 0.18s",
            }}
            onMouseEnter={e => {
              if (!active) (e.currentTarget as HTMLElement).style.borderColor = VANTARY.ashSoft
            }}
            onMouseLeave={e => {
              if (!active) (e.currentTarget as HTMLElement).style.borderColor = VANTARY.rule
            }}
          >
            {sym.quote}
          </button>
        )
      })}
    </div>
  )
})

/* ════════════════════════════════════════════════════════════════════════════
 *  6.  RECENTS TRAIL  ·  last N viewed symbols
 * ════════════════════════════════════════════════════════════════════════ */

const RecentsTrail = memo(function RecentsTrail() {
  const { selectors, actions } = useTradingDesk()
  // Defensive fallback — see <FavoritesStrip/> for the same guard.
  const recents = selectors.recentSymbols ?? []
  if (recents.length === 0) return null

  return (
    <div className="hidden lg:flex items-center gap-2">
      <History size={11} strokeWidth={1.5} color={VANTARY.ashSoft} />
      <span
        className="font-mono uppercase"
        style={{ fontSize: 9, letterSpacing: "0.22em", color: VANTARY.ashSoft }}
      >
        RECENT
      </span>
      <div className="flex items-center gap-1">
        {recents.slice(0, 4).map(sym => (
          <button
            key={sym.id}
            type="button"
            onClick={() => actions.setSymbol(sym.id)}
            aria-label={`Switch to ${sym.displayName}`}
            className="font-mono uppercase whitespace-nowrap"
            style={{
              padding:       "2px 6px",
              fontSize:      9.5,
              letterSpacing: "0.14em",
              color:         VANTARY.paperDim,
              background:    "transparent",
              border:        "none",
              cursor:        "pointer",
              transition:    "color 0.18s",
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = VANTARY.paper)}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = VANTARY.paperDim)}
          >
            {sym.quote}
          </button>
        ))}
      </div>
    </div>
  )
})

/* ════════════════════════════════════════════════════════════════════════════
 *  7.  CUSTOMIZE POPOVER  ·  the gear button
 *  ─────────────────────────────────────────────────────────────────────────
 *  Two sections:
 *    A. Categories — checkboxes for each TdSymbolCategory. The reducer
 *       guards against turning off the last visible one.
 *    B. Favourites — chips of every pinned instrument with an unpin X.
 *       Plus a "Clear recents" link at the bottom.
 * ════════════════════════════════════════════════════════════════════════ */

function CustomizePopover({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, selectors, actions } = useTradingDesk()
  const wrapRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) onClose()
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("mousedown", onDoc)
    document.addEventListener("keydown",   onKey)
    return () => {
      document.removeEventListener("mousedown", onDoc)
      document.removeEventListener("keydown",   onKey)
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={wrapRef}
          role="dialog"
          aria-modal="false"
          aria-label="Customize navigator"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{   opacity: 0, y: -6 }}
          transition={{ duration: 0.16 }}
          style={{
            position:    "absolute",
            top:         "calc(100% + 8px)",
            right:       0,
            width:       320,
            maxHeight:   480,
            overflowY:   "auto",
            background:  VANTARY.ink ?? VANTARY.paper,
            border:      `1px solid ${VANTARY.rule}`,
            borderRadius: 3,
            boxShadow:   "0 16px 36px -18px rgba(0,0,0,0.5)",
            zIndex:      60,
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between"
            style={{ padding: "10px 14px", borderBottom: `1px solid ${VANTARY.rule}` }}
          >
            <span
              className="font-mono uppercase"
              style={{ fontSize: 10, letterSpacing: "0.28em", color: VANTARY.paperDim, fontWeight: 500 }}
            >
              CUSTOMIZE NAVIGATOR
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close customize panel"
              className="flex items-center justify-center"
              style={{
                width: 22, height: 22,
                border: "none", background: "transparent", cursor: "pointer",
                color: VANTARY.ashSoft,
              }}
            >
              <X size={12} strokeWidth={1.5} />
            </button>
          </div>

          {/* SECTION A — categories */}
          <div style={{ padding: "12px 14px", borderBottom: `1px solid ${VANTARY.rule}` }}>
            <div
              className="font-mono uppercase"
              style={{
                fontSize: 9, letterSpacing: "0.26em",
                color: VANTARY.ashSoft, marginBottom: 10,
              }}
            >
              ASSET CATEGORIES
            </div>
            <div className="flex flex-col gap-1">
              {TD_CATEGORIES_ORDER.map(cat => {
                const visible = (state.navVisibleCategories ?? []).includes(cat)
                const def     = TD_CATEGORY_LABELS[cat]
                const count   = TD_CATEGORY_COUNTS[cat]
                const isLast  = visible && (state.navVisibleCategories ?? []).length === 1
                return (
                  <label
                    key={cat}
                    className="flex items-center gap-3 cursor-pointer"
                    style={{
                      padding:    "6px 8px",
                      borderRadius: 2,
                      opacity:    isLast ? 0.55 : 1,
                      cursor:     isLast ? "not-allowed" : "pointer",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = VANTARY.rule
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = "transparent"
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={visible}
                      disabled={isLast}
                      onChange={() => actions.nav.toggleCategory(cat)}
                      aria-label={`${visible ? "Hide" : "Show"} ${def.long}`}
                      style={{ accentColor: VANTARY.amber, width: 13, height: 13 }}
                    />
                    <span
                      className="font-mono uppercase"
                      style={{
                        fontSize: 11, letterSpacing: "0.16em",
                        color: visible ? VANTARY.paper : VANTARY.paperDim,
                        flex: 1,
                      }}
                    >
                      {def.long}
                    </span>
                    <span
                      className="font-mono tabular-nums"
                      style={{ fontSize: 10, color: VANTARY.ashSoft }}
                    >
                      {count}
                    </span>
                  </label>
                )
              })}
            </div>
            {(state.navVisibleCategories ?? []).length === 1 && (
              <p
                className="font-mono"
                style={{
                  fontSize: 9.5, color: VANTARY.ashSoft,
                  marginTop: 8, fontStyle: "italic", lineHeight: 1.5,
                }}
              >
                At least one category must remain visible.
              </p>
            )}
          </div>

          {/* SECTION B — favourites */}
          <div style={{ padding: "12px 14px", borderBottom: `1px solid ${VANTARY.rule}` }}>
            <div
              className="font-mono uppercase flex items-center gap-2"
              style={{
                fontSize: 9, letterSpacing: "0.26em",
                color: VANTARY.ashSoft, marginBottom: 10,
              }}
            >
              <Star size={10} strokeWidth={1.5} color={VANTARY.amber} fill={VANTARY.amber} />
              <span>FAVOURITES · {(selectors.favoriteSymbols ?? []).length}</span>
            </div>
            {(selectors.favoriteSymbols ?? []).length === 0 ? (
              <p
                className="font-mono"
                style={{ fontSize: 10, color: VANTARY.ashSoft, fontStyle: "italic" }}
              >
                Click the star next to any symbol to pin it here.
              </p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {(selectors.favoriteSymbols ?? []).map(sym => (
                  <span
                    key={sym.id}
                    className="font-mono uppercase whitespace-nowrap flex items-center gap-1"
                    style={{
                      padding:       "3px 4px 3px 8px",
                      fontSize:      10,
                      letterSpacing: "0.14em",
                      color:         VANTARY.paper,
                      background:    VANTARY.amberWash,
                      border:        `1px solid ${VANTARY.amberHalo}`,
                      borderRadius:  2,
                    }}
                  >
                    {sym.quote}
                    <button
                      type="button"
                      onClick={() => actions.nav.toggleFavorite(sym.id)}
                      aria-label={`Unpin ${sym.displayName}`}
                      className="flex items-center justify-center"
                      style={{
                        width: 16, height: 16,
                        border: "none", background: "transparent", cursor: "pointer",
                        color: VANTARY.ashSoft,
                        marginLeft: 2,
                      }}
                    >
                      <X size={9} strokeWidth={1.5} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* SECTION C — recents */}
          <div style={{ padding: "12px 14px" }}>
            <div className="flex items-center justify-between">
              <div
                className="font-mono uppercase flex items-center gap-2"
                style={{ fontSize: 9, letterSpacing: "0.26em", color: VANTARY.ashSoft }}
              >
                <History size={10} strokeWidth={1.5} color={VANTARY.ashSoft} />
                <span>RECENTS · {(state.navRecents ?? []).length}</span>
              </div>
              {(state.navRecents ?? []).length > 0 && (
                <button
                  type="button"
                  onClick={() => actions.nav.clearRecents()}
                  className="font-mono uppercase"
                  style={{
                    fontSize: 9, letterSpacing: "0.18em",
                    color: VANTARY.paperDim,
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: "2px 4px",
                    transition: "color 0.18s",
                  }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = VANTARY.amber)}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = VANTARY.paperDim)}
                >
                  CLEAR
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
 *  8.  CUSTOMIZE BUTTON  ·  gear that mounts the popover
 * ════════════════════════════════════════════════════════════════════════ */

const NavCustomizeButton = memo(function NavCustomizeButton() {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Customize navigator"
        title="Customize navigator"
        className="flex items-center justify-center"
        style={{
          width:  28,
          height: 28,
          border: `1px solid ${open ? VANTARY.amberHalo : VANTARY.rule}`,
          background: open ? VANTARY.amberWash : "transparent",
          color:  open ? VANTARY.amber : VANTARY.paperDim,
          borderRadius: 3,
          cursor: "pointer",
          transition: "color 0.18s, background 0.18s, border-color 0.18s",
        }}
        onMouseEnter={e => {
          if (!open) {
            (e.currentTarget as HTMLElement).style.color = VANTARY.paper;
            (e.currentTarget as HTMLElement).style.borderColor = VANTARY.ashSoft
          }
        }}
        onMouseLeave={e => {
          if (!open) {
            (e.currentTarget as HTMLElement).style.color = VANTARY.paperDim;
            (e.currentTarget as HTMLElement).style.borderColor = VANTARY.rule
          }
        }}
      >
        <Settings2 size={14} strokeWidth={1.5} />
      </button>
      <CustomizePopover open={open} onClose={() => setOpen(false)} />
    </div>
  )
})

/* ════════════════════════════════════════════════════════════════════════════
 *  9.  SEARCH BUTTON  ·  reuses the SymbolPicker dropdown via its own popover
 *  ─────────────────────────────────────────────────────────────────────────
 *  We don't reach into SymbolPicker's internals; we render a small inline
 *  search input that filters DEMO_SYMBOLS and lets the trader jump straight
 *  to any instrument by typing.
 * ════════════════════════════════════════════════════════════════════════ */

function SearchPopover({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, actions } = useTradingDesk()
  const [q, setQ] = useState("")
  const inputRef = useRef<HTMLInputElement | null>(null)
  const wrapRef  = useRef<HTMLDivElement  | null>(null)

  useEffect(() => {
    if (open) inputRef.current?.focus()
    else setQ("")
  }, [open])

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) onClose()
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("mousedown", onDoc)
    document.addEventListener("keydown",   onKey)
    return () => {
      document.removeEventListener("mousedown", onDoc)
      document.removeEventListener("keydown",   onKey)
    }
  }, [open, onClose])

  const matches = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return DEMO_SYMBOLS.slice(0, 8)
    return DEMO_SYMBOLS.filter(s =>
      s.displayName.toLowerCase().includes(term) ||
      s.tvSymbol.toLowerCase().includes(term)    ||
      s.quote.toLowerCase().includes(term),
    ).slice(0, 12)
  }, [q])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={wrapRef}
          role="dialog"
          aria-label="Search instruments"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{   opacity: 0, y: -6 }}
          transition={{ duration: 0.16 }}
          style={{
            position:    "absolute",
            top:         "calc(100% + 8px)",
            right:       0,
            width:       320,
            background:  VANTARY.ink ?? VANTARY.paper,
            border:      `1px solid ${VANTARY.rule}`,
            borderRadius: 3,
            boxShadow:   "0 16px 36px -18px rgba(0,0,0,0.5)",
            zIndex:      60,
          }}
        >
          <div
            className="flex items-center gap-2"
            style={{ padding: "8px 12px", borderBottom: `1px solid ${VANTARY.rule}` }}
          >
            <Search size={12} strokeWidth={1.5} color={VANTARY.ashSoft} />
            <input
              ref={inputRef}
              type="search"
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search instruments…"
              aria-label="Search instruments"
              className="font-mono"
              style={{
                flex:       1,
                padding:    "4px 0",
                fontSize:   12,
                color:      VANTARY.paper,
                background: "transparent",
                border:     "none",
                outline:    "none",
              }}
            />
            <span
              className="font-mono uppercase"
              style={{ fontSize: 9, letterSpacing: "0.18em", color: VANTARY.ashSoft }}
            >
              {matches.length}
            </span>
          </div>
          <div style={{ maxHeight: 320, overflowY: "auto" }}>
            {matches.length === 0 ? (
              <p
                className="font-mono"
                style={{
                  padding: "16px 12px", fontSize: 10,
                  color: VANTARY.ashSoft, fontStyle: "italic",
                }}
              >
                No matches for "{q}"
              </p>
            ) : (
              matches.map(sym => {
                const active = sym.id === state.symbolId
                return (
                  <button
                    key={sym.id}
                    type="button"
                    onClick={() => {
                      actions.setSymbol(sym.id)
                      onClose()
                    }}
                    className="flex items-center gap-2 w-full text-left"
                    style={{
                      padding:      "7px 12px",
                      borderBottom: `1px solid ${VANTARY.rule}`,
                      background:   active ? VANTARY.amberWash : "transparent",
                      border:       "none",
                      cursor:       "pointer",
                    }}
                    onMouseEnter={e => {
                      if (!active) (e.currentTarget as HTMLElement).style.background = VANTARY.rule
                    }}
                    onMouseLeave={e => {
                      if (!active) (e.currentTarget as HTMLElement).style.background = "transparent"
                    }}
                  >
                    <span
                      className="font-mono uppercase"
                      style={{
                        fontSize: 8.5, letterSpacing: "0.18em",
                        color: VANTARY.ashSoft, width: 50, flexShrink: 0,
                      }}
                    >
                      {sym.category === "FOREX" ? "FX" : sym.category}
                    </span>
                    <span
                      className="font-mono"
                      style={{
                        fontSize: 12,
                        color: active ? VANTARY.amber : VANTARY.paper,
                        flex: 1,
                      }}
                    >
                      {sym.displayName}
                    </span>
                    {sym.fakeChangePct !== undefined && (
                      <span
                        className="font-mono tabular-nums"
                        style={{
                          fontSize: 10,
                          color: sym.fakeChangePct >= 0 ? VANTARY.amber : VANTARY.paperDim,
                        }}
                      >
                        {sym.fakeChangePct >= 0 ? "▲" : "▼"} {Math.abs(sym.fakeChangePct).toFixed(2)}%
                      </span>
                    )}
                  </button>
                )
              })
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const NavSearchButton = memo(function NavSearchButton() {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Search instruments"
        title="Search instruments"
        className="flex items-center justify-center"
        style={{
          width:  28,
          height: 28,
          border: `1px solid ${open ? VANTARY.amberHalo : VANTARY.rule}`,
          background: open ? VANTARY.amberWash : "transparent",
          color:  open ? VANTARY.amber : VANTARY.paperDim,
          borderRadius: 3,
          cursor: "pointer",
          transition: "color 0.18s, background 0.18s, border-color 0.18s",
        }}
        onMouseEnter={e => {
          if (!open) {
            (e.currentTarget as HTMLElement).style.color = VANTARY.paper;
            (e.currentTarget as HTMLElement).style.borderColor = VANTARY.ashSoft
          }
        }}
        onMouseLeave={e => {
          if (!open) {
            (e.currentTarget as HTMLElement).style.color = VANTARY.paperDim;
            (e.currentTarget as HTMLElement).style.borderColor = VANTARY.rule
          }
        }}
      >
        <Search size={14} strokeWidth={1.5} />
      </button>
      <SearchPopover open={open} onClose={() => setOpen(false)} />
    </div>
  )
})

/* ════════════════════════════════════════════════════════════════════════════
 *  10.  CATEGORY STRIP  ·  the row of category dropdowns
 * ════════════════════════════════════════════════════════════════════════ */

const NavCategoryStrip = memo(function NavCategoryStrip() {
  const { state } = useTradingDesk()
  const visible = state.navVisibleCategories ?? []
  return (
    <div className="flex items-center" style={{ gap: 2 }}>
      {visible.map((cat, i) => (
        <div key={cat} className="flex items-center" style={{ gap: 2 }}>
          {i > 0 && (
            <span aria-hidden style={{ width: 1, height: 11, background: VANTARY.rule, opacity: 0.7 }} />
          )}
          <CategoryChip cat={cat} />
        </div>
      ))}
    </div>
  )
})

/* ════════════════════════════════════════════════════════════════════════════
 *  11.  PUBLIC COMPOSITES  ·  what the bay header actually mounts
 *  ─────────────────────────────────────────────────────────────────────────
 *  <NavigatorIdentity/> — Row A: glyph + title block + ticker pill
 *  <NavigatorTools/>    — Row A right side: search + customize gear
 *  <NavigatorBrowser/>  — Row B: favourites + categories + recents
 *
 *  The shell mounts these in 2 rows so the visual rhythm is:
 *  Row A = identity (who am I + what am I looking at + tools)
 *  Row B = navigation (where can I go + what's pinned + what was recent)
 * ════════════════════════════════════════════════════════════════════════ */

export const NavigatorIdentity = memo(function NavigatorIdentity() {
  return (
    <div className="flex items-center gap-4 min-w-0">
      <NavTitleBlock />
      <NavTickerPill />
    </div>
  )
})

export const NavigatorTools = memo(function NavigatorTools() {
  return (
    <div className="flex items-center gap-2">
      <NavSearchButton />
      <NavCustomizeButton />
    </div>
  )
})

export const NavigatorBrowser = memo(function NavigatorBrowser() {
  return (
    <div
      className="flex items-center gap-4 flex-wrap"
      style={{ minHeight: 32 }}
    >
      <FavoritesStrip />
      <span aria-hidden style={{ width: 1, height: 14, background: VANTARY.rule }} />
      <NavCategoryStrip />
      <span aria-hidden className="flex-1" style={{ minWidth: 8 }} />
      <RecentsTrail />
    </div>
  )
})

/* ════════════════════════════════════════════════════════════════════════════
 *  12.  SIGNAL CATEGORY PILL  ·  rounded-full dropdown
 *  ─────────────────────────────────────────────────────────────────────────
 *  This is the trigger style used by the Institutional Signal Terminal
 *  page (`/copilot` → `signal-terminal-header.tsx`): rounded-full pills
 *  labelled "Pairs / Indices / Crypto / Commodities" that open a
 *  dropdown of every instrument in that category. Recoded into the bay's
 *  amber/dark editorial palette and wired to the trading-desk provider
 *  so picking an instrument actually drives the chart.
 *
 *  Internal dropdown content mirrors `<CategoryChip/>` — same a11y
 *  scaffolding (click-outside, escape-to-close), same row layout
 *  (display-name + change-pct + pin button). The two components differ
 *  only in trigger skin: this one is a rounded pill, `<CategoryChip/>`
 *  is a hairline mono chip used in Row B's compact navigator.
 * ════════════════════════════════════════════════════════════════════════ */

function SignalCategoryPill({ cat }: { cat: TdSymbolCategory }) {
  const { state, actions } = useTradingDesk()
  const symbols     = useMemo(() => getSymbolsByCategory(cat), [cat])
  const def         = TD_CATEGORY_LABELS[cat]
  const count       = TD_CATEGORY_COUNTS[cat]
  const currentSym  = useMemo(
    () => DEMO_SYMBOLS.find(s => s.id === state.symbolId),
    [state.symbolId],
  )
  const isCurrent   = currentSym?.category === cat

  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onDoc)
    document.addEventListener("keydown",   onKey)
    return () => {
      document.removeEventListener("mousedown", onDoc)
      document.removeEventListener("keydown",   onKey)
    }
  }, [open])

  return (
    <div ref={wrapRef} className="relative flex-shrink-0">
      {/* M5 · CategoryPill re-skinned to match the TickerCapsule chip
       * language. Lower font (12.5 → 11), tighter pad (6×14 → 5×11),
       * mono uppercase with 0.18em tracking so it reads in the same
       * typographic family as SESSION / OPENS / PLAN / RISK USED in
       * the rail above us. ChevronDown shrinks 13 → 11 to match.
       *
       * The hover/active states keep the original semantics — open
       * dropdown lights amber, current-category pill carries an amber
       * tint — but in the chip's quieter visual register. */}
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`${def.long} — ${count} instruments`}
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1 whitespace-nowrap rounded-full font-mono uppercase"
        style={{
          padding:       "5px 11px",
          fontSize:      11,
          letterSpacing: "0.16em",
          color:         isCurrent ? VANTARY.amber : VANTARY.paperDim,
          fontWeight:    isCurrent ? 500 : 400,
          background:    open
            ? VANTARY.rule
            : isCurrent
              ? VANTARY.amberWash
              : "transparent",
          border:        `1px solid ${isCurrent ? VANTARY.amberHalo : "transparent"}`,
          cursor:        "pointer",
          transition:    "color 0.18s, background 0.18s, border-color 0.18s, transform 0.16s",
        }}
        onMouseEnter={e => {
          if (!isCurrent && !open) {
            (e.currentTarget as HTMLElement).style.background = VANTARY.rule
          }
          /* M10 · subtle hover micro-scale on every chip in the rail. */
          ;(e.currentTarget as HTMLElement).style.transform = "scale(1.02)"
        }}
        onMouseLeave={e => {
          if (!isCurrent && !open) {
            (e.currentTarget as HTMLElement).style.background = "transparent"
          }
          ;(e.currentTarget as HTMLElement).style.transform = "scale(1)"
        }}
      >
        {def.long}
        <ChevronDown
          size={11}
          strokeWidth={1.6}
          style={{
            transition: "transform 0.18s",
            transform:  open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{   opacity: 0, y: -4 }}
            transition={{ duration: 0.14 }}
            style={{
              position:   "absolute",
              top:        "calc(100% + 6px)",
              left:       0,
              minWidth:   260,
              maxHeight:  380,
              overflowY:  "auto",
              background: VANTARY.ink ?? VANTARY.paper,
              border:     `1px solid ${VANTARY.rule}`,
              borderRadius: 6,
              boxShadow:  "0 16px 36px -18px rgba(0,0,0,0.5)",
              zIndex:     50,
            }}
          >
            <div
              className="flex items-center justify-between"
              style={{
                padding:      "10px 14px",
                borderBottom: `1px solid ${VANTARY.rule}`,
              }}
            >
              <span
                className="font-mono uppercase"
                style={{
                  fontSize:      9.5,
                  letterSpacing: "0.22em",
                  color:         VANTARY.paperDim,
                  fontWeight:    500,
                }}
              >
                {def.long}
              </span>
              <span
                className="font-mono tabular-nums"
                style={{ fontSize: 9.5, color: VANTARY.ashSoft }}
              >
                {count} INSTRUMENTS
              </span>
            </div>

            {symbols.map(sym => {
              const active = sym.id === state.symbolId
              const pinned = (state.navFavorites ?? []).includes(sym.id)
              return (
                <div
                  key={sym.id}
                  role="menuitem"
                  className="flex items-center gap-2"
                  style={{
                    padding:       "8px 14px",
                    borderBottom:  `1px solid ${VANTARY.rule}`,
                    background:    active ? VANTARY.amberWash : "transparent",
                    cursor:        "pointer",
                    transition:    "background 0.18s",
                  }}
                  onClick={() => {
                    actions.setSymbol(sym.id)
                    setOpen(false)
                  }}
                  onMouseEnter={e => {
                    if (!active) (e.currentTarget as HTMLElement).style.background = VANTARY.rule
                  }}
                  onMouseLeave={e => {
                    if (!active) (e.currentTarget as HTMLElement).style.background = "transparent"
                  }}
                >
                  <span
                    className="font-mono tabular-nums"
                    style={{
                      fontSize:     12.5,
                      color:        active ? VANTARY.amber : VANTARY.paper,
                      fontWeight:   active ? 500 : 400,
                      flex:         1,
                      minWidth:     0,
                      overflow:     "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace:   "nowrap",
                    }}
                  >
                    {sym.displayName}
                  </span>
                  {sym.fakeChangePct !== undefined && (
                    <span
                      className="font-mono tabular-nums whitespace-nowrap"
                      style={{
                        fontSize: 10.5,
                        color:    sym.fakeChangePct >= 0 ? VANTARY.amber : VANTARY.paperDim,
                      }}
                    >
                      {sym.fakeChangePct >= 0 ? "▲" : "▼"} {Math.abs(sym.fakeChangePct).toFixed(2)}%
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation()
                      actions.nav.toggleFavorite(sym.id)
                    }}
                    aria-label={pinned ? "Unpin from favourites" : "Pin to favourites"}
                    className="flex items-center justify-center"
                    style={{
                      width:      20,
                      height:     20,
                      border:     "none",
                      background: "transparent",
                      cursor:     "pointer",
                      color:      pinned ? VANTARY.amber : VANTARY.ashSoft,
                    }}
                  >
                    {pinned
                      ? <Pin size={11} strokeWidth={1.6} fill={VANTARY.amber} />
                      : <Pin size={11} strokeWidth={1.4} />}
                  </button>
                </div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
 *  13.  SIGNAL SHARE BUTTON  ·  copies a layout snapshot to clipboard
 *  ─────────────────────────────────────────────────────────────────────────
 *  In the original signal-terminal-header.tsx the share button was a
 *  static visual placeholder. Here we wire it to a real action: when
 *  clicked, we snapshot the current (symbol · interval · layout) tuple
 *  and copy it as a deep-link-ish text payload to the clipboard. If
 *  clipboard access fails we fall back silently — the button still
 *  shows a transient "COPIED" / "FAILED" feedback either way.
 * ════════════════════════════════════════════════════════════════════════ */

const SignalShareButton = memo(function SignalShareButton() {
  const { state, selectors } = useTradingDesk()
  const [feedback, setFeedback] = useState<"idle" | "copied" | "failed">("idle")

  const onShare = useCallback(async () => {
    const sym = selectors.currentSymbol
    const itv = selectors.currentInterval
    const payload =
      `Trading Desk · ${sym.tvSymbol} · ${itv.label} · ${state.layout}`

    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(payload)
        setFeedback("copied")
      } else {
        setFeedback("failed")
      }
    } catch {
      setFeedback("failed")
    }
    window.setTimeout(() => setFeedback("idle"), 1600)
  }, [state.layout, selectors.currentSymbol, selectors.currentInterval])

  const label =
    feedback === "copied" ? "Copied"
    : feedback === "failed" ? "Failed"
    : "Share Layout"

  return (
    <button
      type="button"
      onClick={onShare}
      aria-label="Share layout"
      title="Share layout (copies a snapshot to clipboard)"
      className="flex items-center gap-2 rounded-full whitespace-nowrap"
      style={{
        padding:    "6px 14px",
        fontSize:   12,
        color:      feedback === "copied" ? VANTARY.amber : VANTARY.paperDim,
        background: feedback === "copied" ? VANTARY.amberWash : "transparent",
        border:     `1px solid ${feedback === "copied" ? VANTARY.amberHalo : "transparent"}`,
        cursor:     "pointer",
        transition: "color 0.18s, background 0.18s, border-color 0.18s",
      }}
      onMouseEnter={e => {
        if (feedback !== "copied") {
          (e.currentTarget as HTMLElement).style.background = VANTARY.rule
          ;(e.currentTarget as HTMLElement).style.color = VANTARY.paper
        }
      }}
      onMouseLeave={e => {
        if (feedback !== "copied") {
          (e.currentTarget as HTMLElement).style.background = "transparent"
          ;(e.currentTarget as HTMLElement).style.color = VANTARY.paperDim
        }
      }}
    >
      <Share2 size={12} strokeWidth={1.5} />
      <span>{label}</span>
    </button>
  )
})

/* ════════════════════════════════════════════════════════════════════════════
 *  14.  SIGNAL NAVIGATOR  ·  the actual port of `SignalTerminalHeader`
 *  ───────────────�����─────────────────────────────────────────────────────────
 *  Two-row composition matching the institutional signal terminal:
 *
 *  Row 1 (title row) — bars-glyph + "Institutional Signal Terminal" +
 *    "Live Confluence & Scenario Analysis…" subtitle on the left, with
 *    a `rightControls` slot on the right reserved for the bay-specific
 *    control rail (interval picker, layout chips, side-slot chips,
 *    window controls). The signal terminal page itself doesn't have
 *    those, but the dashboard bay needs them — this is the cleanest
 *    place to host them without breaking the visual rhythm.
 *
 *  Row 2 (control panel) — a rounded inner panel with hairline border,
 *    containing: ticker pill (current symbol/price/change), divider,
 *    one rounded `<SignalCategoryPill/>` per visible category (Forex,
 *    Indexes, Crypto, Metals, Futures, Stocks), spacer, search button,
 *    share button. Same vocabulary as `signal-terminal-header.tsx`,
 *    just rebound to the bay's amber/dark editorial tokens.
 *
 *  All preferences (which categories show, current symbol, favourites)
 *  flow through the existing TdProvider, so the navigator picks up
 *  customizations made via the Row B browser's gear menu — and any
 *  symbol picked here updates the chart and the rest of the bay.
 * ══════════════════════════════════════════════════════════════════════��═ */

export interface SignalNavigatorProps {
  /** Bay-specific controls (interval, layout, slot, window). Rendered
   *  on the right side of the title row so they sit next to the
   *  navigator's identity block without crowding the control panel. */
  rightControls?: ReactNode
  /** Controls pinned to the LEFT edge of the header — where the old
   *  identity chip used to live. The trading desk uses this slot for the
   *  Chromatic theme switcher so the page's only persistent "fixed"
   *  overlays now live inline in the chart header instead. */
  leftControls?: ReactNode
}

/* Categories that actually appear as pills inside the bay's navigator.
 * Metals / Crypto / Stocks were intentionally removed at the trader's
 * request — the goal is to free horizontal real-estate so the bay's
 * identity (Confluence Bridge title + subtitle), the category
 * dropdowns, the layout/slot toggles, and the right-edge actions all
 * fit in a SINGLE consolidated row without crowding.
 *
 * NOTE: this restriction is purely cosmetic. The full
 * TD_CATEGORIES_ORDER set still drives the customize popover, the
 * symbol bank, persistence, and any other category-aware widget — only
 * the pill row in this header is filtered. So traders who deep-link to
 * a metals/crypto/stock symbol still see it work everywhere else. */
const NAV_VISIBLE_CATEGORIES = new Set<TdSymbolCategory>([
  "FUTURES",
  "INDEX",
  "FOREX",
])

export const SignalNavigator = memo(function SignalNavigator({
  rightControls,
  leftControls,
}: SignalNavigatorProps) {
  const { state } = useTradingDesk()
  const visible = (state.navVisibleCategories ?? TD_CATEGORIES_ORDER)
    .filter(c => NAV_VISIBLE_CATEGORIES.has(c))

  /* M1 (in shell.tsx) flattened the parent <HeaderStrip/> background
   * to transparent. M7 + M9 here tighten the navigator's own padding
   * and rhythm so it reads as a sibling of the TickerStrip above it
   * — same vertical density, same gap rhythm, same chip language. */
  return (
    <div
      className="flex items-center flex-wrap"
      style={{
        /* M7 · padding 10×16 → 7×16 to match ticker rail vertical.
         * M9 · columnGap 24 → 12 to match the capsule rhythm. */
        rowGap:    6,
        columnGap: 12,
        padding:   "7px 16px",
      }}
    >
      {/* ── ARCHIO surgical cleanup ──────────────────────────────────────
            The trader requested removal of the BRIDGE · Confluence Bridge
            identity chip AND the FUTURES / CASH INDEXES / FOREX PAIRS
            category pill cluster from this navigator row. Rationale:
            those controls duplicated chart-level state that's already
            served by the symbol search + TradingView's own picker, and
            their horizontal weight was crowding the right-edge action
            rail (CHART · SPLIT … Share Layout … Customize).
            
            We keep the underlying logic intact — `NAV_VISIBLE_CATEGORIES`,
            the `visible` array, the `SignalCategoryPill` component, and
            the `TdProvider`-driven state are all untouched — so a future
            "Show categories" toggle can restore the cluster in one line.
            Only the visible row is collapsed. The `<span flex-1/>` spacer
            below pushes the right rail to the row tail, preserving the
            original right-edge layout. */}
      {/* (intentionally empty: identity chip, divider, and category cluster
           are suppressed) */}
      {/* LEFT RAIL · persistent page controls (theme switcher) that used
          to float `fixed` in the top-left corner now dock here in the
          chart header's empty left side. */}
      {leftControls && (
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {leftControls}
        </div>
      )}
      <span aria-hidden className="flex-1" style={{ minWidth: 12 }} />
      {/* `visible` retained as a no-op reference so the prop pipeline
           from <TdProvider/> doesn't dead-code-eliminate when nothing
           reads it in this row. */}
      <span aria-hidden hidden data-nav-visible-count={visible.length} />

      {/* RIGHT RAIL · bay-specific layout/slot/window controls passed
          in as a render-prop by <BayHeader/>, plus the navigator's
          own search / share / customize actions. */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {rightControls}
        {rightControls && (
          <span
            aria-hidden
            style={{
              width:      1,
              height:     12,
              background: VANTARY.rule,
              marginLeft: 2,
              marginRight: 2,
            }}
          />
        )}
        <NavSearchButton />
        <SignalShareButton />
        <NavCustomizeButton />
      </div>
    </div>
  )
})
