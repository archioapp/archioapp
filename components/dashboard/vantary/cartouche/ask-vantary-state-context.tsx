"use client"

/* ═══════════════════════════════════════════════════════════════════════════
   ARCHIO · ASK VANTARY · STATE MACHINE CONTEXT
   ───────────────────────────────────────────────────────────────────────────
   A single source of truth for the Ask Vantary surface state. The previous
   code path used two independent booleans (`hovered` and `armed`) which
   could enter mixed states — armed without a prompt, suggestions visible
   while the bar was blurred, etc. This file replaces them with an explicit
   finite-state machine.

       ┌──── HOVER_IN ────►              ┌── ENTER / SUBMIT ──►
   IDLE ├──── FOCUS ─────► SUGGESTING ───┤                       ► SUBMITTED ───► ANSWERING
       │                       │           └── pick suggestion ─►                    │
       │                       │                                                     │
       └◄─ BLUR (220ms) ───────┘                                                     │
                                                                                     │
       ◄────────────────── CLEAR / ESC / CLICK_OUTSIDE ◄────────────────────────────┘

   Wings scale + suggestion + answer surfaces all derive from `state`.
   ═══════════════════════════════════════════════════════════════════════════ */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react"

/* ────────────────────────────────────────────────────────────────────────
   States
   ──────────────────────────────────────────────────────────────────────── */
export type AskVantaryState =
  | "idle"        // bar dormant, wings at 1.00
  | "armed"       // hover-armed, wings at 0.96, suggestions HIDDEN
  | "suggesting"  // input focused, wings at 0.78, suggestions VISIBLE
  | "submitted"   // user fired a prompt, awaiting first token, skeleton showing
  | "answering"   // answer panel rendering below the rooms

/* ────────────────────────────────────────────────────────────────────────
   Wing scale + pointer-events tables
   ──────────────────────────────────────────────────────────────────────── */
export const WING_SCALE_BY_STATE: Record<AskVantaryState, number> = {
  idle:        1.00,
  armed:       0.96,
  suggesting:  0.78,
  submitted:   0.86,
  answering:   0.86,
}

/** Whether the wings remain interactive (hover/click) in this state. */
export const WING_INTERACTIVE_BY_STATE: Record<AskVantaryState, boolean> = {
  idle:       true,
  armed:      true,
  suggesting: false,  // pointer-events: none so user can't accidentally hover-flip
  submitted:  true,
  answering:  true,
}

/** Should gadget face rotation pause? Pause whenever the Ask surface is active. */
export const FACE_ROTATION_PAUSED_BY_STATE: Record<AskVantaryState, boolean> = {
  idle:       false,
  armed:      false,
  suggesting: true,
  submitted:  true,
  answering:  true,
}

/* ────────────────────────────────────────────────────────────────────────
   Actions
   ──────────────────────────────────────────────────────────────────────── */
type Action =
  | { type: "HOVER_IN" }
  | { type: "HOVER_OUT" }
  | { type: "FOCUS" }
  | { type: "BLUR" }
  | { type: "SUBMIT"; prompt: string; topic?: string }
  | { type: "ANSWER_READY"; topic?: string }
  | { type: "CLEAR" }
  | { type: "ESC" }

interface MachineState {
  state:        AskVantaryState
  prompt:       string
  answerTopic:  string
}

const INITIAL: MachineState = {
  state:        "idle",
  prompt:       "",
  answerTopic:  "",
}

/* ────────────────────────────────────────────────────────────────────────
   Reducer — every transition is explicit. Invalid transitions are no-ops.
   ──────────────────────────────────────────────────────────────────────── */
