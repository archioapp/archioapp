"use client"

/* ═══════════════════════════════════════════════════════════════════════════
   ARCHIO · FLIGHT DECK · GADGET REGISTRY  (Phase A)
   ───────────────────────────────────────────────────────────────────────────
   The single source of LAYOUT TRUTH for every living gadget.

   Why a separate registry from `LIVING_GADGET_CATALOG`?
     · The catalog (in your-space.tsx) owns the `render` closures because they
       are bound to the telemetry adapters that live alongside them. Those
       closures cannot move without dragging ~600 lines of adapters with them.
     · This registry owns everything ELSE the layout system needs to reason
       about a gadget WITHOUT rendering it: its size, category, default side,
       visibility class, minimum safe width, and dedupe relationships.
     · The grid/slot/swap layer depends ONLY on this registry — never on the
       render closures — so positioning logic stays pure and testable.

   The catalog and this registry are reconciled by id at runtime via
   `mergeCatalogWithRegistry()`. A dev-time assertion guarantees the two never
   drift (every catalog id must have a registry entry and vice-versa).

   APPROVED DIRECTION (this rebuild):
     · FULL DEDUPE — session + macro + win-rate + equity-beacon are demoted to
       the dock; the top rail / richer instruments own those facts instead.
     · DEFAULT LOADOUT — promote Firm Identity + Discipline Pulse:
         LEFT : firm-identity (S) · management-pulse (L)  → row 1 packs S+? ,
                last-5-trades (L)                         → row 2
         RIGHT: accuracy-engine (M) · best-pair (S)       → row 1 (M+S = 3)
                discipline-pulse (M)                      → row 2
   ═══════════════════════════════════════════════════════════════════════════ */

import type { CartoucheSide, GadgetSize } from "@/lib/hooks/use-welcome-badge-config"
import { sizeToCols } from "@/lib/hooks/use-welcome-badge-config"

/* ── Categories (kept in sync with your-space.tsx GadgetCategory) ──────── */
export type GadgetCategory =
  | "Identity"
  | "Activity"
  | "Performance"
  | "Discipline"
  | "Time"
  | "Macro"

/* ── Visibility class ──────────────────────────────────────────────────────
   Drives WHERE and WHEN a gadget can appear:
     · "default"   → ships in a wing in the factory loadout
     · "swappable" → not default, but offered in the swap panel for a wing
     · "docked"    → deduped/secondary; parked in the GadgetDock, never auto-
                     placed in a wing (its fact is owned elsewhere) */
export type GadgetVisibility = "default" | "swappable" | "docked"

export interface GadgetRegistryEntry {
  /** Stable id — MUST match the catalog entry id in your-space.tsx. */
  id: string
  /** Human label for the swap panel / dock. */
  label: string
  /** Col-span class (s=1, m=2, l=3). */
  size: GadgetSize
  /** Semantic group, used to order the swap panel. */
  category: GadgetCategory
  /** Which wing this gadget naturally belongs to. */
  defaultSide: CartoucheSide
  /** Layout/visibility class (see GadgetVisibility). */
  visibility: GadgetVisibility
  /** Minimum px width the gadget needs before its internals clip. The slot
   *  enforces this so a gadget never renders below its legible floor. */
  minWidth: number
  /** If this gadget was deduped INTO another, the id of the owner. The dock
   *  surfaces this as "shown in <owner>" so the user understands why it's
   *  parked rather than in a wing. */
  dedupeInto?: string
  /** One-line rationale shown in the dock / swap panel. */
  note?: string
}

/* ───────────────────────────────────────────────────────────────────────────
   THE REGISTRY
   ─────────────────────────────────────────────────────────────────────────── */
