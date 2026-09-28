"use client"

/* ═══════════════════════════════════════════════════════════════════════════
 *  TRADING DESK · CHART EMBED
 *  ─────────────────────────────────────────────────────────────────────────
 *  Wraps TradingView's PUBLIC widget URL in an iframe. We deliberately
 *  avoid the script-tag widget (which mounts via document.write +
 *  XHR-ed JS) because it conflicts with React's reconciliation, with
 *  CSP-aware preview environments, and with Strict-Mode double-renders.
 *
 *  The iframe URL pattern is:
 *      https://s.tradingview.com/widgetembed/?
 *          symbol=…&interval=…&theme=…&toolbar_bg=…&hide_volume=…
 *
 *  We pass symbol + interval from provider state, and theme + toolbar_bg
 *  from VANTARY tokens so the chart reads in the same editorial tone
 *  as the rest of the dashboard.
 *
 *  The component renders:
 *    · a skeleton placeholder while the iframe is loading
 *    · an error fallback that shows symbol+price ticker + "open in
 *      TradingView" link, used if the iframe never fires `load`
 *    · the iframe itself, sized to fill its parent
 * ═══════════════════════════════════════════════════════════════════════ */

import { memo, useEffect, useMemo, useRef, useState } from "react"
import { useTradingDesk } from "./provider"
import { VANTARY } from "../vantary-theme"

/* ─── helper: build the public widget URL ─────────────────────────────
 *  TradingView's free `widgetembed` endpoint accepts these params:
 *    symbol            — e.g. "FX:EURUSD"
 *    interval          — e.g. "60", "240", "D"
 *    theme             — "light" | "dark"
 *    style             — "1" candle, "8" heikin ashi, "9" line, "3" area
 *    toolbar_bg        — hex without #
 *    hide_top_toolbar  — "0" | "1"
 *    hide_legend       — "0" | "1"
 *    save_image        — "0" | "1"
 *    locale            — "en"
 *  We URL-encode every value defensively to handle exotic symbol
 *  patterns like "BINANCE:BTCUSDT.P". */