function reducer(s: MachineState, a: Action): MachineState {
  switch (a.type) {
    case "HOVER_IN":
      if (s.state === "idle") return { ...s, state: "armed" }
      return s

    case "HOVER_OUT":
      if (s.state === "armed") return { ...s, state: "idle" }
      return s

    case "FOCUS":
      /* Focusing while answering keeps the answer visible, just re-arms
         the bar so the user can dictate a follow-up. */
      if (s.state === "idle" || s.state === "armed") {
        return { ...s, state: "suggesting" }
      }
      if (s.state === "answering" || s.state === "submitted") {
        return { ...s, state: "answering" } // no-op transition, kept explicit
      }
      return s

    case "BLUR":
      /* Only suggesting → idle on blur (when the user clicks elsewhere
         without submitting). Answer surface stays as-is. */
      if (s.state === "suggesting") return { ...s, state: "idle", prompt: "" }
      return s

    case "SUBMIT": {
      const prompt = a.prompt.trim()
      if (!prompt) return s
      return { state: "submitted", prompt, answerTopic: a.topic ?? "" }
    }

    case "ANSWER_READY":
      if (s.state === "submitted") {
        return { ...s, state: "answering", answerTopic: a.topic ?? s.answerTopic }
      }
      return s

    case "CLEAR":
    case "ESC":
      return INITIAL

    default:
      return s
  }
}

/* ────────────────────────────────────────────────────────────────────────
   Context shape
   ──────────────────────────────────────────────────────────────────────── */
export interface AskVantaryStateApi {
  state:        AskVantaryState
  prompt:       string
  answerTopic:  string

  /** Convenience flags derived from `state`. */
  isHovered:    boolean   // armed OR suggesting (legacy `hovered`)
  isArmed:      boolean   // suggesting (input focused)
  isAnswering:  boolean   // submitted OR answering
  wingScale:    number
  wingInteractive: boolean
  rotationPaused:  boolean

  hoverIn:      () => void
  hoverOut:     () => void
  focus:        () => void
  blur:         () => void
  submit:       (prompt: string, topic?: string) => void
  markAnswerReady: (topic?: string) => void
  clear:        () => void
}

const AskVantaryStateContext = createContext<AskVantaryStateApi | null>(null)

/* ────────────────────────────────────────────────────────────────────────
   Provider
   ──────────────────────────────────────────────────────────────────────── */
export interface AskVantaryStateProviderProps {
  children:                React.ReactNode
  /** Auto-advance from "submitted" → "answering" after this many ms when the
   *  caller doesn't explicitly fire ANSWER_READY (mocked think-time). */
  mockAnswerLatencyMs?:    number
  /** Debounce window for armed→idle when the cursor leaves the bar without focusing. */
  hoverOutDebounceMs?:     number
}

