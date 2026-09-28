"use client"

import { useState, useCallback, useRef } from "react"
import { motion } from "framer-motion"
import {
  Shield,
  Lock,
  Fingerprint,
  Eye,
  ShieldAlert,
  CheckCircle2,
  ChevronRight,
  Zap,
  Activity,
  Scan,
} from "lucide-react"
import { SecureGuideAndTutorial } from "@/components/copilot/onboarding/SecureGuideAndTutorial"

/* ═══════════════════════════════════════════════════════════════
   COPILOT SECURE ENVIRONMENT CONSOLE

   Renders the Secure Environment layer as a self-contained
   institutional-grade security operations terminal. Showcases:
   - 5-phase System Calibration (Identity, Risk, Rules, Psychology, Confirmation)
   - Live security status, encryption protocols, access audit
   - The same OnboardingShell flow rendered as an interactive demo

   Pattern matches CopilotStrategyConsole / CopilotActivityConsole.
   ═══════════════════════════════════════════════════════════════ */

/* ── Security Protocol Phases ── */

interface SecurityPhase {
  id: string
  label: string
  status: "active" | "verified" | "pending" | "scanning"
  color: string
  icon: typeof Shield
  protocol: string
  details: string[]
  metrics: { label: string; value: string; status: "ok" | "warning" | "critical" }[]
}

const SECURITY_PHASES: SecurityPhase[] = [
  {
    id: "identity",
    label: "Identity Verification",
    status: "verified",
    color: "#10b981",
    icon: Fingerprint,
    protocol: "IDENT-VERIFY-2FA",
    details: [
      "Multi-factor authentication enforced",
      "Biometric token validated",
      "Session fingerprint bound to device",
      "IP geolocation within approved zones",
    ],
    metrics: [
      { label: "Auth Strength", value: "256-bit", status: "ok" },
      { label: "Session Token", value: "Active", status: "ok" },
      { label: "2FA Status", value: "Enforced", status: "ok" },
    ],
  },
  {
    id: "encryption",
    label: "Encryption Layer",
    status: "verified",
    color: "#10b981",
    icon: Lock,
    protocol: "AES-256-GCM",
    details: [
      "All data encrypted at rest and in transit",
      "TLS 1.3 connection established",
      "Perfect forward secrecy enabled",
      "Key rotation: every 24h",
    ],
    metrics: [
      { label: "Cipher", value: "AES-256", status: "ok" },
      { label: "TLS Version", value: "1.3", status: "ok" },
      { label: "Key Age", value: "4h 12m", status: "ok" },
    ],
  },
  {
    id: "access-control",
    label: "Access Control",
    status: "active",
    color: "#06b6d4",
    icon: Eye,
    protocol: "RBAC-INSTITUTIONAL",
    details: [
      "Role-based access control active",
      "Operator permissions scoped to strategy + activity layers",
      "Admin escalation requires secondary approval",
      "Read-only fallback on timeout",
    ],
    metrics: [
      { label: "Role", value: "Operator", status: "ok" },
      { label: "Scope", value: "Full Access", status: "ok" },
      { label: "Timeout", value: "30m", status: "ok" },
    ],
  },
  {
    id: "data-isolation",
    label: "Data Isolation",
    status: "verified",
    color: "#10b981",
    icon: Shield,
    protocol: "ISO-SANDBOX-V2",
    details: [
      "Complete data isolation between operators",
      "Sandbox environment enforced",
      "No cross-tenant data leakage possible",
      "Audit trail on every data access",
    ],
    metrics: [
      { label: "Sandbox", value: "Enforced", status: "ok" },
      { label: "Isolation", value: "Complete", status: "ok" },
      { label: "Audit Trail", value: "Recording", status: "ok" },
    ],
  },
  {
    id: "threat-monitor",
    label: "Threat Monitor",
    status: "scanning",
    color: "#f59e0b",
    icon: ShieldAlert,
    protocol: "THREAT-SCAN-CONTINUOUS",
    details: [
      "Continuous threat scanning active",
      "Anomaly detection on login patterns",
      "Rate limiting on all API endpoints",
      "Automated lockout after 3 failed attempts",
    ],
    metrics: [
      { label: "Threats", value: "0 detected", status: "ok" },
      { label: "Scan Cycle", value: "60s", status: "ok" },
      { label: "Rate Limit", value: "Normal", status: "ok" },
    ],
  },
]

/* ── Audit Log Entries ── */