function buildWidgetUrl(params: {
  symbol: string
  interval: string
  themeMode: "light" | "dark"
  toolbarBg: string  // hex, with or without leading "#"
}): string {
  const tb = params.toolbarBg.replace(/^#/, "")
  const paneBg = `#${tb}`
  // The pane grid is switched off through the chart Overrides API. The
  // widgetembed endpoint reads `overrides` as a JSON string; transparent
  // grid colours remove both the vertical and the horizontal lines while
  // the pane keeps a solid background in the toolbar colour.
  const overrides = JSON.stringify({
    "paneProperties.vertGridProperties.color": "rgba(0,0,0,0)",
    "paneProperties.horzGridProperties.color": "rgba(0,0,0,0)",
    "paneProperties.background": paneBg,
    "paneProperties.backgroundType": "solid",
  })
  const qs = new URLSearchParams({
    symbol:           params.symbol,
    interval:         params.interval,
    theme:            params.themeMode,
    style:            "1",
    toolbar_bg:       tb,
    hide_top_toolbar: "0",
    hide_legend:      "0",
    save_image:       "1",
    locale:           "en",
    timezone:         "Etc/UTC",
    withdateranges:   "1",
    allow_symbol_change: "1",
    overrides,
    backgroundColor:  paneBg,
    gridColor:        "rgba(0,0,0,0)",
  })
  return `https://s.tradingview.com/widgetembed/?${qs.toString()}`
}

/* ─── helper: detect light vs dark from the resolved VANTARY paper
 *           token. Vantary themes set --vt-paper to a near-white in
 *           light themes and a near-black in dark themes, so the
 *           luminance of the resolved CSS-var is the most reliable
 *           signal we have here. We default to "dark" for SSR. */
function useTvThemeMode(): "light" | "dark" {
  const [mode, setMode] = useState<"light" | "dark">("dark")

  useEffect(() => {
    if (typeof window === "undefined") return
    const root = document.documentElement
    const update = () => {
      const paper = getComputedStyle(root).getPropertyValue("--vt-paper").trim()
      // Try to parse as hex
      const m = paper.match(/^#?([0-9a-f]{6})$/i)
      if (m) {
        const r = parseInt(m[1].slice(0, 2), 16)
        const g = parseInt(m[1].slice(2, 4), 16)
        const b = parseInt(m[1].slice(4, 6), 16)
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
        setMode(luminance > 0.5 ? "dark" : "light")
        // Note: VANTARY.paper is the *foreground* ink color. In a
        // dark theme the ink is light (high luminance); in a light
        // theme the ink is dark (low luminance). So high luminance
        // ink == dark theme.
      }
    }
    update()

    // Re-evaluate when the theme switches — VantaryThemeProvider sets
    // a `data-vt-theme` attribute on <html>, so MutationObserver on
    // that attribute is the most reliable trigger.
    const obs = new MutationObserver(update)
    obs.observe(root, { attributes: true, attributeFilter: ["data-vt-theme", "class"] })
    return () => obs.disconnect()
  }, [])

  return mode
}

/* ─── 1.  TRADINGVIEW EMBED ────────────────────────────────────────── */

export interface TradingViewEmbedProps {
  /** Optional className applied to the wrapper. The wrapper will fill
   *  its parent's width and height — the parent should have an
   *  explicit height (the bay shell does this for us). */
  className?: string
}

export const TradingViewEmbed = memo(function TradingViewEmbed({
  className,
}: TradingViewEmbedProps) {
  const { selectors } = useTradingDesk()
  const sym = selectors.currentSymbol
  const itv = selectors.currentInterval

  const themeMode = useTvThemeMode()
  const toolbarBg = (VANTARY as any).ink ?? VANTARY.paper // dark bg for dark themes

  const url = useMemo(
    () =>
      buildWidgetUrl({
        symbol:    sym.tvSymbol,
        interval:  itv.tvInterval,
        themeMode,
        toolbarBg,
      }),
    [sym.tvSymbol, itv.tvInterval, themeMode, toolbarBg],
  )

  /* When symbol or interval change, force-remount the iframe. The
   * widgetembed endpoint reads its config from the URL once at boot
   * time and doesn't watch for URL changes, so simply changing `src`
   * isn't enough — we have to recreate the element. We do that by
   * keying on the URL itself. */
  const [loaded, setLoaded] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement | null>(null)

  // Reset `loaded` whenever URL changes (key rebuilds the iframe).
  useEffect(() => {
    setLoaded(false)
  }, [url])

  /* If the iframe never fires `load` within 8s (corp firewall, ad
   * blocker, etc), surface the soft fallback. */
  const [softFail, setSoftFail] = useState(false)
  useEffect(() => {
    setSoftFail(false)
    const t = window.setTimeout(() => {
      if (!loaded) setSoftFail(true)
    }, 8000)
    return () => window.clearTimeout(t)
  }, [url, loaded])

  return (
    <div
      className={className}
      style={{
        position:   "relative",
        width:      "100%",
        height:     "100%",
        background: VANTARY.ink ?? VANTARY.paper,
        overflow:   "hidden",
      }}
    >
      <iframe
        key={url}
        ref={iframeRef}
        src={url}
        title={`TradingView · ${sym.displayName} · ${itv.label}`}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        style={{
          width:   "100%",
          height:  "100%",
          border:  "0",
          display: "block",
          // Soft fade-in once loaded so it doesn't pop.
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.4s ease",
          // Prevent the iframe from stealing scroll/touch when the
          // user is dragging the resize handle in its parent.
          pointerEvents: loaded ? "auto" : "none",
        }}
        // sandbox is intentionally OMITTED — TradingView's widget
        // requires same-origin AJAX which `sandbox` blocks. The
        // iframe is from s.tradingview.com which we trust.
        allow="clipboard-write"
      />

      {/* Skeleton placeholder while loading */}
      {!loaded && !softFail && <ChartSkeleton symbol={sym.displayName} interval={itv.label} />}

      {/* Soft-fail fallback */}
      {softFail && !loaded && (
        <ChartFallback
          symbol={sym}
          interval={itv}
          onOpenInTv={() => {
            // Open the symbol on tradingview.com in a new tab as a
            // last resort when the iframe is blocked.
            const tvUrl = `https://www.tradingview.com/chart/?symbol=${encodeURIComponent(sym.tvSymbol)}`
            window.open(tvUrl, "_blank", "noopener,noreferrer")
          }}
        />
      )}
    </div>
  )
})

/* ─── 2.  CHART SKELETON ──────────────────────────────────────────────
 *  Editorial placeholder shown while the iframe is loading. Fakes a
 *  candle series + bottom toolbar so the bay never shows an empty
 *  black hole. Uses VANTARY hairlines + ash tones — no animation
 *  beyond a subtle pulse on the symbol pill. */

function ChartSkeleton({ symbol, interval }: { symbol: string; interval: string }) {
  // 56 fake bars to give the eye something to rest on. Heights are
  // deterministic (sine-based) so SSR + CSR render identical markup.
  const bars = useMemo(
    () => Array.from({ length: 56 }, (_, i) => 0.35 + Math.abs(Math.sin(i * 0.41)) * 0.55),
    [],
  )

  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset:    0,
        display:  "flex",
        flexDirection: "column",
        background: VANTARY.ink ?? VANTARY.paper,
      }}
    >
      {/* Top hairline + symbol/interval pill */}
      <div
        className="flex items-center gap-3 px-4 py-2"
        style={{ borderBottom: `1px solid ${VANTARY.rule}` }}
      >
        <span
          className="font-mono uppercase tabular-nums"
          style={{
            fontSize:      10.5,
            letterSpacing: "0.22em",
            color:         VANTARY.amber,
            fontWeight:    500,
          }}
        >
          {symbol}
        </span>
        <span aria-hidden style={{ width: 1, height: 9, background: VANTARY.rule }} />
        <span
          className="font-mono uppercase tabular-nums"
          style={{ fontSize: 10, letterSpacing: "0.22em", color: VANTARY.ashSoft }}
        >
          {interval}
        </span>
        <span aria-hidden className="ml-auto" style={{ width: 5, height: 5, borderRadius: 99, background: VANTARY.amber, opacity: 0.6 }} />
        <span
          className="font-mono uppercase"
          style={{ fontSize: 9.5, letterSpacing: "0.2em", color: VANTARY.ashSoft }}
        >
          LOADING TRADINGVIEW…
        </span>
      </div>

      {/* Faux candle area */}
      <div className="flex-1 flex items-end gap-[2px] px-4 pb-4 pt-2">
        {bars.map((h, i) => (
          <div
            key={i}
            style={{
              flex:      "1 1 0",
              height:    `${h * 100}%`,
              minHeight: 6,
              background: VANTARY.rule,
              opacity:    0.45,
              borderRadius: 1,
            }}
          />
        ))}
      </div>
    </div>
  )
}

