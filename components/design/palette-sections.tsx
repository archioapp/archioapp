"use client"

/* ──────────────────────────────────────────────────────────────────────────
 *  PALETTE SECTIONS  ·  the master design-system documentation
 *
 *  Sections 03–14 of /design. Each one documents one axis of the ArchioAI
 *  Visual DNA — color, type, panels, cards, controls, command bar, status
 *  rail, alerts, the swipe/drawer language, motion, layout — and demos the
 *  real reusable primitives from `archio-kit.tsx`. This is the source of
 *  truth every future page inherits from.
 * ──────────────────────────────────────────────────────────────────────── */

import type React from "react"
import { DNA, MONO_CAP, MONO_CAP_TIGHT, TACTICAL_GRID } from "./design-tokens"
import { SectionLabel, LiveFrame, SpecCell, SpecLabel, TokenLine } from "./design-scaffold"
import {
  ArchioPanel,
  ArchioCard,
  ArchioButton,
  ArchioPillGroup,
  ArchioChip,
  ArchioCommandInput,
  ArchioStatusRail,
  ArchioAlertModule,
  ArchioDrawerSpecimen,
} from "./archio-kit"

/* shared section spacing */
const SECTION_GAP = "mt-28"

/* ═══════════════════════════════════════════════════════════════════════
   03 · COLOR SYSTEM
   ═══════════════════════════════════════════════════════════════════════ */

export function ColorSystem() {
  return (
    <section className={SECTION_GAP}>
      <SectionLabel
        number="03"
        title="COLOR SYSTEM"
        badge="TOKENS"
        caption="The TEAL_GLASS palette. World ink for depth, a single teal for system intelligence, an institutional risk-red reserved exclusively for danger, and layered glass surfaces. No other hues are ever introduced."
        sourcePath="components/design/design-tokens.ts"
      />
      <div className="mt-8">
        <LiveFrame padded>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <SwatchGroup
              title="WORLD INK"
              swatches={[
                ["ink", DNA.ink],
                ["ink2", DNA.ink2],
                ["ink3", DNA.ink3],
              ]}
            />
            <SwatchGroup
              title="FOREGROUND"
              swatches={[
                ["paper", DNA.paper],
                ["paperDim", DNA.paperDim],
                ["ash", DNA.ash],
                ["ashSoft", DNA.ashSoft],
                ["ashGhost", DNA.ashGhost],
              ]}
            />
            <SwatchGroup
              title="TEAL · INTELLIGENCE"
              swatches={[
                ["teal", DNA.teal],
                ["tealDeep", DNA.tealDeep],
                ["tealHalo", DNA.tealHalo],
                ["tealWash", DNA.tealWash],
              ]}
            />
            <SwatchGroup
              title="RISK · DANGER ONLY"
              swatches={[
                ["riskInk", DNA.riskInk],
                ["riskAmber", DNA.riskAmber],
                ["riskGlow", DNA.riskGlow],
                ["riskWash", DNA.riskWash],
              ]}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <SpecCell label="GLASS · DEFAULT" style={{ background: DNA.glass }}>
              <span className="font-mono" style={{ fontSize: 11, color: DNA.paperDim }}>
                rgba(16,23,28,0.60)
              </span>
            </SpecCell>
            <SpecCell label="GLASS · STRONG" style={{ background: DNA.glassStrong }}>
              <span className="font-mono" style={{ fontSize: 11, color: DNA.paperDim }}>
                rgba(14,20,26,0.80)
              </span>
            </SpecCell>
            <SpecCell label="GLASS · DEEP" style={{ background: DNA.glassDeep }}>
              <span className="font-mono" style={{ fontSize: 11, color: DNA.paperDim }}>
                rgba(10,14,18,0.88)
              </span>
            </SpecCell>
          </div>
        </LiveFrame>
      </div>
    </section>
  )
}