export const GADGET_REGISTRY: readonly GadgetRegistryEntry[] = [
  /* ── DEFAULT · LEFT WING ───────────────────────────────────────────── */
  {
    id: "firm-identity",
    label: "Firm Identity",
    size: "s",
    category: "Identity",
    defaultSide: "left",
    visibility: "default",
    minWidth: 132,
    note: "Your challenge anchor — firm, phase, day, profit progress.",
  },
  {
    id: "management-pulse",
    label: "Management Pulse",
    size: "l",
    category: "Activity",
    defaultSide: "left",
    visibility: "default",
    minWidth: 360,
    note: "Capital ledger, largest account, today's P&L.",
  },
  {
    id: "last-5-trades",
    label: "Last 5 Trades",
    size: "l",
    category: "Activity",
    defaultSide: "left",
    visibility: "default",
    minWidth: 360,
    note: "Five most recent results — am I hot or cold?",
  },

  /* ── DEFAULT · RIGHT WING ──────────────────────────────────────────── */
  {
    id: "accuracy-engine",
    label: "Accuracy Engine",
    size: "m",
    category: "Performance",
    defaultSide: "right",
    visibility: "default",
    minWidth: 188,
    note: "Win-rate ring, 30-day trend, last 10 calls.",
  },
  {
    id: "best-pair",
    label: "Best Pair",
    size: "s",
    category: "Performance",
    defaultSide: "right",
    visibility: "default",
    minWidth: 132,
    note: "Best pair, pair to avoid, best setup.",
  },
  {
    id: "discipline-pulse",
    label: "Discipline Pulse",
    size: "m",
    category: "Discipline",
    defaultSide: "right",
    visibility: "default",
    minWidth: 188,
    note: "Discipline ring, 12-day strip, revenge gauge.",
  },

  /* ── DOCKED · deduped into the rail or another gadget ──────────────── */
  {
    id: "session-clockwork",
    label: "Session Clockwork",
    size: "m",
    category: "Time",
    defaultSide: "right",
    visibility: "docked",
    minWidth: 188,
    dedupeInto: "rail:session",
    note: "Session state is owned by the top status rail.",
  },
  {
    id: "macro-pulse",
    label: "Macro Pulse",
    size: "s",
    category: "Macro",
    defaultSide: "right",
    visibility: "docked",
    minWidth: 132,
    dedupeInto: "rail:news",
    note: "Next event is owned by the top status rail.",
  },
  {
    id: "win-rate-heart",
    label: "Win Rate Heart",
    size: "s",
    category: "Performance",
    defaultSide: "right",
    visibility: "docked",
    minWidth: 132,
    dedupeInto: "accuracy-engine",
    note: "Win-rate is shown by Accuracy Engine.",
  },
  {
    id: "equity-beacon-live",
    label: "Equity Beacon",
    size: "m",
    category: "Activity",
    defaultSide: "left",
    visibility: "docked",
    minWidth: 188,
    dedupeInto: "management-pulse",
    note: "Equity is shown by Management Pulse + the headline.",
  },
] as const

/* ── Lookups ───────────────────────────────────────────────────────────── */
export const GADGET_REGISTRY_BY_ID: Record<string, GadgetRegistryEntry> =
  GADGET_REGISTRY.reduce((acc, g) => {
    acc[g.id] = g
    return acc
  }, {} as Record<string, GadgetRegistryEntry>)

export function getRegistryEntry(id: string): GadgetRegistryEntry | undefined {
  return GADGET_REGISTRY_BY_ID[id]
}

/* ── Default loadout derived FROM the registry (single source) ─────────── */
export const REGISTRY_DEFAULT_LEFT: readonly string[] = GADGET_REGISTRY
  .filter((g) => g.visibility === "default" && g.defaultSide === "left")
  .map((g) => g.id)

export const REGISTRY_DEFAULT_RIGHT: readonly string[] = GADGET_REGISTRY
  .filter((g) => g.visibility === "default" && g.defaultSide === "right")
  .map((g) => g.id)

/** Gadgets offered in the swap panel for a given side: anything not docked
 *  and not already placed. (The placed filter is applied by the caller.) */
export function swappableForSide(side: CartoucheSide): readonly GadgetRegistryEntry[] {
  return GADGET_REGISTRY.filter(
    (g) => g.visibility !== "docked" && (g.defaultSide === side || g.size !== "l"),
  )
}

/** All docked (deduped/secondary) gadgets, for the GadgetDock. */
export const DOCKED_GADGETS: readonly GadgetRegistryEntry[] =
  GADGET_REGISTRY.filter((g) => g.visibility === "docked")

/* ── Reconciliation with the render catalog ────────────────────────────────
   The catalog supplies `render`; the registry supplies layout truth. Merge by
   id so the grid layer gets one object per gadget. Catalog-only fields win for
   render; registry wins for layout. */
export interface MergedGadget extends GadgetRegistryEntry {
  render: (
    telemetry: any,
    accent: any,
    alignment: "left" | "right",
    priority?: boolean,
  ) => React.ReactNode
}

export function mergeCatalogWithRegistry(
  catalog: ReadonlyArray<{
    id: string
    label: string
    size: GadgetSize
    category: GadgetCategory
    render: MergedGadget["render"]
  }>,
): MergedGadget[] {
  const merged: MergedGadget[] = []
  for (const entry of catalog) {
    const reg = GADGET_REGISTRY_BY_ID[entry.id]
    if (!reg) {
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.warn(`[v0] gadget "${entry.id}" has no registry entry — using catalog defaults`)
      }
      merged.push({
        ...entry,
        defaultSide: "right",
        visibility: "swappable",
        minWidth: sizeToCols(entry.size) * 120,
      })
      continue
    }
    merged.push({ ...reg, render: entry.render })
  }
  if (process.env.NODE_ENV !== "production") {
    const catalogIds = new Set(catalog.map((c) => c.id))
    for (const reg of GADGET_REGISTRY) {
      if (!catalogIds.has(reg.id)) {
        // eslint-disable-next-line no-console
        console.warn(`[v0] registry gadget "${reg.id}" has no catalog render entry`)
      }
    }
  }
  return merged
}
