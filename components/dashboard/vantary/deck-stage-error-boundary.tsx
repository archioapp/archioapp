"use client"

/* ═══════════════════════════════════════════════════════════════════════════
 *  DeckStageErrorBoundary
 *  ─────────────────────────────────────────────────────────────────────────
 *  Catches unhandled React render errors thrown anywhere inside a
 *  <DeckStage/>'s expanded body (LIVE EQUITY VOLUME, ACTIVE WINDOWS, etc.)
 *  so that a single failing leaf does NOT collapse the entire dashboard
 *  tree to a black screen.
 *
 *  When a child throws (typical causes: undefined data, race condition
 *  during a context swap, a missing provider, a numeric NaN feeding a
 *  motion transition), the boundary:
 *
 *    1. Logs the full error + componentStack to the console with the
 *       `[v0]` prefix so the cause is visible in dev tools.
 *    2. Renders a graceful editorial fallback in Vantary's own design
 *       language — the same hairline rules + mono caps eyebrow used
 *       elsewhere in the dashboard, scoped to a single brick-red tone.
 *    3. Offers two recovery paths:
 *         · "RETURN TO COMPACT"  → calls onReset (which the parent
 *           wires to setFocused(null) so the deck collapses back to
 *           the compact card and the dashboard keeps working).
 *         · "TRY AGAIN"          → clears local error state so the
 *           expanded body re-mounts and re-renders. Useful if the
 *           cause was transient (e.g. an in-flight context update).
 *
 *  The boundary auto-resets when `resetKey` changes — pass the current
 *  focused-stage key (e.g. `"equity"` / `"sessions"`) so swapping which
 *  stage is expanded clears any stale error state.
 *
 *  This file is intentionally small and self-contained so it can be
 *  imported anywhere on the page without dragging in <YourSpace/>'s
 *  giant import surface.
 * ═══════════════════════════════════════════════════════════════════════ */

import * as React from "react"
import { AlertTriangle, RotateCcw, ArrowLeft } from "lucide-react"
import { VANTARY } from "./vantary-theme"

interface Props {
  /** The expanded body JSX. */
  children: React.ReactNode
  /** Called when the user clicks RETURN TO COMPACT. */
  onReset: () => void
  /** Re-mounts the boundary when this value changes — pass the current
   *  expanded-stage identity so swapping stages clears stale errors. */
  resetKey: string
  /** Human-readable label for the failing module — appears in the
   *  fallback eyebrow ("LIVE EQUITY VOLUME · INTERRUPTED"). */
  label: string
}

interface State {
  error: Error | null
  /** Bumped by TRY AGAIN — appended to the children key so the subtree
   *  is fully torn down + re-mounted instead of just having error
   *  cleared (which would re-throw immediately on the next render). */
  retryNonce: number
}

export class DeckStageErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { error: null, retryNonce: 0 }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    /* The single most useful console line for diagnosing the crash:
     * full message + componentStack so the failing leaf is obvious in
     * dev tools.  Prefixed with [v0] per the project's debug
     * convention. */
    // eslint-disable-next-line no-console
    console.log(
      "[v0] DeckStageErrorBoundary caught:",
      this.props.label,
      "·",
      error.message,
      "\n  componentStack:",
      info.componentStack,
    )
  }

  componentDidUpdate(prevProps: Props) {
    // Auto-reset when the parent swaps to a different expanded stage so
    // a stale error from "equity" doesn't bleed into "sessions".
    if (prevProps.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null, retryNonce: 0 })
    }
  }

  private handleReset = () => {
    this.setState({ error: null, retryNonce: 0 })
    this.props.onReset()
  }

  private handleRetry = () => {
    this.setState((s) => ({ error: null, retryNonce: s.retryNonce + 1 }))
  }

  render() {
    if (this.state.error) {
      const message = this.state.error.message || "Unknown render error"
      return (
        <div
          role="alert"
          aria-live="assertive"
          className="rounded-md"
          style={{
            margin:     "8px 0",
            padding:    "20px 22px",
            border:     `1px solid rgba(248,113,113,0.28)`,
            background: "rgba(248,113,113,0.04)",
          }}
        >
          {/* eyebrow ─────────────────────────────────────────── */}
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={12} strokeWidth={1.6} color="#f87171" />
            <span
              className="font-mono uppercase"
              style={{ fontSize: 9.5, letterSpacing: "0.22em", color: "#f87171", fontWeight: 500 }}
            >
              {this.props.label} · INTERRUPTED
            </span>
          </div>

          {/* explanation copy ────────────────────────────────── */}
          <div
            className="font-sans"
            style={{ fontSize: 12.5, color: VANTARY.paper, lineHeight: 1.55, marginBottom: 12 }}
          >
            Something glitched while rendering this expanded view. The
            dashboard caught it before it could break the rest of the
            screen — return to the compact card or try again.
          </div>

          {/* error message · monospaced, low-key ─────────────── */}
          <pre
            className="font-mono"
            style={{
              fontSize:     10,
              color:        VANTARY.paperDim,
              lineHeight:   1.55,
              padding:      "8px 10px",
              borderRadius: 3,
              background:   "rgba(255,255,255,0.012)",
              border:       `1px solid ${VANTARY.rule}`,
              wordBreak:    "break-word",
              whiteSpace:   "pre-wrap",
              marginBottom: 14,
              maxHeight:    160,
              overflow:     "auto",
            }}
          >
            {message}
          </pre>

          {/* recovery actions ────────────────────────────────── */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={this.handleReset}
              className="font-mono uppercase flex items-center gap-2"
              style={{
                fontSize:      9.5,
                letterSpacing: "0.22em",
                color:         VANTARY.amber,
                padding:       "6px 12px",
                border:        `1px solid ${VANTARY.amberHalo}`,
                background:    VANTARY.amberWash,
                borderRadius:  3,
                cursor:        "pointer",
                fontWeight:    500,
              }}
            >
              <ArrowLeft size={11} strokeWidth={1.7} />
              RETURN TO COMPACT
            </button>
            <button
              type="button"
              onClick={this.handleRetry}
              className="font-mono uppercase flex items-center gap-2"
              style={{
                fontSize:      9.5,
                letterSpacing: "0.22em",
                color:         VANTARY.paperDim,
                padding:       "6px 12px",
                border:        `1px solid ${VANTARY.rule}`,
                background:    "transparent",
                borderRadius:  3,
                cursor:        "pointer",
                fontWeight:    500,
              }}
            >
              <RotateCcw size={11} strokeWidth={1.7} />
              TRY AGAIN
            </button>
          </div>
        </div>
      )
    }

    /* Re-keying on retryNonce forces a full subtree remount on TRY AGAIN
     * — without this, React would re-use the same instances and re-throw
     * the same error on the very next render. */
    return (
      <React.Fragment key={this.state.retryNonce}>
        {this.props.children}
      </React.Fragment>
    )
  }
}
