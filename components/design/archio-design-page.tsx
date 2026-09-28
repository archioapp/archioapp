"use client"

/* ──────────────────────────────────────────────────────────────────────────
 *  ArchioDesignPage  ·  the master Visual DNA palette
 *
 *  The single source of truth for how ArchioAI looks and feels everywhere.
 *  It mounts the REAL production surfaces (FlightDeck, MacroAlertSheet) and
 *  then documents the entire design system — color, type, panels, cards,
 *  controls, command bar, status rail, alerts, the swipe/drawer language,
 *  motion, and layout — using the reusable primitives in `archio-kit.tsx`.
 *
 *  Isolation: no TradingView, no full dashboard shell, no /swipe mount.
 *  Every future page inherits the dark cockpit · teal-glass system defined
 *  on this page.
 * ──────────────────────────────────────────────────────────────────────── */

import { FlightDeck, FlightDeckHost } from "@/components/flight-deck/FlightDeck"
import { MacroAlertSheet } from "@/components/macro/MacroAlertSheet"
import { VolArcShowcase } from "@/components/dashboard/vantary/flight-deck/theater/svg-primitives/__showcase__/vol-arc-showcase"
import { DNA, MONO_CAP, MONO_CAP_TIGHT } from "./design-tokens"
import { SectionLabel, LiveFrame, MetaRow, ClientOnly } from "./design-scaffold"
import {
  ColorSystem,
  TypographySystem,
  PanelSystem,
  CardSystem,
  ControlSystem,
  CommandSystem,
  StatusRailSystem,
  AlertRiskSystem,
  DrawerSystem,
  AnimationSystem,
  LayoutSystem,
  ExampleComponents,
} from "./palette-sections"