function SwatchGroup({
  title,
  swatches,
}: {
  title: string
  swatches: [string, string][]
}) {
  return (
    <div className="flex flex-col gap-3">
      <SpecLabel color={DNA.teal}>{title}</SpecLabel>
      <div className="flex flex-col gap-2">
        {swatches.map(([name, val]) => (
          <div
            key={name}
            className="flex items-center gap-3"
            style={{
              background: DNA.glassStrong,
              border: `1px solid ${DNA.tealRule}`,
              borderRadius: DNA.rSm,
              padding: 8,
            }}
          >
            <span
              aria-hidden
              style={{
                width: 34,
                height: 34,
                borderRadius: 6,
                background: val,
                border: `1px solid ${DNA.tealRule}`,
                flexShrink: 0,
              }}
            />
            <div className="flex flex-col">
              <span className="font-mono" style={{ fontSize: 11, color: DNA.paper }}>
                {name}
              </span>
              <span className="font-mono" style={{ fontSize: 9.5, color: DNA.ash }}>
                {val.length > 18 ? `${val.slice(0, 17)}…` : val}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   04 · TYPOGRAPHY
   ═══════════════════════════════════════════════════════════════════════ */

export function TypographySystem() {
  return (
    <section className={SECTION_GAP}>
      <SectionLabel
        number="04"
        title="TYPOGRAPHY"
        badge="SYSTEM"
        caption="Two families. Inter (sans) carries display headlines and body copy with tight tracking and light weights. JetBrains Mono (mono) carries every eyebrow, instrument readout, tabular numeral, and source path — always uppercase with wide tracking."
        sourcePath="app/layout.tsx · --font-sans · --font-mono"
      />
      <div className="mt-8">
        <LiveFrame padded>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* sans scale */}
            <div className="flex flex-col gap-5">
              <SpecLabel color={DNA.teal}>SANS · INTER · DISPLAY + BODY</SpecLabel>
              <div className="flex flex-col gap-4">
                <TypeSpec size={48} weight={300} label="Display / 48 / 300">
                  The board reads bullish.
                </TypeSpec>
                <TypeSpec size={28} weight={400} label="Title / 28 / 400">
                  Forecast Room is open.
                </TypeSpec>
                <TypeSpec size={16} weight={400} label="Subtitle / 16 / 400">
                  Three ecosystems match how you trade.
                </TypeSpec>
                <TypeSpec size={13.5} weight={400} label="Body / 13.5 / 400" color={DNA.paperDim}>
                  Plan-aware copy renders at this size with leading-relaxed for
                  comfortable reading across the cockpit surfaces.
                </TypeSpec>
              </div>
            </div>

            {/* mono scale */}
            <div className="flex flex-col gap-5">
              <SpecLabel color={DNA.teal}>MONO · JETBRAINS · INSTRUMENTS</SpecLabel>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <span style={{ ...MONO_CAP, fontSize: 11, color: DNA.paper }}>
                    EYEBROW · MONO CAP · 11 / 0.18EM
                  </span>
                  <span className="font-mono" style={{ fontSize: 9, color: DNA.ashSoft }}>
                    section + module labels
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span style={{ ...MONO_CAP_TIGHT, fontSize: 9, color: DNA.teal }}>
                    MICRO CAP · 9 / 0.14EM · TEAL
                  </span>
                  <span className="font-mono" style={{ fontSize: 9, color: DNA.ashSoft }}>
                    chips, badges, meta keys
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span
                    className="font-mono tabular-nums"
                    style={{ fontSize: 40, color: DNA.paper, letterSpacing: "-0.02em" }}
                  >
                    02:14:08
                  </span>
                  <span className="font-mono" style={{ fontSize: 9, color: DNA.ashSoft }}>
                    countdown numerals · tabular
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span
                    className="font-mono tabular-nums"
                    style={{ fontSize: 18, color: DNA.teal }}
                  >
                    +4.1R · $113,863
                  </span>
                  <span className="font-mono" style={{ fontSize: 9, color: DNA.ashSoft }}>
                    readouts · tabular nums
                  </span>
                </div>
              </div>
            </div>
          </div>
        </LiveFrame>
      </div>
    </section>
  )
}

function TypeSpec({
  children,
  size,
  weight,
  label,
  color = DNA.paper,
}: {
  children: React.ReactNode
  size: number
  weight: number
  label: string
  color?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span
        className="font-sans text-balance"
        style={{ fontSize: size, fontWeight: weight, color, letterSpacing: "-0.02em", lineHeight: 1.1 }}
      >
        {children}
      </span>
      <span className="font-mono" style={{ fontSize: 9, color: DNA.ashSoft }}>
        {label}
      </span>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   05 · PANEL / BOX SYSTEM
   ═══════════════════════════════════════════════════════════════════════ */

export function PanelSystem() {
  return (
    <section className={SECTION_GAP}>
      <SectionLabel
        number="05"
        title="PANEL · BOX SYSTEM"
        badge="LIVE"
        caption="The structural box. A blurred glass surface, a 12% teal hairline border, an inset top-edge halo, and a soft drop shadow. Three depth tones stack to create cockpit hierarchy without introducing new colors."
        sourcePath="components/design/archio-kit.tsx · ArchioPanel"
      />
      <div className="mt-8">
        <LiveFrame padded>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <ArchioPanel tone="glass">
              <SpecLabel color={DNA.teal}>TONE · GLASS</SpecLabel>
              <p className="font-sans mt-3" style={{ fontSize: 13, color: DNA.paperDim, lineHeight: 1.55 }}>
                Default surface for content sitting on the world ink.
              </p>
            </ArchioPanel>
            <ArchioPanel tone="strong">
              <SpecLabel color={DNA.teal}>TONE · STRONG</SpecLabel>
              <p className="font-sans mt-3" style={{ fontSize: 13, color: DNA.paperDim, lineHeight: 1.55 }}>
                Raised surface for cards nested inside another panel.
              </p>
            </ArchioPanel>
            <ArchioPanel tone="deep">
              <SpecLabel color={DNA.teal}>TONE · DEEP</SpecLabel>
              <p className="font-sans mt-3" style={{ fontSize: 13, color: DNA.paperDim, lineHeight: 1.55 }}>
                Recessed wells: inputs, rails, and inset readouts.
              </p>
            </ArchioPanel>
          </div>

          <div className="mt-5">
            <ArchioPanel tone="glass" style={{ padding: 0, overflow: "hidden" }}>
              <div className="relative" style={{ ...TACTICAL_GRID }}>
                <div className="p-6 flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <SpecLabel color={DNA.teal}>NESTED COMPOSITION</SpecLabel>
                    <span className="font-sans" style={{ fontSize: 14, color: DNA.paper }}>
                      Panels accept the tactical grid as an inner texture
                    </span>
                  </div>
                  <ArchioPanel tone="deep" style={{ padding: 14 }} inset>
                    <span className="font-mono tabular-nums" style={{ fontSize: 18, color: DNA.teal }}>
                      78%
                    </span>
                  </ArchioPanel>
                </div>
              </div>
            </ArchioPanel>
          </div>
        </LiveFrame>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   06 · CARD SYSTEM
   ═══════════════════════════════════════════════════════════════════════ */

export function CardSystem() {
  return (
    <section className={SECTION_GAP}>
      <SectionLabel
        number="06"
        title="CARD SYSTEM"
        badge="INTERACTIVE"
        caption="The standard interactive surface. Hover any card — it lifts 2px, the border brightens to 20% teal, and a halo blooms. The same lift powers every clickable tile across the platform. Hover the cards below."
        sourcePath="components/design/archio-kit.tsx · ArchioCard"
      />
      <div className="mt-8">
        <LiveFrame padded>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <ArchioCard
              eyebrow="YOUR RECORD"
              title="73% hit rate"
              footer={<ArchioChip>+4.1R NET · 30D</ArchioChip>}
            >
              Bullish forecasts on EUR/USD have averaged positive expectancy
              this quarter.
            </ArchioCard>
            <ArchioCard
              eyebrow="MENTOR CONSENSUS"
              title="6 of 8 bullish"
              footer={
                <div className="flex gap-2 flex-wrap">
                  <ArchioChip>BTC-ROYALTY</ArchioChip>
                  <ArchioChip>FX-DESK</ArchioChip>
                </div>
              }
            >
              The mentors you follow lean long into the London session.
            </ArchioCard>
            <ArchioCard
              eyebrow="MACRO OVERLAY"
              title="ECB · 08:30"
              accent={DNA.riskInk}
              footer={<ArchioChip tone="risk" hot>HIGH IMPACT</ArchioChip>}
            >
              A high-impact EUR event lands before the New York open.
            </ArchioCard>
          </div>
        </LiveFrame>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   07 · BUTTON / PILL / CHIP SYSTEM
   ═══════════════════════════════════════════════════════════════════════ */

export function ControlSystem() {
  return (
    <section className={SECTION_GAP}>
      <SectionLabel
        number="07"
        title="BUTTON · PILL · CHIP"
        badge="INTERACTIVE"
        caption="The control vocabulary. Buttons in four ranks, a segmented pill group, and chips in three states. Every control is live — hover for the lift, click the pills to toggle, click a selectable chip, watch the hot chip's halo sweep."
        sourcePath="components/design/archio-kit.tsx"
      />
      <div className="mt-8">
        <LiveFrame padded>
          <div className="flex flex-col gap-8">
            {/* buttons */}
            <div className="flex flex-col gap-3">
              <SpecLabel color={DNA.teal}>BUTTONS · PRIMARY · SECONDARY · GHOST · DANGER</SpecLabel>
              <div className="flex items-center gap-3 flex-wrap">
                <ArchioButton variant="primary">Publish forecast</ArchioButton>
                <ArchioButton variant="secondary">Compare two</ArchioButton>
                <ArchioButton variant="ghost">Audit a forecaster</ArchioButton>
                <ArchioButton variant="danger">Close all positions</ArchioButton>
              </div>
            </div>

            {/* pills */}
            <div className="flex flex-col gap-3">
              <SpecLabel color={DNA.teal}>PILL GROUP · SEGMENTED TOGGLE</SpecLabel>
              <div className="flex items-center gap-4 flex-wrap">
                <ArchioPillGroup options={["1D", "1W", "1M", "ALL"]} defaultValue="1W" />
                <ArchioPillGroup options={["FOREX", "CRYPTO", "INDICES"]} />
              </div>
            </div>

            {/* chips */}
            <div className="flex flex-col gap-3">
              <SpecLabel color={DNA.teal}>CHIPS · DEFAULT · SELECTABLE · HOT</SpecLabel>
              <div className="flex items-center gap-2 flex-wrap">
                <ArchioChip>EUR/USD</ArchioChip>
                <ArchioChip selectable>GBP/JPY · TAP</ArchioChip>
                <ArchioChip selectable>XAU/USD · TAP</ArchioChip>
                <ArchioChip hot>LIVE NOW</ArchioChip>
                <ArchioChip tone="amber" hot>ELEVATED</ArchioChip>
                <ArchioChip tone="risk" hot>HIGH IMPACT</ArchioChip>
              </div>
            </div>
          </div>
        </LiveFrame>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   08 · COMMAND INPUT
   ═══════════════════════════════════════════════════════════════════════ */

export function CommandSystem() {
  return (
    <section className={SECTION_GAP}>
      <SectionLabel
        number="08"
        title="COMMAND INPUT"
        badge="LIVE"
        caption="The Ask bar — the platform's primary intent surface. Focus it and the ring blooms teal, the ⌘K affordance stays docked, and the submit glyph is always one reach away. Click in and type."
        sourcePath="components/design/archio-kit.tsx · ArchioCommandInput"
      />
      <div className="mt-8">
        <LiveFrame padded>
          <div className="flex flex-col gap-4">
            <ArchioCommandInput />
            <div className="flex items-center gap-2 flex-wrap">
              <SpecLabel>TRY</SpecLabel>
              <ArchioChip selectable>What changed since yesterday?</ArchioChip>
              <ArchioChip selectable>Who is hot in EUR right now?</ArchioChip>
              <ArchioChip selectable>Audit my last 5 trades</ArchioChip>
            </div>
          </div>
        </LiveFrame>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   09 · STATUS RAIL
   ═══════════════════════════════════════════════════════════════════════ */

export function StatusRailSystem() {
  return (
    <section className={SECTION_GAP}>
      <SectionLabel
        number="09"
        title="STATUS RAIL"
        badge="LIVE"
        caption="The always-on instrument strip. Tabular readouts for tick, record, equity, and session — divided by teal hairlines, anchored by a breathing live dot. This rail rides the top of every cockpit room."
        sourcePath="components/design/archio-kit.tsx · ArchioStatusRail"
      />
      <div className="mt-8">
        <LiveFrame padded>
          <ArchioStatusRail />
        </LiveFrame>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   10 · ALERT / RISK MODULES
   ═══════════════════════════════════════════════════════════════════════ */

export function AlertRiskSystem() {
  return (
    <section className={SECTION_GAP}>
      <SectionLabel
        number="10"
        title="ALERT · RISK MODULES"
        badge="INTERACTIVE"
        caption="Severity-graded event rows. Low events glow teal, medium amber, high red — risk-red is reserved for danger and nothing else. Click any row to expand its detail and affected-pair chips. Same pattern as the Macro Alert Sheet."
        sourcePath="components/design/archio-kit.tsx · ArchioAlertModule"
      />
      <div className="mt-8">
        <LiveFrame padded>
          <div className="flex flex-col gap-3">
            <ArchioAlertModule
              severity="high"
              title="ECB Rate Decision"
              time="08:30"
              pairs={["EUR/USD", "EUR/GBP", "EUR/JPY"]}
            />
            <ArchioAlertModule
              severity="medium"
              title="US Initial Jobless Claims"
              time="13:30"
              detail="Medium-impact USD event. Expect a short volatility window. Tighten stops on USD majors through the print."
              pairs={["USD/JPY", "AUD/USD"]}
            />
            <ArchioAlertModule
              severity="low"
              title="BoJ Governor Speech"
              time="22:00"
              detail="Low-impact JPY commentary. Monitor for tone shifts; no action required unless guidance changes."
              pairs={["USD/JPY"]}
            />
          </div>
        </LiveFrame>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   11 · SWIPE / DRAWER LANGUAGE
   ═══════════════════════════════════════════════════════════════════════ */

export function DrawerSystem() {
  return (
    <section className={SECTION_GAP}>
      <SectionLabel
        number="11"
        title="SWIPE · DRAWER LANGUAGE"
        badge="INTERACTIVE"
        caption="The bottom-sheet grammar. A grabber, a spring slide on EASE_V, a blurred scrim, and rounded top corners. Tap to summon, tap the scrim or CLOSE to dismiss. This is a self-contained specimen — it documents the motion without mounting the production swipe shell."
        sourcePath="components/design/archio-kit.tsx · ArchioDrawerSpecimen"
      />
      <div className="mt-8">
        <LiveFrame padded>
          <div className="max-w-md mx-auto">
            <ArchioDrawerSpecimen />
          </div>
        </LiveFrame>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   12 · ANIMATION / HOVER RULES
   ═══════════════════════════════════════════════════════════════════════ */

export function AnimationSystem() {
  return (
    <section className={SECTION_GAP}>
      <SectionLabel
        number="12"
        title="ANIMATION · HOVER RULES"
        badge="LIVE"
        caption="One easing curve governs everything: EASE_V = cubic-bezier(0.22, 1, 0.36, 1). Lifts are 2px / 280ms, live dots breathe on a 1.6s loop, hot elements run a 4s halo sweep with a 0.55 opacity floor, and activity blooms pulse outward. All motion collapses under prefers-reduced-motion."
        sourcePath="app/globals.css · archio-* keyframes"
      />
      <div className="mt-8">
        <LiveFrame padded>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MotionSpec label="LIFT · 2PX · 280MS">
              <div className="flex items-center justify-center" style={{ height: 64 }}>
                <ArchioButton variant="secondary">Hover me</ArchioButton>
              </div>
            </MotionSpec>

            <MotionSpec label="BREATHE · 1.6S">
              <div className="flex items-center justify-center gap-3" style={{ height: 64 }}>
                <span
                  className="archio-breathe"
                  aria-hidden
                  style={{ width: 12, height: 12, borderRadius: 999, background: DNA.teal, boxShadow: `0 0 12px ${DNA.teal}` }}
                />
                <span
                  className="archio-breathe"
                  aria-hidden
                  style={{ width: 12, height: 12, borderRadius: 999, background: DNA.riskAmber, boxShadow: `0 0 12px ${DNA.riskAmber}`, animationDelay: "0.4s" }}
                />
              </div>
            </MotionSpec>

            <MotionSpec label="HALO SWEEP · 4S">
              <div className="flex items-center justify-center" style={{ height: 64 }}>
                <ArchioChip hot>HOT · LIVE</ArchioChip>
              </div>
            </MotionSpec>

            <MotionSpec label="ACTIVITY BLOOM">
              <div className="flex items-center justify-center" style={{ height: 64 }}>
                <span className="relative inline-flex items-center justify-center" style={{ width: 24, height: 24 }}>
                  <span
                    aria-hidden
                    className="archio-bloom absolute"
                    style={{ width: 24, height: 24, borderRadius: 999, border: `1.5px solid ${DNA.teal}` }}
                  />
                  <span
                    aria-hidden
                    style={{ width: 8, height: 8, borderRadius: 999, background: DNA.teal, boxShadow: `0 0 10px ${DNA.teal}` }}
                  />
                </span>
              </div>
            </MotionSpec>
          </div>

          <div
            className="mt-5 flex flex-col gap-2"
            style={{ background: DNA.glassDeep, border: `1px solid ${DNA.tealRule}`, borderRadius: DNA.rMd, padding: 18 }}
          >
            <SpecLabel color={DNA.teal}>TIMING CONSTANTS</SpecLabel>
            <TokenLine name="EASE_V" value="cubic-bezier(0.22, 1, 0.36, 1)" />
            <TokenLine name="lift" value="translateY(-2px) · 280ms" />
            <TokenLine name="breathe" value="1.6s · opacity 0.45→1" />
            <TokenLine name="halo sweep" value="4s · floor 0.55" />
            <TokenLine name="drawer" value="420ms spring slide" />
            <TokenLine name="reduced-motion" value="all → instant final state" />
          </div>
        </LiveFrame>
      </div>
    </section>
  )
}

function MotionSpec({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <SpecCell label={label} style={{ background: DNA.glassDeep }}>
      {children}
    </SpecCell>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   13 · LAYOUT / GRID / SPACING
   ═══════════════════════════════════════════════════════════════════════ */

export function LayoutSystem() {
  return (
    <section className={SECTION_GAP}>
      <SectionLabel
        number="13"
        title="LAYOUT · GRID · SPACING"
        badge="RULES"
        caption="A 12-column grid on a 1480px max canvas, an 8px spacing rhythm, a 48px tactical backdrop grid, and a four-step radius scale. Flexbox drives most compositions; CSS grid is reserved for true 2D layouts."
        sourcePath="components/design/design-tokens.ts · DNA.r*"
      />
      <div className="mt-8">
        <LiveFrame padded>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* 12 col grid */}
            <SpecCell label="12-COLUMN GRID · 1480 MAX" style={{ background: DNA.glassDeep }}>
              <div className="grid grid-cols-12 gap-1.5 mt-1">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      height: 44,
                      borderRadius: 4,
                      background: DNA.tealWash,
                      border: `1px solid ${DNA.tealRule}`,
                    }}
                  />
                ))}
              </div>
            </SpecCell>

            {/* radius scale */}
            <SpecCell label="RADIUS SCALE" style={{ background: DNA.glassDeep }}>
              <div className="flex items-end gap-4 mt-1">
                {([
                  ["rSm", DNA.rSm],
                  ["rMd", DNA.rMd],
                  ["rLg", DNA.rLg],
                  ["rXl", DNA.rXl],
                ] as [string, number][]).map(([name, r]) => (
                  <div key={name} className="flex flex-col items-center gap-2">
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        borderTopLeftRadius: r,
                        borderTopRightRadius: r,
                        background: DNA.tealWash,
                        borderTop: `1px solid ${DNA.tealRuleStrong}`,
                        borderLeft: `1px solid ${DNA.tealRuleStrong}`,
                        borderRight: `1px solid ${DNA.tealRuleStrong}`,
                      }}
                    />
                    <span className="font-mono" style={{ fontSize: 9.5, color: DNA.ash }}>
                      {name} · {r}
                    </span>
                  </div>
                ))}
              </div>
            </SpecCell>
          </div>

          {/* spacing rhythm */}
          <SpecCell label="8PX SPACING RHYTHM" style={{ background: DNA.glassDeep, marginTop: 16 }}>
            <div className="flex items-end gap-3 mt-1">
              {[8, 16, 24, 32, 48, 64].map((s) => (
                <div key={s} className="flex flex-col items-center gap-2">
                  <div
                    style={{
                      width: s,
                      height: s,
                      background: DNA.teal,
                      borderRadius: 4,
                      opacity: 0.85,
                    }}
                  />
                  <span className="font-mono tabular-nums" style={{ fontSize: 9.5, color: DNA.ash }}>
                    {s}
                  </span>
                </div>
              ))}
            </div>
          </SpecCell>
        </LiveFrame>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   14 · EXAMPLE COMPONENTS
   ═══════════════════════════════════════════════════════════════════════ */

export function ExampleComponents() {
  return (
    <section className={SECTION_GAP}>
      <SectionLabel
        number="14"
        title="EXAMPLE COMPONENTS"
        badge="COMPOSED"
        caption="The vocabulary composed into shippable surfaces. These are templates for the rest of the platform — a stat tile, a live-session row, and a recommendation footer — each assembled entirely from the primitives above."
        sourcePath="composed from archio-kit.tsx"
      />
      <div className="mt-8">
        <LiveFrame padded>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* stat tile */}
            <ArchioPanel tone="strong" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="flex items-center justify-between">
                <SpecLabel color={DNA.teal}>WEEKLY P&L</SpecLabel>
                <ArchioChip>+12.4%</ArchioChip>
              </div>
              <span className="font-mono tabular-nums" style={{ fontSize: 34, color: DNA.paper, letterSpacing: "-0.02em" }}>
                +9.8R
              </span>
              <div className="flex items-end gap-1.5" style={{ height: 40 }}>
                {[12, 18, 9, 24, 30, 22, 36].map((h, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: `${(h / 36) * 100}%`,
                      background: i === 6 ? DNA.teal : DNA.tealWash,
                      border: `1px solid ${DNA.tealRule}`,
                      borderRadius: 3,
                    }}
                  />
                ))}
              </div>
            </ArchioPanel>

            {/* live session row */}
            <ArchioPanel tone="strong" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="flex items-center justify-between">
                <SpecLabel color={DNA.teal}>LIVE SESSION</SpecLabel>
                <span className="relative inline-flex items-center justify-center" style={{ width: 18, height: 18 }}>
                  <span aria-hidden className="archio-bloom absolute" style={{ width: 18, height: 18, borderRadius: 999, border: `1.5px solid ${DNA.riskAmber}` }} />
                  <span aria-hidden style={{ width: 6, height: 6, borderRadius: 999, background: DNA.riskAmber }} />
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span style={{ width: 38, height: 38, borderRadius: 999, background: DNA.tealWash, border: `1px solid ${DNA.tealRuleStrong}` }} aria-hidden />
                <div className="flex flex-col">
                  <span className="font-sans" style={{ fontSize: 14, color: DNA.paper }}>BTC-Royalty</span>
                  <span className="font-mono" style={{ fontSize: 10, color: DNA.ash }}>247 watching</span>
                </div>
              </div>
              <ArchioButton variant="primary">Join session</ArchioButton>
            </ArchioPanel>

            {/* recommendation footer */}
            <ArchioPanel tone="strong" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <SpecLabel color={DNA.teal}>RECOMMENDED</SpecLabel>
              <p className="font-sans" style={{ fontSize: 14, color: DNA.paper, lineHeight: 1.5 }}>
                Your style aligns <span style={{ color: DNA.teal }}>91%</span> with
                Liquidity-Hunters — start there.
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <ArchioChip hot>91% FIT</ArchioChip>
                <ArchioChip>14 MENTORS</ArchioChip>
              </div>
              <div className="flex items-center gap-2 mt-auto">
                <ArchioButton variant="primary">Explore</ArchioButton>
                <ArchioButton variant="ghost">Later</ArchioButton>
              </div>
            </ArchioPanel>
          </div>
        </LiveFrame>
      </div>
    </section>
  )
}