/* ─── 3.  CHART FALLBACK ──────────────────────────────────────────────
 *  Surfaces when TradingView fails to load (firewall / ad-block).
 *  Shows symbol + faked last-price ticker + an "open on TradingView"
 *  affordance so the trader is never stranded. */

function ChartFallback({
  symbol,
  interval,
  onOpenInTv,
}: {
  symbol: ReturnType<typeof useTradingDesk>["selectors"]["currentSymbol"]
  interval: ReturnType<typeof useTradingDesk>["selectors"]["currentInterval"]
  onOpenInTv: () => void
}) {
  const last = symbol.fakeLast?.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 }) ?? "—"
  const chg  = symbol.fakeChangePct ?? 0
  const isUp = chg >= 0

  return (
    <div
      style={{
        position:        "absolute",
        inset:           0,
        display:         "flex",
        flexDirection:   "column",
        alignItems:      "center",
        justifyContent:  "center",
        gap:             14,
        textAlign:       "center",
        padding:         24,
        background:      VANTARY.ink ?? VANTARY.paper,
      }}
    >
      <span
        className="font-mono uppercase"
        style={{
          fontSize:      9.5,
          letterSpacing: "0.32em",
          color:         VANTARY.ashSoft,
        }}
      >
        TRADING DESK · CHART OFFLINE
      </span>

      <div className="flex items-baseline gap-3">
        <span
          className="font-sans"
          style={{ fontSize: 32, fontWeight: 500, color: VANTARY.paper, letterSpacing: "-0.02em" }}
        >
          {symbol.displayName}
        </span>
      </div>

      <div className="flex items-baseline gap-3">
        <span
          className="font-mono tabular-nums"
          style={{ fontSize: 28, fontWeight: 500, color: VANTARY.paper, letterSpacing: "-0.01em" }}
        >
          {last}
        </span>
        <span
          className="font-mono tabular-nums"
          style={{
            fontSize:   13,
            color:      isUp ? VANTARY.amber : VANTARY.paperDim,
            fontWeight: 500,
          }}
        >
          {isUp ? "+" : ""}{chg.toFixed(2)}%
        </span>
      </div>

      <p
        className="font-sans italic"
        style={{
          fontSize:    13,
          color:       VANTARY.paperDim,
          maxWidth:    420,
          lineHeight:  1.5,
          margin:      0,
        }}
      >
        TradingView didn&apos;t respond in time. Network blocking, an extension, or
        a corporate firewall may be the cause.
      </p>

      <button
        type="button"
        onClick={onOpenInTv}
        className="font-mono uppercase"
        style={{
          padding:       "8px 14px",
          fontSize:      10.5,
          letterSpacing: "0.22em",
          color:         VANTARY.amber,
          background:    "transparent",
          border:        `1px solid ${VANTARY.amberHalo}`,
          borderRadius:  3,
          cursor:        "pointer",
        }}
      >
        OPEN ON TRADINGVIEW.COM
      </button>
    </div>
  )
}