export function AskVantaryStateProvider({
  children,
  mockAnswerLatencyMs = 900,
  hoverOutDebounceMs   = 220,
}: AskVantaryStateProviderProps) {
  const [machine, dispatch] = useReducer(reducer, INITIAL)
  const hoverOutTimer       = useRef<number | null>(null)
  const submitTimer         = useRef<number | null>(null)

  /* ── HOVER actions, with debounce on hover-out ─────────────────────── */
  const hoverIn = useCallback(() => {
    if (hoverOutTimer.current != null) {
      window.clearTimeout(hoverOutTimer.current)
      hoverOutTimer.current = null
    }
    dispatch({ type: "HOVER_IN" })
  }, [])

  const hoverOut = useCallback(() => {
    if (hoverOutTimer.current != null) window.clearTimeout(hoverOutTimer.current)
    hoverOutTimer.current = window.setTimeout(() => {
      dispatch({ type: "HOVER_OUT" })
      hoverOutTimer.current = null
    }, hoverOutDebounceMs)
  }, [hoverOutDebounceMs])

  /* ── focus / blur ─────────────────────────────────────────────────── */
  const focus = useCallback(() => {
    if (hoverOutTimer.current != null) {
      window.clearTimeout(hoverOutTimer.current)
      hoverOutTimer.current = null
    }
    dispatch({ type: "FOCUS" })
  }, [])
  const blur = useCallback(() => dispatch({ type: "BLUR" }), [])

  /* ── submit + mocked answer-ready timer ───────────────────────────── */
  const submit = useCallback((prompt: string, topic?: string) => {
    if (!prompt.trim()) return
    if (submitTimer.current != null) {
      window.clearTimeout(submitTimer.current)
      submitTimer.current = null
    }
    dispatch({ type: "SUBMIT", prompt, topic })
    submitTimer.current = window.setTimeout(() => {
      dispatch({ type: "ANSWER_READY", topic })
      submitTimer.current = null
    }, mockAnswerLatencyMs)
  }, [mockAnswerLatencyMs])

  const markAnswerReady = useCallback((topic?: string) => {
    dispatch({ type: "ANSWER_READY", topic })
  }, [])

  const clear = useCallback(() => {
    if (submitTimer.current != null) {
      window.clearTimeout(submitTimer.current)
      submitTimer.current = null
    }
    dispatch({ type: "CLEAR" })
  }, [])

  /* ── Escape-to-clear at the document level ────────────────────────── */
  useEffect(() => {
    if (typeof document === "undefined") return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      /* Only react to Escape when the Ask surface is doing something. */
      if (machine.state === "idle") return
      e.preventDefault()
      clear()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [machine.state, clear])

  /* ── Cleanup timers on unmount ────────────────────────────────────── */
  useEffect(() => () => {
    if (hoverOutTimer.current != null) window.clearTimeout(hoverOutTimer.current)
    if (submitTimer.current   != null) window.clearTimeout(submitTimer.current)
  }, [])

  /* ── Memo-stable public api ───────────────────────────────────────── */
  const api = useMemo<AskVantaryStateApi>(() => ({
    state:           machine.state,
    prompt:          machine.prompt,
    answerTopic:     machine.answerTopic,
    isHovered:       machine.state === "armed" || machine.state === "suggesting",
    isArmed:         machine.state === "suggesting",
    isAnswering:     machine.state === "submitted" || machine.state === "answering",
    wingScale:       WING_SCALE_BY_STATE[machine.state],
    wingInteractive: WING_INTERACTIVE_BY_STATE[machine.state],
    rotationPaused:  FACE_ROTATION_PAUSED_BY_STATE[machine.state],
    hoverIn, hoverOut, focus, blur, submit, markAnswerReady, clear,
  }), [machine.state, machine.prompt, machine.answerTopic,
       hoverIn, hoverOut, focus, blur, submit, markAnswerReady, clear])

  return (
    <AskVantaryStateContext.Provider value={api}>
      {children}
    </AskVantaryStateContext.Provider>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   useAskVantaryState — public hook. Safe outside the provider: returns
   a permanent-idle stub so legacy consumers don't crash.
   ──────────────────────────────────────────────────────────────────────── */
const IDLE_STUB: AskVantaryStateApi = {
  state:        "idle",
  prompt:       "",
  answerTopic:  "",
  isHovered:    false,
  isArmed:      false,
  isAnswering:  false,
  wingScale:    1,
  wingInteractive: true,
  rotationPaused:  false,
  hoverIn:        () => {},
  hoverOut:       () => {},
  focus:          () => {},
  blur:           () => {},
  submit:         () => {},
  markAnswerReady:() => {},
  clear:          () => {},
}

export function useAskVantaryState(): AskVantaryStateApi {
  const ctx = useContext(AskVantaryStateContext)
  return ctx ?? IDLE_STUB
}

/* ────────────────────────────────────────────────────────────────────────
   useAskHoverCompat — legacy compatibility shim for AskHoverContext-era
   consumers that just want the boolean `hovered`. Kept as a tiny hook so
   the existing AskSuggestionPanel and friends don't need a full rewrite
   when they only care about "is the bar engaged".
   ──────────────────────────────────────────────────────────────────────── */
export function useAskHoverCompat(): { hovered: boolean } {
  const { isHovered } = useAskVantaryState()
  return { hovered: isHovered }
}
