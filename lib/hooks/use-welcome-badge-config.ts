"use client"

/* ═══════════════════════════════════════════════════════════════════════════
   useWelcomeBadgeConfig — The Trader Cartouche persistence hook · v2
   ───────────────────────────────────────────────────────────────────────────
   ARCHIO upgrade: the cartouche evolved from "3 stacked badges per wing"
   into a **6-cell grid** (3 cols × max 2 rows) populated by living gadgets
   of size s / m / l (col-span 1 / 2 / 3). Each wing carries an ORDERED list
   of gadget ids whose declared sizes must pack into ≤ 2 rows summing to
   exactly 3 cells per row.

   What this hook owns:
     · gadgets         — ordered { left: string[]; right: string[] }
     · setSlot         — replace a gadget at an index
     · addGadget       — append, if a row can still fit the size
     · removeGadget    — splice, with row-pack repair
     · reset           — restore the narrative-default loadout
     · canFit          — pure helper: would this gadget fit if added?

   Persistence:
     localStorage key `vantary:welcome-cartouche:v2`. The legacy v1 keys
     `vantary:welcome-badges:v1` are migrated on first read (mapping the
     legacy 3-slot lists into the new ordered list, dropping unknown ids).

   Storage adapter:
     Swap `readStorage` / `writeStorage` for a `user_welcome_cartouche`
     Supabase table with (user_id, side, position, gadget_id, updated_at)
     and the component contract is unchanged.

   Back-compat:
     `leftSlots` / `rightSlots` / `setSlot` / `WELCOME_SLOT_COUNT` are
     STILL EXPORTED so any not-yet-migrated caller keeps compiling.
     New code should consume `gadgets` and the size-aware API.
   ═══════════════════════════════════════════════════════════════════════════ */

import { useCallback, useEffect, useMemo, useState } from "react"

export type CartoucheSide = "left" | "right"
export type GadgetSize = "s" | "m" | "l"

/* ── Layout constants ────────────────────────────────────────────────── */
/** Cells per row (sum of gadget sizes per row must equal this). */
export const CELLS_PER_ROW = 3
/** Max rows per wing (the cartouche keeps a two-row instrument-panel feel). */
export const MAX_ROWS_PER_WING = 2

/** Shared row-track height (px) for the cartouche wings. Both wings render
 *  their rows onto this same track so that row N on the left lines up to the
 *  pixel with row N on the right — fixing the ragged baseline where a tall
 *  left gadget (e.g. Management Pulse) overhung a shorter right one (Last 5
 *  Trades). Cells stretch to fill the track; their inner content centers. */
export const WING_ROW_TRACK = 76
/** Vertical gap between the two wing rows. */
export const WING_ROW_GAP = 6

/** Convert a size key to its col-span integer. */
export function sizeToCols(size: GadgetSize): number {
  return size === "l" ? 3 : size === "m" ? 2 : 1
}

/* ── Back-compat slot count (was 3 — same as CELLS_PER_ROW now) ─────── */
export const WELCOME_SLOT_COUNT = CELLS_PER_ROW

/* ── Default loadout · the narrative arc (v3 · promoted + deduped) ──────────
      LEFT  · row 1 → firm-identity (S) + discipline-pulse (M)   [= 3 cols, full]
              row 2 → management-pulse (L)                       [= 3 cols, full]
      RIGHT · row 1 → accuracy-engine (M) + best-pair (S)        [= 3 cols, full]
              row 2 → last-5-trades (L)                          [= 3 cols, full]

      Reads as: "who am I + am I disciplined + what's my capital doing" on the
      left; "how sharp am I + what works + recent history" on the right.

      DEDUPE (full): session-clockwork and macro-pulse are removed from the
      wings entirely — the top status rail (MarketFloorEyebrowRail) is now the
      single source of session + next-event, so the wings never restate them.
      win-rate-heart and equity-beacon-live are likewise omitted by default
      (their signal lives inside accuracy-engine and management-pulse).

      Both wings pack to EXACTLY 2 full rows — no overflow past the hard
      MAX_ROWS_PER_WING cap, no half-empty trailing row. */