const AUDIT_LOG = [
  { time: "11:02:14", action: "Session authenticated", level: "info" as const, protocol: "AUTH-2FA" },
  { time: "11:02:14", action: "TLS 1.3 handshake complete", level: "info" as const, protocol: "TLS-VERIFY" },
  { time: "11:02:15", action: "Encryption keys rotated", level: "info" as const, protocol: "KEY-ROTATE" },
  { time: "11:02:15", action: "RBAC permissions loaded", level: "info" as const, protocol: "RBAC-LOAD" },
  { time: "11:02:16", action: "Sandbox environment initialized", level: "info" as const, protocol: "SANDBOX-INIT" },
  { time: "11:02:16", action: "Threat scan cycle started", level: "info" as const, protocol: "THREAT-SCAN" },
  { time: "11:02:18", action: "Data isolation verified", level: "info" as const, protocol: "ISO-VERIFY" },
  { time: "11:02:22", action: "Geolocation check passed", level: "info" as const, protocol: "GEO-CHECK" },
  { time: "11:02:30", action: "Anomaly detection baseline set", level: "info" as const, protocol: "ANOMALY-BASE" },
  { time: "11:03:01", action: "Continuous monitoring active", level: "info" as const, protocol: "MONITOR-START" },
]

/* ── Status Indicator ── */
function StatusDot({ status }: { status: "ok" | "warning" | "critical" | "active" | "verified" | "pending" | "scanning" }) {
  const colors = {
    ok: "#10b981",
    verified: "#10b981",
    active: "#06b6d4",
    warning: "#f59e0b",
    critical: "#ef4444",
    pending: "#6b7280",
    scanning: "#f59e0b",
  }
  const color = colors[status]
  const shouldPulse = status === "active" || status === "scanning"

  return (
    <div className="relative">
      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
      {shouldPulse && (
        <motion.div
          className="absolute inset-0 w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: color }}
          animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   MAIN CONSOLE COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export function CopilotSecureConsole() {
  const [expandedPhase, setExpandedPhase] = useState<string | null>("access-control")
  const [showAuditLog, setShowAuditLog] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const togglePhase = useCallback((id: string) => {
    setExpandedPhase(prev => prev === id ? null : id)
  }, [])

  const verifiedCount = SECURITY_PHASES.filter(p => p.status === "verified").length
  const totalCount = SECURITY_PHASES.length

  return (
    <div className="relative flex flex-col h-full bg-transparent">
      <div ref={scrollRef} className="flex-1 overflow-y-auto min-h-0 scrollbar-terminal">

        {/* ── Secure Environment Guide & Tutorial ── */}
        <SecureGuideAndTutorial />

        {/* ── Header Bar ── */}
        <div className="sticky top-0 z-20 px-3 pt-3 pb-2"
          style={{ background: "linear-gradient(180deg, rgba(12,14,22,0.98) 0%, rgba(12,14,22,0.92) 80%, transparent 100%)" }}>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <motion.div className="w-2.5 h-2.5 rounded-full bg-emerald-400"
                  animate={{ scale: [1, 1.4, 1], opacity: [1, 0.4, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
                <motion.div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-400"
                  animate={{ scale: [1, 2.5], opacity: [0.3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>
              <span className="text-[12px] font-mono font-black uppercase tracking-wider text-emerald-400">
                Secure Environment
              </span>
              <motion.span className="text-[11px] font-mono font-black uppercase tracking-widest px-2 py-0.5 rounded-md"
                style={{
                  backgroundColor: "rgba(16,185,129,0.08)",
                  color: "rgba(16,185,129,0.7)",
                  border: "1px solid rgba(16,185,129,0.15)",
                }}
                animate={{ borderColor: ["rgba(16,185,129,0.15)", "rgba(16,185,129,0.35)", "rgba(16,185,129,0.15)"] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {verifiedCount}/{totalCount} VERIFIED
              </motion.span>
            </div>

            <button
              onClick={() => setShowAuditLog(!showAuditLog)}
              className={`flex items-center gap-1 px-2 py-1 rounded-md border text-[7px] font-mono font-black uppercase tracking-wider transition-all shrink-0 ${
                showAuditLog
                  ? "border-emerald-400/25 bg-emerald-400/[0.06] text-emerald-400/70"
                  : "border-white/[0.04] bg-white/[0.01] text-white/20 hover:border-white/[0.08] hover:text-white/35"
              }`}
            >
              <Activity className="w-2.5 h-2.5" />
              {showAuditLog ? "PROTOCOLS" : "AUDIT LOG"}
            </button>
          </div>

          <p className="text-[9px] font-mono text-white/25 leading-relaxed mt-1.5 max-w-[500px]">
            Institutional-grade security protocols protecting all operator data, sessions, and trading activity. Every access is logged, every connection encrypted.
          </p>
        </div>

        {showAuditLog ? (
          /* ═══ AUDIT LOG VIEW ═══ */
          <div className="px-3 pb-4">
            <div className="mb-2 flex items-center gap-2">
              <Scan className="w-3 h-3 text-emerald-400/50" />
              <span className="text-[9px] font-mono font-bold text-white/30 uppercase tracking-wider">Session Audit Trail</span>
            </div>

            <div className="space-y-[1px]">
              {AUDIT_LOG.map((entry, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.2 }}
                  className="flex items-center gap-2 px-2 py-1.5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors"
                >
                  <span className="text-[8px] font-mono text-white/15 tabular-nums w-14 shrink-0">{entry.time}</span>
                  <StatusDot status="ok" />
                  <span className="text-[8px] font-mono text-white/40 flex-1">{entry.action}</span>
                  <span className="text-[7px] font-mono text-emerald-400/30 px-1.5 py-0.5 bg-emerald-400/[0.04] border border-emerald-400/[0.08] rounded shrink-0">
                    {entry.protocol}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Live scan indicator */}
            <div className="mt-3 flex items-center gap-2 px-2 py-2 bg-white/[0.01] border border-white/[0.03]">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Scan className="w-3 h-3 text-emerald-400/40" />
              </motion.div>
              <span className="text-[8px] font-mono text-white/25">Continuous monitoring active -- next scan in 47s</span>
            </div>
          </div>
        ) : (
          /* ═══ PROTOCOL VIEW ═══ */
          <div className="px-3 pb-4">
            {/* Security Phases */}
            <div className="space-y-[2px]">
              {SECURITY_PHASES.map((phase, i) => {
                const isExpanded = expandedPhase === phase.id
                const PhaseIcon = phase.icon

                return (
                  <div key={phase.id}>
                    <button
                      onClick={() => togglePhase(phase.id)}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2.5 bg-white/[0.01] hover:bg-white/[0.03] transition-all group"
                    >
                      <StatusDot status={phase.status} />

                      <div className="w-6 h-6 flex items-center justify-center border border-white/[0.06] shrink-0">
                        <PhaseIcon className="w-3 h-3" style={{ color: phase.color }} />
                      </div>

                      <div className="flex-1 text-left">
                        <span className="text-[10px] font-mono font-bold text-white/50 group-hover:text-white/70 transition-colors">
                          {phase.label}
                        </span>
                      </div>

                      <span className="text-[7px] font-mono px-1.5 py-0.5 rounded border shrink-0"
                        style={{
                          color: `${phase.color}70`,
                          backgroundColor: `${phase.color}06`,
                          borderColor: `${phase.color}15`,
                        }}>
                        {phase.protocol}
                      </span>

                      <div className="w-4 h-4 flex items-center justify-center text-white/15 group-hover:text-white/30 transition-colors">
                        <ChevronRight className={`w-3 h-3 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`} />
                      </div>
                    </button>

                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-3 py-2 ml-4 border-l border-white/[0.04]">
                          {/* Details */}
                          <div className="space-y-1 mb-3">
                            {phase.details.map((detail, di) => (
                              <div key={di} className="flex items-start gap-2">
                                <CheckCircle2 className="w-2.5 h-2.5 mt-0.5 shrink-0" style={{ color: `${phase.color}50` }} />
                                <span className="text-[8px] font-mono text-white/30 leading-relaxed">{detail}</span>
                              </div>
                            ))}
                          </div>

                          {/* Metrics */}
                          <div className="grid grid-cols-3 gap-2">
                            {phase.metrics.map((metric, mi) => (
                              <div key={mi} className="px-2 py-1.5 bg-white/[0.01] border border-white/[0.04]">
                                <div className="text-[7px] font-mono text-white/20 uppercase tracking-wider mb-0.5">{metric.label}</div>
                                <div className="flex items-center gap-1">
                                  <StatusDot status={metric.status} />
                                  <span className="text-[9px] font-mono font-bold" style={{ color: `${phase.color}80` }}>{metric.value}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Overall Security Score */}
            <div className="mt-4 px-3 py-3 bg-white/[0.01] border border-white/[0.04]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-mono font-bold text-white/30 uppercase tracking-wider">Security Score</span>
                <span className="text-[14px] font-mono font-black text-emerald-400">98/100</span>
              </div>
              <div className="h-1 bg-white/[0.04] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-emerald-400/60 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "98%" }}
                  transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
                />
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[7px] font-mono text-white/15">Last full audit: 4h ago</span>
                <span className="text-[7px] font-mono text-emerald-400/40">INSTITUTIONAL GRADE</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
