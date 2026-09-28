"use client"

/* ═══════════════════════════════════════════════════════════════════════════
   ARCHIO · FLIGHT DECK · ACTIVE TEMPLATE HOOK
   ───────────────────────────────────────────────────────────────────────────
   Tracks which of the 6 personas is currently driving the cartouche.

   Storage model is per-template SNAPSHOTS of the wing arrangement, not
   per-slot overrides. Why snapshots? Because the existing
   `useWelcomeBadgeConfig` stores wings as flat `{left: string[], right: string[]}`,
   and any per-slot swap mutates those lists directly. By snapshotting the
   whole wings (a few hundred bytes), the two systems stay consistent
   without coupling on the slot-index level.

   Keys:
     vantary.cartouche.template.v1               → active template id
     vantary.cartouche.snapshot.{templateId}.v1  → JSON { left: string[], right: string[] }
                                                   captured when the user
                                                   navigates AWAY from a
                                                   template (or explicitly
                                                   when they make a swap
                                                   while a template is
                                                   active).

   Sync rule:
     · On template switch, restore that template's snapshot if it exists,
       else compute the default snapshot from FLIGHT_DECK_TEMPLATES.
     · On per-slot swap, the caller captures a fresh snapshot of the
       cartouche's current wings via `captureSnapshot(activeId, wings)`.
     · `resetSnapshot(id)` wipes the snapshot so subsequent activation
       returns to factory defaults.
   ═══════════════════════════════════════════════════════════════════════════ */

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  DEFAULT_TEMPLATE_ID,
  FLIGHT_DECK_TEMPLATES,
  TEMPLATE_BY_ID,
  flattenWingSlots,
  type FlightDeckTemplate,
} from "./flight-deck-templates"

/* ────────────────────────────────────────────────────────────────────────
   Storage keys
   ──────────────────────────────────────────────────────────────────────── */
const KEY_ACTIVE   = "vantary.cartouche.template.v1"
const KEY_SNAPSHOT = (templateId: string) => `vantary.cartouche.snapshot.${templateId}.v1`

export interface WingSnapshot {
  left:  readonly string[]
  right: readonly string[]
}

/* ────────────────────────────────────────────────────────────────────────
   SSR-safe localStorage primitives
   ──────────────────────────────────────────────────────────────────────── */
function readLS(key: string): string | null {
  if (typeof window === "undefined") return null
  try { return window.localStorage.getItem(key) } catch { return null }
}
function writeLS(key: string, value: string | null) {
  if (typeof window === "undefined") return
  try {
    if (value === null) window.localStorage.removeItem(key)
    else                 window.localStorage.setItem(key, value)
  } catch { /* quota */ }
}

function readActiveId(): string {
  const raw = readLS(KEY_ACTIVE)
  if (!raw) return DEFAULT_TEMPLATE_ID
  return TEMPLATE_BY_ID[raw] ? raw : DEFAULT_TEMPLATE_ID
}

function readSnapshot(id: string): WingSnapshot | null {
  const raw = readLS(KEY_SNAPSHOT(id))
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    if (parsed && Array.isArray(parsed.left) && Array.isArray(parsed.right)) {
      return {
        left:  parsed.left.map(String),
        right: parsed.right.map(String),
      }
    }
  } catch { /* malformed */ }
  return null
}

function writeSnapshot(id: string, snapshot: WingSnapshot | null) {
  writeLS(
    KEY_SNAPSHOT(id),
    snapshot ? JSON.stringify({ left: [...snapshot.left], right: [...snapshot.right] }) : null,
  )
}

/* ────────────────────────────────────────────────────────────────────────
   Default snapshot from a template definition
   ──────────────────────────────────────────────────────────────────────── */
export function defaultSnapshotFromTemplate(template: FlightDeckTemplate): WingSnapshot {
  return {
    left:  flattenWingSlots(template.left).map((s) => s.id),
    right: flattenWingSlots(template.right).map((s) => s.id),
  }
}

/** Resolve a template's effective snapshot — user override if present,
 *  factory defaults otherwise. */
export function resolveSnapshot(template: FlightDeckTemplate): WingSnapshot {
  const stored = readSnapshot(template.id)
  return stored ?? defaultSnapshotFromTemplate(template)
}

/* ────────────────────────────────────────────────────────────────────────
   useActiveTemplate — the public hook
   ──────────────────────────────────────────────────────────────────────── */
export interface UseActiveTemplateApi {
  /** The currently active template id. */
  activeId:  string
  /** The active template (typed, with persona + rationale + wing geometry). */
  template:  FlightDeckTemplate
  /** All 6 templates, in picker order. */
  templates: readonly FlightDeckTemplate[]
  /** Switch to a different template. Returns the snapshot of the new template
   *  (default OR user-captured) so the caller can apply it to the cartouche. */
  setActive: (id: string) => WingSnapshot
  /** Capture the current cartouche wings as the active template's snapshot.
   *  Call after a per-slot swap so the user's tweak persists per-template. */
  captureSnapshot: (snapshot: WingSnapshot) => void
  /** Wipe the active template's snapshot (return to factory defaults). */
  resetSnapshot: () => void
  /** True once the hook has hydrated from localStorage. */
  hydrated: boolean
}

export function useActiveTemplate(): UseActiveTemplateApi {
  const [activeId, setActiveIdState] = useState<string>(DEFAULT_TEMPLATE_ID)
  const [hydrated, setHydrated]      = useState(false)

  /* Hydrate from localStorage on mount. */
  useEffect(() => {
    setActiveIdState(readActiveId())
    setHydrated(true)
  }, [])

  /* Cross-tab sync on the active id only — snapshots are read on demand. */
  useEffect(() => {
    if (typeof window === "undefined") return
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY_ACTIVE) setActiveIdState(readActiveId())
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  const template = TEMPLATE_BY_ID[activeId] ?? TEMPLATE_BY_ID[DEFAULT_TEMPLATE_ID]!

  /* ── setActive: persist + return the snapshot for the caller to apply ── */
  const setActive = useCallback((id: string): WingSnapshot => {
    const safe = TEMPLATE_BY_ID[id] ? id : DEFAULT_TEMPLATE_ID
    writeLS(KEY_ACTIVE, safe)
    setActiveIdState(safe)
    return resolveSnapshot(TEMPLATE_BY_ID[safe]!)
  }, [])

  /* ── captureSnapshot: write the user's current arrangement ─────────── */
  const captureSnapshot = useCallback((snapshot: WingSnapshot) => {
    writeSnapshot(activeId, snapshot)
  }, [activeId])

  /* ── resetSnapshot: clear active template's user snapshot ──────────── */
  const resetSnapshot = useCallback(() => {
    writeSnapshot(activeId, null)
  }, [activeId])

  return useMemo<UseActiveTemplateApi>(() => ({
    activeId,
    template,
    templates: FLIGHT_DECK_TEMPLATES,
    setActive,
    captureSnapshot,
    resetSnapshot,
    hydrated,
  }), [activeId, template, setActive, captureSnapshot, resetSnapshot, hydrated])
}