export const DEFAULT_LEFT_GADGETS: readonly string[] = [
  "firm-identity",
  "discipline-pulse",
  "management-pulse",
]
export const DEFAULT_RIGHT_GADGETS: readonly string[] = [
  "accuracy-engine",
  "best-pair",
  "last-5-trades",
]

/* Back-compat aliases (some callers in the wider codebase may import these). */
export const DEFAULT_LEFT_BADGES = DEFAULT_LEFT_GADGETS
export const DEFAULT_RIGHT_BADGES = DEFAULT_RIGHT_GADGETS

const STORAGE_KEY_V3 = "vantary:welcome-cartouche:v3"
const STORAGE_KEY_V2 = "vantary:welcome-cartouche:v2"
const STORAGE_KEY_V1 = "vantary:welcome-badges:v1"

/* The OLD v2 default loadout. Used to detect sessions that were sitting on
 *  the previous default (rather than a real customization) so the v2→v3
 *  migration can hand them the new promoted+deduped default instead of
 *  pinning them to the stale arrangement forever. */
const LEGACY_V2_DEFAULT_LEFT  = ["management-pulse", "last-5-trades"]
const LEGACY_V2_DEFAULT_RIGHT = ["accuracy-engine", "best-pair", "session-clockwork", "macro-pulse"]

interface StoredConfig {
  left:  string[]
  right: string[]
}

function sameList(a: readonly string[], b: readonly string[]): boolean {
  return a.length === b.length && a.every((x, i) => x === b[i])
}

/* ────────────────────────────────────────────────────────────────────────
   Row-packing
   ──────────────────────────────────────────────────────────────────────── */

/** Given a sequence of sizes, produce row groupings of cell-sum ≤ CELLS_PER_ROW.
 *  Greedy left-to-right packer; if a row would overflow, start a new row. */
export function packRows<T extends { size: GadgetSize }>(
  items: readonly T[],
): readonly T[][] {
  const rows: T[][] = []
  let current: T[] = []
  let sum = 0
  for (const item of items) {
    const cols = sizeToCols(item.size)
    if (sum + cols > CELLS_PER_ROW) {
      if (current.length) rows.push(current)
      current = [item]
      sum = cols
    } else {
      current.push(item)
      sum += cols
    }
  }
  if (current.length) rows.push(current)
  return rows
}

/** Returns true if appending `nextSize` to the existing `currentSizes`
 *  list keeps the layout within 2 rows of 3 cells each. */
export function canFitGadget(
  currentSizes: readonly GadgetSize[],
  nextSize: GadgetSize,
): boolean {
  const packed = packRows([...currentSizes, nextSize].map((s) => ({ size: s })))
  return packed.length <= MAX_ROWS_PER_WING
}

/* ── Storage adapter ──────────────────────────����──────────────────────── */
function readStorage(): StoredConfig | null {
  if (typeof window === "undefined") return null
  try {
    /* ── v3: current schema ──────────────────────────────────────── */
    const rawV3 = window.localStorage.getItem(STORAGE_KEY_V3)
    if (rawV3) {
      const parsed = JSON.parse(rawV3) as Partial<StoredConfig>
      if (parsed && Array.isArray(parsed.left) && Array.isArray(parsed.right)) {
        return {
          left:  parsed.left.map(String),
          right: parsed.right.map(String),
        }
      }
    }
    /* ── v2 migration: if the session was on the OLD default, hand it the
          NEW promoted+deduped default; otherwise preserve their real
          customization but strip the now-removed session/macro gadgets. ── */
    const rawV2 = window.localStorage.getItem(STORAGE_KEY_V2)
    if (rawV2) {
      const parsed = JSON.parse(rawV2) as Partial<StoredConfig>
      if (parsed && Array.isArray(parsed.left) && Array.isArray(parsed.right)) {
        const wasOldDefault =
          sameList(parsed.left.map(String), LEGACY_V2_DEFAULT_LEFT) &&
          sameList(parsed.right.map(String), LEGACY_V2_DEFAULT_RIGHT)
        if (wasOldDefault) {
          return { left: [...DEFAULT_LEFT_GADGETS], right: [...DEFAULT_RIGHT_GADGETS] }
        }
        return {
          left:  parsed.left.map(String),
          right: parsed.right.map(String),
        }
      }
    }
    /* ── v1 migration: map legacy badge ids → closest gadget ids ──── */
    const rawV1 = window.localStorage.getItem(STORAGE_KEY_V1)
    if (rawV1) {
      try {
        const v1 = JSON.parse(rawV1) as { left?: string[]; right?: string[] }
        if (v1 && Array.isArray(v1.left) && Array.isArray(v1.right)) {
          return {
            left:  v1.left.map(migrateLegacyId).filter(Boolean) as string[],
            right: v1.right.map(migrateLegacyId).filter(Boolean) as string[],
          }
        }
      } catch { /* fall through */ }
    }
    return null
  } catch {
    return null
  }
}

