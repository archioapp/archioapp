"use client"

/* ═══════════════════════════════════════════════════════════════
   MENTOR DASHBOARD RAIL -- v2
   
   The mentor's live operating method as an interactive right-rail.
   ALWAYS interactive. No pointer-events-none. Demo mode defaults ON
   so the dashboard shows an active killzone session regardless of 
   the real time -- every module is explorable.
   ═══════════════════════════════════════════════════════════════ */

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useMentorDashboard } from "@/lib/mentor/useMentorDashboard"
import { MentorIdentityHeader } from "./MentorIdentityHeader"
import { SessionGate } from "./SessionGate"
import { DayFilterStrip } from "./DayFilterStrip"
import { BiasContext } from "./BiasContext"
import { EntryModelCards } from "./EntryModelCards"
import { RiskGuidanceBar } from "./RiskGuidanceBar"
import { WarRoomLauncher } from "./WarRoomLauncher"
import { MentorAIChat } from "./MentorAIChat"
import { MethodVault } from "./MethodVault"

interface Props {
  templateId?: string
}

export function MentorDashboardRail({ templateId = "jadecap-ict-ny" }: Props) {
  const { template, state, demoMode, toggleDemoMode } = useMentorDashboard(templateId)

  const conditionsSummary = `${state.conditionsMetCount} of ${state.conditionsTotalCount} conditions met`

  // Live clock
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const etTime = now.toLocaleTimeString("en-US", {
    timeZone: "America/New_York",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  })
  const etDate = now.toLocaleDateString("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
    month: "short",
    day: "numeric",
  })

  return (
    <div className="absolute inset-0 flex flex-col bg-[#08080c]">
      {/* Fixed header zone */}
      <div className="shrink-0">
        {/* Live time bar */}
        <div className="flex items-center justify-between px-3 py-1.5" style={{ backgroundColor: "rgba(167,139,250,0.02)", borderBottom: "1px solid rgba(167,139,250,0.06)" }}>
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
              <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-violet-400 animate-ping opacity-40" />
            </div>
            <span className="text-[7px] font-mono font-black tracking-[0.15em] uppercase text-violet-400/50">
              MENTOR OS
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-mono text-white/15">{etDate}</span>
            <span className="text-[9px] font-mono font-bold tabular-nums text-violet-400/60">{etTime}</span>
            <span className="text-[7px] font-mono text-white/15">ET</span>
          </div>
        </div>

        {/* Demo mode toggle */}
        <div className="flex items-center justify-between px-3 py-1" style={{ backgroundColor: demoMode ? "rgba(167,139,250,0.02)" : "transparent", borderBottom: "1px solid rgba(255,255,255,0.02)" }}>
          <span className="text-[7px] font-mono text-white/15">
            {demoMode ? "Simulated killzone session" : "Live market time"}
          </span>
          <button
            onClick={toggleDemoMode}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded-md transition-all duration-200"
            style={{
              backgroundColor: demoMode ? "rgba(167,139,250,0.08)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${demoMode ? "rgba(167,139,250,0.15)" : "rgba(255,255,255,0.05)"}`,
            }}
          >
            <div
              className="w-5 h-2.5 rounded-full relative transition-colors duration-200"
              style={{ backgroundColor: demoMode ? "rgba(167,139,250,0.3)" : "rgba(255,255,255,0.08)" }}
            >
              <motion.div
                className="absolute top-[2px] w-[6px] h-[6px] rounded-full"
                animate={{ left: demoMode ? 11 : 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                style={{ backgroundColor: demoMode ? "#a78bfa" : "rgba(255,255,255,0.25)" }}
              />
            </div>
            <span className="text-[7px] font-mono font-bold" style={{ color: demoMode ? "rgba(167,139,250,0.6)" : "rgba(255,255,255,0.2)" }}>
              DEMO
            </span>
          </button>
        </div>

        {/* Mentor identity */}
        <MentorIdentityHeader template={template} status={state.mentorStatus} />
      </div>

      {/* Scrollable body -- ALWAYS interactive, no pointer-events-none */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-terminal">
        {/* Session Gate -- always first, always visible, always clickable */}
        <SessionGate
          phase={state.sessionPhase}
          sessionLabel={state.sessionLabel}
          timeUntilNext={state.timeUntilNext}
          killzoneStart={template.session.killzoneStart}
          killzoneEnd={template.session.killzoneEnd}
          timezone={template.session.timezone}
        />

        {/* Status summary bar */}
        <div className="mx-3 my-1 flex items-center gap-2 px-2.5 py-1.5 rounded-md" style={{ backgroundColor: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.03)" }}>
          <span className="text-[7px] font-mono text-white/12">STATUS</span>
          <div className="flex items-center gap-1">
            <div className={`w-1 h-1 rounded-full ${state.sessionPhase === "KILLZONE" ? "bg-emerald-400" : state.sessionPhase === "PRE_SESSION" ? "bg-amber-400" : "bg-gray-500"}`} />
            <span className={`text-[7.5px] font-mono font-bold ${state.sessionPhase === "KILLZONE" ? "text-emerald-400/50" : state.sessionPhase === "PRE_SESSION" ? "text-amber-400/50" : "text-white/15"}`}>
              {state.sessionPhase.replace("_", " ")}
            </span>
          </div>
          <span className="text-[7px] font-mono text-white/06">|</span>
          <span className="text-[7.5px] font-mono text-white/15">{conditionsSummary}</span>
          <span className="text-[7px] font-mono text-white/06">|</span>
          <span className={`text-[7.5px] font-mono font-bold ${state.bias.direction === "BEARISH" ? "text-red-400/40" : state.bias.direction === "BULLISH" ? "text-emerald-400/40" : "text-amber-400/40"}`}>
            {state.bias.direction}
          </span>
        </div>

        {/* Day Filter + News Strip */}
        <DayFilterStrip
          dayValidity={state.dayValidity}
          dayNote={state.dayNote}
          activeNews={state.activeNews}
        />

        {/* Bias / Market Context */}
        <BiasContext bias={state.bias} />

        {/* Entry Models -- the heart of the dashboard */}
        <EntryModelCards models={state.entryModels} accentColor={template.accentColor} />

        {/* Risk Guidance */}
        <RiskGuidanceBar guidance={state.riskGuidance} />

        {/* War Room CTA (only shows when active) */}
        <WarRoomLauncher warRooms={state.activeWarRooms} mentorName={template.mentorName} />

        {/* JadeCap AI Agent -- always accessible */}
        <div className="relative">
          <div className="mx-3 my-1.5 flex items-center gap-2">
            <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(167,139,250,0.1), transparent)" }} />
            <span className="text-[6px] font-mono font-black tracking-[0.2em] uppercase text-violet-400/20">AI AGENT</span>
            <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(167,139,250,0.1), transparent)" }} />
          </div>

          <MentorAIChat
            persona={template.aiPersona}
            mentorName={template.mentorName}
            accentColor={template.accentColor}
            conditionsSummary={conditionsSummary}
            sessionPhase={state.sessionPhase}
            bias={state.bias.direction}
          />
        </div>

        {/* Method Vault */}
        <MethodVault entries={template.methodVault} accentColor={template.accentColor} />

        {/* Bottom spacer */}
        <div className="h-6" />
      </div>
    </div>
  )
}