export function ArchioDesignPage() {
  return (
    <main
      className="relative min-h-screen w-full overflow-x-hidden"
      style={{
        background: `
          radial-gradient(ellipse 60% 40% at 50% 0%, rgba(45,212,191,0.05) 0%, transparent 60%),
          radial-gradient(ellipse 90% 60% at 50% 100%, rgba(20,28,34,0.6) 0%, transparent 70%),
          linear-gradient(180deg, #06090C 0%, ${DNA.ink} 50%, #06090C 100%)
        `,
        color: DNA.paper,
      }}
    >
      {/* ── Global tactical grid ─────────────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(45,212,191,0.025) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(45,212,191,0.025) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse 80% 90% at 50% 30%, black 30%, transparent 95%)",
        }}
      />

      {/* ── Faint scanline ───────────────────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0.6) 1px, transparent 1px, transparent 3px)",
          mixBlendMode: "overlay",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1480px] px-8 py-16">
        <Header />

        {/* ── 01 · FLIGHT DECK · LIVE ─────────────────────────────── */}
        <section className="mt-20">
          <SectionLabel
            number="01"
            title="FLIGHT DECK"
            caption="Live production composition — status rail, Trader Cartouche, Ask command bar, and the four-room navigator. Hover the rooms, focus the Ask bar, type a query, press ⌘K — every interaction is the dashboard interaction."
            sourcePath="components/flight-deck/FlightDeck.tsx"
          />
          <div className="mt-8">
            <LiveFrame>
              <ClientOnly minHeight={420}>
                <FlightDeckHost>
                  <FlightDeck />
                </FlightDeckHost>
              </ClientOnly>
            </LiveFrame>
          </div>
        </section>

        {/* ── 02 · MACRO ALERT SHEET · LIVE ───────────────────────── */}
        <section className="mt-28">
          <SectionLabel
            number="02"
            title="MACRO ALERT SHEET"
            caption="Live production module — high-impact event rows expand and collapse, affected-pair chips are real chips, the recommendation strip carries the same plan-aware copy as the dashboard."
            sourcePath="components/macro/MacroAlertSheet.tsx"
          />
          <div className="mt-8">
            <LiveFrame padded>
              <ClientOnly minHeight={320}>
                <MacroAlertSheet />
              </ClientOnly>
            </LiveFrame>
          </div>
        </section>

        {/* ── 03–14 · THE DESIGN SYSTEM ────────────────────────────── */}
        <ColorSystem />
        <TypographySystem />
        <PanelSystem />
        <CardSystem />
        <ControlSystem />
        <CommandSystem />
        <StatusRailSystem />
        <AlertRiskSystem />
        <DrawerSystem />
        <AnimationSystem />
        <LayoutSystem />
        <ExampleComponents />

        {/* ── APPENDIX · THEATER INSTRUMENT · VOLARC ───────────────── */}
        <section className="mt-28">
          <SectionLabel
            number="A1"
            title="THEATER INSTRUMENT · VOLARC"
            badge="LIVE"
            caption="The flagship SVG instrument of the Flight Deck masterplan. Eight tones × scales × sizes on a single canvas. Hit REPLAY ENTRANCE to re-trigger the shared EASE_V choreography across all eight at once."
            sourcePath="components/dashboard/vantary/flight-deck/theater/svg-primitives/vol-arc.tsx"
          />
          <div className="mt-8">
            <VolArcShowcase />
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}

/* ── Header ──────────────────────────────────────────────────────────── */

function Header() {
  return (
    <header className="flex flex-col gap-8">
      {/* eyebrow rail */}
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          style={{
            display: "inline-block",
            width: 6,
            height: 6,
            borderRadius: 999,
            background: DNA.teal,
            boxShadow: `0 0 8px ${DNA.teal}, 0 0 16px ${DNA.teal}66`,
          }}
        />
        <span style={{ ...MONO_CAP, fontSize: 10, color: DNA.teal, letterSpacing: "0.32em" }}>
          INTERNAL · MASTER PALETTE
        </span>
        <span aria-hidden className="flex-1 h-px" style={{ background: DNA.tealRule }} />
        <span style={{ ...MONO_CAP_TIGHT, fontSize: 9, color: DNA.ashSoft }}>
          ARCHIOAI · v0 · 2026
        </span>
      </div>

      {/* title block */}
      <div className="grid grid-cols-12 gap-8 items-end">
        <div className="col-span-12 md:col-span-8 flex flex-col gap-5">
          <h1
            className="font-sans text-balance"
            style={{
              fontSize: 56,
              fontWeight: 300,
              color: DNA.paper,
              letterSpacing: "-0.035em",
              lineHeight: 1.02,
            }}
          >
            ArchioAI <span style={{ color: DNA.teal, fontWeight: 400 }}>Visual DNA</span>
            <span style={{ color: DNA.ashSoft, fontWeight: 300 }}> · the master palette</span>
          </h1>
          <p
            className="font-sans text-pretty"
            style={{ fontSize: 15, color: DNA.paperDim, lineHeight: 1.6, maxWidth: 720 }}
          >
            The single source of truth for the whole platform. The two surfaces
            up top are the exact production{" "}
            <code style={{ color: DNA.teal }}>FlightDeck</code> and{" "}
            <code style={{ color: DNA.teal }}>MacroAlertSheet</code> components.
            Everything below — color, type, panels, cards, controls, the command
            bar, alerts, the drawer language, and motion — is the reusable
            system every future page inherits.
          </p>
        </div>

        <div className="col-span-12 md:col-span-4 flex flex-col gap-3">
          <MetaRow label="ROUTE" value="/design" />
          <MetaRow label="STATE" value="LIVE · INTERACTIVE" />
          <MetaRow label="SECTIONS" value="14 + APPENDIX" />
          <MetaRow label="ISOLATION" value="NO TRADINGVIEW · NO SHELL" />
        </div>
      </div>

      {/* source-of-truth label */}
      <div
        className="relative px-6 py-5"
        style={{
          background: DNA.glass,
          border: `1px solid ${DNA.tealRule}`,
          borderRadius: DNA.rMd,
          backdropFilter: "blur(20px) saturate(140%)",
        }}
      >
        <div className="flex items-start gap-4">
          <span
            aria-hidden
            className="mt-1.5 shrink-0"
            style={{ width: 4, height: 4, borderRadius: 999, background: DNA.teal, boxShadow: `0 0 6px ${DNA.teal}` }}
          />
          <p
            className="font-sans"
            style={{ fontSize: 13, color: DNA.paperDim, lineHeight: 1.65, maxWidth: 980 }}
          >
            <span style={{ ...MONO_CAP_TIGHT, fontSize: 9, color: DNA.teal, marginRight: 10 }}>
              SOURCE OF TRUTH
            </span>
            The kit primitives live in
            <code style={{ color: DNA.teal, margin: "0 6px" }}>components/design/archio-kit</code>
            and read from
            <code style={{ color: DNA.teal, margin: "0 6px" }}>design-tokens</code>. Edit a token
            or a primitive here and the change propagates to every screen that
            inherits the system. Nothing on this page is a screenshot.
          </p>
        </div>
      </div>
    </header>
  )
}

/* ── Footer ──────────────────────────────────────────────────────────── */

function Footer() {
  return (
    <footer className="mt-24 flex items-center gap-3">
      <span aria-hidden className="flex-1 h-px" style={{ background: DNA.tealRule }} />
      <span style={{ ...MONO_CAP_TIGHT, fontSize: 9, color: DNA.ashSoft }}>
        END OF MASTER PALETTE · SHARED SYSTEM · /dashboard ↔ /design
      </span>
      <span aria-hidden className="flex-1 h-px" style={{ background: DNA.tealRule }} />
    </footer>
  )
}