function writeStorage(config: StoredConfig): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(STORAGE_KEY_V3, JSON.stringify(config))
  } catch {
    /* quota / private — silently degrade */
  }
}

/** Maps a legacy v1 badge id to its closest v2 gadget id. Unknown ids
 *  return null so the migration cleanly drops them. */
function migrateLegacyId(legacy: string): string | null {
  switch (legacy) {
    case "firm":              return "firm-identity"
    case "equity-beacon":     return "management-pulse"
    case "equity-spark":      return "equity-beacon-live"
    case "last-5-trades":     return "last-5-trades"
    case "last-trade":        return "last-5-trades"
    case "discipline-ring":   return "discipline-pulse"
    case "consistency-ring":  return "discipline-pulse"
    case "revenge-risk":      return "discipline-pulse"
    case "best-pair":         return "best-pair"
    case "worst-pair":        return "best-pair"
    case "best-setup":        return "best-pair"
    case "best-session":      return "session-clockwork"
    case "session-clock":     return "session-clockwork"
    case "next-event":        return "macro-pulse"
    case "win-rate":          return "win-rate-heart"
    case "profit-factor":     return "win-rate-heart"
    case "avg-r":             return "win-rate-heart"
    case "accuracy":          return "accuracy-engine"
    case "current-streak":    return "win-rate-heart"
    case "primary-goal":      return "firm-identity"
    case "discipline-streak": return "discipline-pulse"
    case "trades-used":       return "discipline-pulse"
    /* identity-only badges all fold into firm-identity */
    case "desk":
    case "tier":
    case "accounts":
    case "day-count":         return "firm-identity"
    default:                  return null
  }
}

