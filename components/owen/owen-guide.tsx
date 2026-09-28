"use client"

import { GUIDE, SCREENS, TABS } from "./owen-data"
import { EmergencyList, GuideBody } from "./owen-presenter"

/** The whole presenter guide on one light page — Cmd+P prints it cleanly. */
export function OwenGuide() {
  return (
    <div className="owen-scope owen-print min-h-screen font-sans" style={{ background: "#FAFBFC", color: "#111418" }}>
      <main className="mx-auto flex flex-col" style={{ maxWidth: 760, padding: "40px 24px 80px", gap: 40 }}>
        <header className="flex flex-col" style={{ gap: 8 }}>
          <span className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: "0.26em", color: "#6B7480", fontWeight: 600 }}>ARCHIO × Owen · presenter guide</span>
          <h1 className="font-sans m-0" style={{ fontSize: 30, lineHeight: 1.1, letterSpacing: "-0.02em", fontWeight: 600 }}>Kan + Luke — glance, don&apos;t read.</h1>
          <p className="font-mono m-0" style={{ fontSize: 12, color: "#6B7480" }}>Tabs open, in this order: {TABS.join("  ·  ")}. Nothing else.</p>
        </header>

        {SCREENS.map((s, i) => (
          <section key={s.id} className="flex flex-col owen-print-block" style={{ gap: 18, borderTop: "2px solid #111418", paddingTop: 18 }}>
            <h2 className="font-sans m-0" style={{ fontSize: 22, lineHeight: 1.1, letterSpacing: "-0.015em", fontWeight: 700 }}>
              <span className="font-mono" style={{ fontSize: 12, letterSpacing: "0.2em", color: "#0F8F80", marginRight: 12 }}>SCREEN {i + 1}</span>
              {s.title.toUpperCase()}
            </h2>
            <GuideBody g={GUIDE[s.id]} dark={false} />
          </section>
        ))}

        <section className="flex flex-col owen-print-block" style={{ gap: 16, borderTop: "2px solid #111418", paddingTop: 18 }}>
          <h2 className="font-sans m-0" style={{ fontSize: 18, letterSpacing: "-0.01em", fontWeight: 700 }}>Emergency</h2>
          <EmergencyList dark={false} />
        </section>
      </main>
    </div>
  )
}