/* ── Public hook ─────────────────────────────────────────────────────── */
export function useWelcomeBadgeConfig() {
  const [config, setConfig] = useState<StoredConfig>({
    left:  [...DEFAULT_LEFT_GADGETS],
    right: [...DEFAULT_RIGHT_GADGETS],
  })
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const stored = readStorage()
    if (stored && (stored.left.length || stored.right.length)) {
      setConfig(stored)
    }
    setHydrated(true)
  }, [])

  /** Replace a gadget at an index. */
  const setSlot = useCallback(
    (side: CartoucheSide, index: number, gadgetId: string) => {
      setConfig((prev) => {
        const next: StoredConfig = { left: [...prev.left], right: [...prev.right] }
        if (index < 0 || index >= next[side].length) return prev
        next[side][index] = gadgetId
        writeStorage(next)
        return next
      })
    },
    [],
  )

  /** Append a gadget if it still fits within MAX_ROWS_PER_WING.
   *  Returns true if it was added, false if rejected. Accepts an explicit
   *  size so the caller doesn't need to import the catalog here. */
  const addGadget = useCallback(
    (side: CartoucheSide, gadgetId: string, sizes: readonly GadgetSize[], nextSize: GadgetSize) => {
      let ok = false
      setConfig((prev) => {
        if (!canFitGadget(sizes, nextSize)) return prev
        const next: StoredConfig = { left: [...prev.left], right: [...prev.right] }
        next[side].push(gadgetId)
        writeStorage(next)
        ok = true
        return next
      })
      return ok
    },
    [],
  )

  /** Remove the gadget at index — pure splice; row-pack adjusts naturally. */
  const removeGadget = useCallback(
    (side: CartoucheSide, index: number) => {
      setConfig((prev) => {
        const next: StoredConfig = { left: [...prev.left], right: [...prev.right] }
        if (index < 0 || index >= next[side].length) return prev
        next[side].splice(index, 1)
        writeStorage(next)
        return next
      })
    },
    [],
  )

  /** ARCHIO · Send a gadget to the OPPOSITE wing.
   *  Validates that the destination wing can still fit the gadget within
   *  MAX_ROWS_PER_WING using `sizes` as the destination's current sizes.
   *  Returns true on success, false if rejected (no fit). */
  const moveGadget = useCallback(
    (
      fromSide:        CartoucheSide,
      index:           number,
      destSizes:       readonly GadgetSize[],
      movedGadgetSize: GadgetSize,
    ) => {
      let ok = false
      setConfig((prev) => {
        if (!canFitGadget(destSizes, movedGadgetSize)) return prev
        const next: StoredConfig = { left: [...prev.left], right: [...prev.right] }
        if (index < 0 || index >= next[fromSide].length) return prev
        const gid = next[fromSide][index]
        const destSide: CartoucheSide = fromSide === "left" ? "right" : "left"
        next[fromSide].splice(index, 1)
        next[destSide].push(gid)
        writeStorage(next)
        ok = true
        return next
      })
      return ok
    },
    [],
  )

  /** ARCHIO · Reorder within the same wing (drag-or-arrow nudge).
   *  `direction = -1` moves up, `+1` moves down. No-op at boundaries. */
  const reorderGadget = useCallback(
    (side: CartoucheSide, index: number, direction: -1 | 1) => {
      setConfig((prev) => {
        const list = prev[side]
        const next = Math.max(0, Math.min(list.length - 1, index + direction))
        if (next === index) return prev
        const arr = [...list]
        const [moved] = arr.splice(index, 1)
        arr.splice(next, 0, moved)
        const out: StoredConfig =
          side === "left"  ? { ...prev, left:  arr }
                           : { ...prev, right: arr }
        writeStorage(out)
        return out
      })
    },
    [],
  )

  /** Restore the narrative-default loadout. */
  const reset = useCallback(() => {
    const fresh: StoredConfig = {
      left:  [...DEFAULT_LEFT_GADGETS],
      right: [...DEFAULT_RIGHT_GADGETS],
    }
    setConfig(fresh)
    writeStorage(fresh)
  }, [])

  /** ARCHIO · Bulk-load a template-driven arrangement into both wings
   *  atomically. Used by the FlightDeck template picker when the trader
   *  selects a different loadout. We accept readonly arrays for ergonomic
   *  call sites (templates return readonly slot lists). */
  const loadGadgets = useCallback(
    (left: readonly string[], right: readonly string[]) => {
      const next: StoredConfig = {
        left:  [...left],
        right: [...right],
      }
      setConfig(next)
      writeStorage(next)
    },
    [],
  )

  /* Back-compat view: 3-slot legacy lists, padded/truncated. */
  const leftSlots  = useMemo(
    () => paddedSlots(config.left,  CELLS_PER_ROW),
    [config.left],
  )
  const rightSlots = useMemo(
    () => paddedSlots(config.right, CELLS_PER_ROW),
    [config.right],
  )

  return {
    /* New API */
    gadgets:       config,
    setSlot,
    addGadget,
    removeGadget,
    moveGadget,
    reorderGadget,
    reset,
    loadGadgets,
    canFit:        canFitGadget,
    hydrated,
    /* Back-compat */
    leftSlots,
    rightSlots,
  } as const
}

function paddedSlots(arr: readonly string[], n: number): readonly string[] {
  if (arr.length >= n) return arr.slice(0, n)
  return [...arr, ...Array(n - arr.length).fill("")]
}
