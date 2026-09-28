"use client"

import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  Zap,
  Eye,
  Heart,
  MessageSquare,
  Timer,
  CheckCircle2,
  XCircle,
  Clock,
  Share2,
  Hourglass,
  Users,
  Cpu,
  Globe,
  User,
  AlertTriangle,
  BookOpen,
  Copy,
  Bookmark,
  ChevronRight,
  ExternalLink,
  Star,
  Target,
  TrendingUp,
  Activity,
  Crosshair,
} from "lucide-react"
import { ACCENT } from "@/components/mtf/mtf-theme"
import type { ForecastItem, ForecastStatus } from "./forecast-types"
import { LIFECYCLE_DESCRIPTIONS } from "./forecast-types"

/* ═══ PREMIUM SURFACE TOKENS ═══ */
const S = {
  void: "#060810",
  base: "#0a0d15",
  raised: "#0e111b",
  overlay: "#131722",
  panelBg: "linear-gradient(180deg, #0b0e17 0%, #090c14 100%)",
  rightPanelBg: "linear-gradient(180deg, #0e1220 0%, #0b0f1a 100%)",
  border: "rgba(148,163,184,0.06)",
  borderLight: "rgba(148,163,184,0.09)",
  borderHover: "rgba(148,163,184,0.14)",
  textPrimary: "rgba(255,255,255,0.92)",
  textSecondary: "rgba(148,163,184,0.5)",
  textTertiary: "rgba(148,163,184,0.28)",
  textGhost: "rgba(148,163,184,0.14)",
  sectionBg: "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.008) 100%)",
  sectionBorder: "rgba(148,163,184,0.05)",
  /* ── Board system (right rail only) ── */
  boardBg: "linear-gradient(180deg, rgba(14,18,32,0.95) 0%, rgba(11,15,26,0.92) 100%)",
  boardBorder: "rgba(148,163,184,0.07)",
  boardBorderHover: "rgba(148,163,184,0.16)",
  boardGlow: (rgb: string) => `0 0 24px rgba(${rgb},0.04), 0 1px 3px rgba(0,0,0,0.3)`,
  boardGlowHover: (rgb: string) => `0 0 32px rgba(${rgb},0.08), 0 4px 16px rgba(0,0,0,0.25), 0 1px 3px rgba(0,0,0,0.3)`,
  boardHeaderColor: "rgba(148,163,184,0.45)",
  boardHeaderActive: "rgba(148,163,184,0.7)",
}

interface ForecastDetailDrawerProps {
  forecast: ForecastItem | null
  onClose: () => void
}

export function ForecastDetailDrawer({ forecast, onClose }: ForecastDetailDrawerProps) {
  if (!forecast) return null

  const dirColor = forecast.direction === "LONG" ? ACCENT.emerald : ACCENT.rose
  const statusCfg = getStatusConfig(forecast.status)
  const expiresIn = forecast.expiresAt ? getTimeUntil(forecast.expiresAt) : null

  const projectedMove = useMemo(() => {
    const entry = parseFloat(forecast.entry.replace(/,/g, ""))
    const target = parseFloat(forecast.takeProfit.replace(/,/g, ""))
    if (isNaN(entry) || isNaN(target) || entry === 0) return null
    const pct = ((target - entry) / entry) * 100
    return forecast.direction === "SHORT" ? `${(pct * -1).toFixed(2)}%` : `+${pct.toFixed(2)}%`
  }, [forecast.entry, forecast.takeProfit, forecast.direction])

  const riskRewardDistances = useMemo(() => {
    const entry = parseFloat(forecast.entry.replace(/,/g, ""))
    const sl = parseFloat(forecast.stopLoss.replace(/,/g, ""))
    const tp = parseFloat(forecast.takeProfit.replace(/,/g, ""))
    if (isNaN(entry) || isNaN(sl) || isNaN(tp)) return null
    const riskDist = Math.abs(entry - sl)
    const rewardDist = Math.abs(tp - entry)
    return { risk: riskDist.toFixed(entry > 100 ? 0 : 4), reward: rewardDist.toFixed(entry > 100 ? 0 : 4) }
  }, [forecast.entry, forecast.stopLoss, forecast.takeProfit])

  return (
    <AnimatePresence>
      {forecast && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60]"
            style={{ background: "rgba(4,6,12,0.85)", backdropFilter: "blur(4px)" }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 z-[61] flex flex-col"
            style={{
              width: "min(96vw, 1120px)",
              background: S.base,
              borderLeft: `1px solid ${S.border}`,
              boxShadow: `-32px 0 80px rgba(0,0,0,0.6), -8px 0 24px rgba(0,0,0,0.4), inset 1px 0 0 rgba(255,255,255,0.02)`,
            }}
          >
            {/* ═══ HEADER ═══ */}
            <div className="flex items-center justify-between px-5 h-12 flex-shrink-0" style={{
              background: `linear-gradient(180deg, ${S.raised} 0%, ${S.base} 100%)`,
              borderBottom: `1px solid ${S.border}`,
              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.02), 0 1px 3px rgba(0,0,0,0.2)`,
            }}>
              <div className="flex items-center gap-3">
                <span className="text-[19px] font-black font-mono tracking-[-0.04em]" style={{ color: S.textPrimary }}>{forecast.instrument}</span>
                <span className="text-[11px] font-mono font-medium" style={{ color: S.textTertiary }}>{forecast.timeframe}</span>
                <div className="flex items-center gap-0.5 px-2 py-0.5" style={{
                  background: `linear-gradient(135deg, rgba(${dirColor.rgb},0.12) 0%, rgba(${dirColor.rgb},0.04) 100%)`,
                  border: `1px solid rgba(${dirColor.rgb},0.1)`,
                  borderRadius: "5px",
                }}>
                  {forecast.direction === "LONG" ? <ArrowUpRight size={11} style={{ color: dirColor.hex }} /> : <ArrowDownRight size={11} style={{ color: dirColor.hex }} />}
                  <span className="text-[9px] font-black" style={{ color: dirColor.hex }}>{forecast.direction}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-[5px] h-[5px] rounded-full" style={{
                    background: `rgba(${statusCfg.color},0.6)`,
                    boxShadow: `0 0 6px rgba(${statusCfg.color},0.25)`,
                  }} />
                  <span className="text-[9px] font-semibold uppercase tracking-wide" style={{ color: `rgba(${statusCfg.color},0.7)` }}>{statusCfg.label}</span>
                </div>
                {expiresIn && (forecast.status === "active" || forecast.status === "near_expiry") && (
                  <span className="text-[9px] font-mono" style={{
                    color: forecast.status === "near_expiry" ? ACCENT.amber.hex : S.textTertiary,
                  }}>{expiresIn}</span>
                )}
              </div>
              <div className="flex items-center gap-0.5">
                <ToolbarBtn icon={Copy} label="Copy Levels" />
                <ToolbarBtn icon={Bookmark} label="Save" />
                <ToolbarBtn icon={Share2} label="Share" />
                <ToolbarBtn icon={ExternalLink} label="Full Chart" />
                <button onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-white/5 cursor-pointer transition-all duration-150 ml-2"
                  style={{ border: `1px solid transparent` }}>
                  <X size={14} style={{ color: S.textSecondary }} />
                </button>
              </div>
            </div>

            {/* ═══ SPLIT VIEW ═══ */}
            <div className="flex flex-1 overflow-hidden">

              {/* ── LEFT: Chart + Metrics + Comments ── */}
              <div className="flex-[62] flex flex-col overflow-y-auto" style={{
                borderRight: `1px solid ${S.border}`,
                background: S.panelBg,
              }}>

                {/* A. Large chart */}
                <div className="flex-shrink-0 relative" style={{
                  height: "340px",
                  background: `linear-gradient(180deg, #070a13 0%, #090c15 100%)`,
                  borderBottom: `1px solid ${S.border}`,
                }}>
                  <WorkspaceChart forecast={forecast} dirColor={dirColor} />
                  {/* Overlay labels */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    {[
                      { label: "Entry", value: forecast.entry, color: "rgba(255,255,255,0.6)", rgb: "255,255,255" },
                      { label: "SL", value: forecast.stopLoss, color: ACCENT.rose.hex, rgb: ACCENT.rose.rgb },
                      { label: "TP", value: forecast.takeProfit, color: ACCENT.emerald.hex, rgb: ACCENT.emerald.rgb },
                    ].map((l) => (
                      <div key={l.label} className="flex items-center gap-1.5 px-2 py-1" style={{
                        background: "rgba(6,8,16,0.88)",
                        border: `1px solid rgba(${l.rgb},0.08)`,
                        borderRadius: "5px",
                        backdropFilter: "blur(12px)",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                      }}>
                        <span className="text-[7px] font-mono font-bold uppercase tracking-wider" style={{ color: `${l.color}55` }}>{l.label}</span>
                        <span className="text-[10px] font-mono font-bold" style={{ color: l.color, fontVariantNumeric: "tabular-nums" }}>{l.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* B. Metrics rail */}
                <div className="flex-shrink-0" style={{ borderBottom: `1px solid ${S.border}` }}>
                  <div className="flex items-stretch">
                    {[
                      { label: "Entry", value: forecast.entry, color: "rgba(255,255,255,0.85)" },
                      { label: "Stop Loss", value: forecast.stopLoss, color: `rgba(${ACCENT.rose.rgb},0.85)` },
                      { label: "Take Profit", value: forecast.takeProfit, color: `rgba(${ACCENT.emerald.rgb},0.85)` },
                      { label: "R : R", value: forecast.riskReward, color: ACCENT.amber.hex },
                      ...(projectedMove ? [{ label: "Projected Move", value: projectedMove, color: dirColor.hex }] : []),
                    ].map((l, i, arr) => (
                      <div key={l.label} className="flex-1 py-3.5 px-3 text-center" style={{
                        borderRight: i < arr.length - 1 ? `1px solid ${S.border}` : "none",
                        background: S.sectionBg,
                      }}>
                        <div className="text-[17px] font-black font-mono leading-none mb-1" style={{
                          color: l.color,
                          fontVariantNumeric: "tabular-nums",
                          letterSpacing: "-0.03em",
                          textShadow: l.color.includes(ACCENT.amber.hex) ? `0 0 16px rgba(${ACCENT.amber.rgb},0.15)` : "none",
                        }}>{l.value}</div>
                        <div className="text-[7.5px] font-mono uppercase tracking-[0.12em] font-bold" style={{
                          color: S.textGhost,
                        }}>{l.label}</div>
                      </div>
                    ))}
                  </div>
                  {riskRewardDistances && (
                    <div className="flex items-center gap-6 px-4 py-2" style={{
                      borderTop: `1px solid ${S.border}`,
                      background: "rgba(255,255,255,0.008)",
                    }}>
                      <span className="text-[9px] font-mono" style={{ color: S.textTertiary }}>
                        Risk Distance: <span className="font-bold" style={{ color: `rgba(${ACCENT.rose.rgb},0.55)` }}>{riskRewardDistances.risk}</span>
                      </span>
                      <span className="text-[9px] font-mono" style={{ color: S.textTertiary }}>
                        Reward Distance: <span className="font-bold" style={{ color: `rgba(${ACCENT.emerald.rgb},0.55)` }}>{riskRewardDistances.reward}</span>
                      </span>
                    </div>
                  )}
                </div>

                {/* C. Comments section */}
                <div className="flex-1 min-h-[200px]" style={{ background: `linear-gradient(180deg, #0b0e17 0%, #090c14 100%)` }}>
                  <div className="px-5 py-4">
                    {/* Comment header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2.5">
                        <MessageSquare size={13} style={{ color: S.textTertiary }} />
                        <span className="text-[12px] font-bold" style={{ color: "rgba(255,255,255,0.65)" }}>{forecast.comments} Comments</span>
                      </div>
                      <div className="flex items-center gap-4">
                        {[
                          { icon: Heart, value: forecast.likes },
                          { icon: Eye, value: forecast.views },
                        ].map(({ icon: Icon, value }, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                            <Icon size={11} style={{ color: S.textGhost }} />
                            <span className="text-[10px] font-mono font-semibold" style={{ color: S.textTertiary, fontVariantNumeric: "tabular-nums" }}>{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Mentor review as highlighted comment */}
                    {forecast.mentorReview && (
                      <div className="mb-4 px-4 py-3 rounded-lg" style={{
                        background: `linear-gradient(135deg, rgba(${ACCENT.amber.rgb},0.04) 0%, rgba(${ACCENT.amber.rgb},0.015) 100%)`,
                        border: `1px solid rgba(${ACCENT.amber.rgb},0.08)`,
                        boxShadow: `0 0 20px rgba(${ACCENT.amber.rgb},0.03), inset 0 1px 0 rgba(${ACCENT.amber.rgb},0.04)`,
                      }}>
                        <div className="flex items-center gap-2.5 mb-2">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{
                            background: `linear-gradient(135deg, rgba(${ACCENT.amber.rgb},0.12) 0%, rgba(${ACCENT.amber.rgb},0.04) 100%)`,
                            border: `1.5px solid rgba(${ACCENT.amber.rgb},0.2)`,
                            boxShadow: `0 0 8px rgba(${ACCENT.amber.rgb},0.06)`,
                          }}>
                            <span className="text-[9px] font-bold" style={{ color: ACCENT.amber.hex }}>{forecast.mentorReview.mentorName.charAt(0)}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-semibold" style={{ color: "rgba(255,255,255,0.7)" }}>{forecast.mentorReview.mentorName}</span>
                              <span className="text-[7px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded" style={{
                                background: `linear-gradient(135deg, rgba(${ACCENT.amber.rgb},0.1) 0%, rgba(${ACCENT.amber.rgb},0.04) 100%)`,
                                border: `1px solid rgba(${ACCENT.amber.rgb},0.1)`,
                                color: `rgba(${ACCENT.amber.rgb},0.7)`,
                              }}>Mentor Review</span>
                            </div>
                          </div>
                          <span className="text-[12px] font-mono font-bold" style={{ color: `rgba(${ACCENT.amber.rgb},0.65)` }}>{forecast.mentorReview.rating}/10</span>
                        </div>
                        <p className="text-[10.5px] leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{forecast.mentorReview.feedback}</p>
                        <span className="text-[8px] font-mono mt-2 block" style={{ color: S.textGhost }}>
                          {new Date(forecast.mentorReview.reviewedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    )}

                    {/* Sample community comments */}
                    <div className="space-y-2">
                      {[
                        { name: "TraderJake", initial: "T", text: "Clean setup. I'm watching the same level on the 1H.", time: "12m ago" },
                        { name: "CryptoNova", initial: "C", text: "Good R:R. What's your position size on this?", time: "28m ago" },
                        ...(forecast.comments > 2 ? [{ name: "MarketWiz", initial: "M", text: "Entry could be tighter but the thesis is solid.", time: "1h ago" }] : []),
                      ].slice(0, Math.max(forecast.comments, 1)).map((c, i) => (
                        <div key={i} className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg" style={{
                          background: S.sectionBg,
                          border: `1px solid ${S.sectionBorder}`,
                        }}>
                          <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{
                            background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
                            border: `1px solid ${S.border}`,
                          }}>
                            <span className="text-[8px] font-bold" style={{ color: S.textSecondary }}>{c.initial}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-[10.5px] font-semibold" style={{ color: "rgba(255,255,255,0.6)" }}>{c.name}</span>
                              <span className="text-[8px] font-mono" style={{ color: S.textGhost }}>{c.time}</span>
                            </div>
                            <p className="text-[10.5px] leading-relaxed" style={{ color: "rgba(255,255,255,0.42)" }}>{c.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Comment input */}
                    <div className="flex items-center gap-2.5 mt-4 px-3 py-2.5 rounded-lg" style={{
                      background: S.sectionBg,
                      border: `1px solid ${S.border}`,
                      boxShadow: "inset 0 1px 3px rgba(0,0,0,0.15)",
                    }}>
                      <input type="text" placeholder="Add a comment..." className="flex-1 bg-transparent text-[11px] text-white/65 placeholder:text-white/12 outline-none" />
                      <button className="text-[10px] font-semibold px-3 py-1.5 rounded-md cursor-pointer transition-all duration-150 hover:brightness-110" style={{
                        background: `linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)`,
                        border: `1px solid ${S.borderLight}`,
                        color: "rgba(255,255,255,0.4)",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
                      }}>Post</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── RIGHT: Intelligence Board Stack ── */}
              <div className="flex-[38] overflow-y-auto" style={{ background: S.rightPanelBg }}>
                <div className="p-4 space-y-3">

                  {/* ══ 1. ANALYST PROFILE BOARD ══ */}
                  <HoverBoard accent={ACCENT.purple.rgb} icon={User} title="Analyst">
                    <div className="flex items-center gap-3.5">
                      <div className="relative flex-shrink-0">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{
                          background: `linear-gradient(135deg, rgba(${dirColor.rgb},0.15) 0%, rgba(${dirColor.rgb},0.05) 100%)`,
                          border: forecast.user.isMentor ? `1.5px solid rgba(${ACCENT.amber.rgb},0.35)` : `1px solid rgba(${dirColor.rgb},0.12)`,
                          boxShadow: forecast.user.isMentor
                            ? `0 0 16px rgba(${ACCENT.amber.rgb},0.08), inset 0 1px 0 rgba(255,255,255,0.04)`
                            : `inset 0 1px 0 rgba(255,255,255,0.03)`,
                        }}>
                          <span className="text-[14px] font-black" style={{ color: `rgba(${dirColor.rgb},0.7)` }}>{forecast.user.name.charAt(0)}</span>
                        </div>
                        {forecast.user.isVerified && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center" style={{
                            background: `rgba(${ACCENT.emerald.rgb},0.15)`,
                            border: `1.5px solid rgba(${ACCENT.emerald.rgb},0.3)`,
                            boxShadow: `0 0 8px rgba(${ACCENT.emerald.rgb},0.12)`,
                          }}>
                            <CheckCircle2 size={8} style={{ color: ACCENT.emerald.hex }} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[13px] font-bold tracking-tight" style={{ color: S.textPrimary }}>{forecast.user.name}</span>
                          {forecast.user.isMentor && (
                            <span className="text-[7px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md" style={{
                              background: `linear-gradient(135deg, rgba(${ACCENT.amber.rgb},0.14) 0%, rgba(${ACCENT.amber.rgb},0.05) 100%)`,
                              border: `1px solid rgba(${ACCENT.amber.rgb},0.15)`,
                              color: ACCENT.amber.hex,
                              boxShadow: `0 0 8px rgba(${ACCENT.amber.rgb},0.06)`,
                            }}>Mentor</span>
                          )}
                          {forecast.user.role && !forecast.user.isMentor && (
                            <span className="text-[7px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md" style={{
                              background: "rgba(255,255,255,0.03)",
                              border: `1px solid ${S.border}`,
                              color: S.textTertiary,
                            }}>{forecast.user.role}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          {forecast.user.resolvedCount != null && forecast.user.resolvedCount > 0 && (
                            <StatPill label={`${forecast.user.resolvedCount} calls`} color={ACCENT.blue.rgb} />
                          )}
                          {forecast.user.overallAccuracy != null && forecast.user.overallAccuracy > 0 && (
                            <StatPill label={`${forecast.user.overallAccuracy}% acc`} color={ACCENT.emerald.rgb} bright />
                          )}
                          {forecast.communityContext && (
                            <StatPill label={forecast.communityContext.name} color={ACCENT.cyan.rgb} />
                          )}
                        </div>
                        <p className="text-[9px] leading-relaxed mt-1.5" style={{ color: S.textTertiary }}>
                          {forecast.user.isMentor
                            ? `Lead analyst specializing in ${forecast.instrumentType} ${forecast.timeframe} setups.`
                            : `${forecast.instrumentType} trader focusing on ${forecast.timeframe} timeframe analysis.`}
                        </p>
                      </div>
                    </div>
                  </HoverBoard>

                  {/* ══ 2. SCENARIO BOARD ══ */}
                  <HoverBoard accent={statusCfg.color} icon={Target} title="Scenario">
                    <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-md" style={{
                        background: `linear-gradient(135deg, rgba(${dirColor.rgb},0.15) 0%, rgba(${dirColor.rgb},0.05) 100%)`,
                        border: `1px solid rgba(${dirColor.rgb},0.15)`,
                        boxShadow: `0 0 10px rgba(${dirColor.rgb},0.06)`,
                      }}>
                        {forecast.direction === "LONG" ? <ArrowUpRight size={11} style={{ color: dirColor.hex }} /> : <ArrowDownRight size={11} style={{ color: dirColor.hex }} />}
                        <span className="text-[10px] font-black" style={{ color: dirColor.hex }}>{forecast.direction}</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold" style={{ color: "rgba(255,255,255,0.55)" }}>{forecast.timeframe}</span>
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md" style={{
                        background: `rgba(${statusCfg.color},0.06)`,
                        border: `1px solid rgba(${statusCfg.color},0.1)`,
                      }}>
                        <div className="w-[6px] h-[6px] rounded-full" style={{
                          background: `rgba(${statusCfg.color},0.7)`,
                          boxShadow: `0 0 8px rgba(${statusCfg.color},0.3)`,
                        }} />
                        <span className="text-[9px] font-bold uppercase tracking-wide" style={{ color: `rgba(${statusCfg.color},0.75)` }}>{statusCfg.label}</span>
                      </div>
                      <div className="ml-auto">
                        <span className="text-[12px] font-mono font-black" style={{
                          color: `rgba(${getConfidenceColor(forecast.confidence)},0.85)`,
                          textShadow: `0 0 12px rgba(${getConfidenceColor(forecast.confidence)},0.15)`,
                        }}>
                          {forecast.confidence}%
                        </span>
                        <span className="text-[8px] font-mono ml-1" style={{ color: S.textTertiary }}>conviction</span>
                      </div>
                    </div>
                    <p className="text-[11px] leading-[1.7] mb-3" style={{ color: "rgba(255,255,255,0.65)" }}>{forecast.commentary}</p>
                    {/* Status context inline */}
                    <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg" style={{
                      background: `linear-gradient(135deg, rgba(${statusCfg.color},0.05) 0%, rgba(${statusCfg.color},0.015) 100%)`,
                      border: `1px solid rgba(${statusCfg.color},0.08)`,
                      boxShadow: `inset 0 1px 0 rgba(${statusCfg.color},0.04), 0 0 12px rgba(${statusCfg.color},0.03)`,
                    }}>
                      <statusCfg.icon size={12} style={{ color: `rgba(${statusCfg.color},0.6)`, marginTop: 1, flexShrink: 0 }} />
                      <p className="text-[9.5px] leading-relaxed" style={{ color: `rgba(${statusCfg.color},0.7)` }}>
                        {LIFECYCLE_DESCRIPTIONS[forecast.status]}
                        {expiresIn && (forecast.status === "active" || forecast.status === "near_expiry") && ` Expires in ${expiresIn}.`}
                      </p>
                    </div>
                  </HoverBoard>

                  {/* ══ 3. THESIS BOARD ══ */}
                  <HoverBoard accent={dirColor.rgb} icon={BookOpen} title="Forecast Thesis">
                    <p className="text-[11px] leading-[1.75]" style={{ color: "rgba(255,255,255,0.62)" }}>
                      {forecast.commentary.split(/(\s+)/).map((word, i) => {
                        const highlight = ["order block", "resistance", "support", "displacement", "weakness", "retest", "break", "divergence", "sweep", "liquidity", "FVG", "session", "structure", "bullish", "bearish", "continuation", "reversal", "confluence"]
                        const isHighlighted = highlight.some(h => word.toLowerCase().includes(h))
                        return isHighlighted
                          ? <span key={i} style={{ color: "rgba(255,255,255,0.88)", fontWeight: 600 }}>{word}</span>
                          : <span key={i}>{word}</span>
                      })}
                    </p>
                  </HoverBoard>

                  {/* ══ 4. ENTRY BREAKDOWN BOARD ══ */}
                  <HoverBoard accent={ACCENT.amber.rgb} icon={Crosshair} title="Entry Breakdown">
                    <div className="space-y-3">
                      {[
                        { sub: "Why this entry level", text: `Price approaching ${forecast.entry} where structural significance has been identified. This level aligns with the ${forecast.timeframe} thesis and offers a precise risk-defined entry.`, color: ACCENT.amber.rgb },
                        { sub: "What confirms the setup", text: forecast.confluences.length > 0
                          ? `Confirmed by ${forecast.confluences.map(c => c.name).join(", ")}. ${forecast.confluences.length >= 2 ? "Multiple confluences strengthen conviction." : ""}`
                          : "Price action confirmation at the entry level.", color: ACCENT.emerald.rgb },
                        ...(forecast.invalidation ? [{
                          sub: "What invalidates it",
                          text: forecast.invalidation,
                          color: ACCENT.rose.rgb,
                        }] : []),
                      ].map((item, i) => (
                        <div key={i} className="relative pl-3.5 py-1.5 rounded-r-lg transition-all duration-200 hover:bg-white/[0.015]" style={{
                          borderLeft: `2px solid rgba(${item.color},0.25)`,
                        }}>
                          <span className="text-[8px] font-mono uppercase tracking-[0.12em] font-bold flex items-center gap-1.5 mb-1" style={{ color: `rgba(${item.color},0.55)` }}>
                            <div className="w-1 h-1 rounded-full" style={{ background: `rgba(${item.color},0.5)`, boxShadow: `0 0 4px rgba(${item.color},0.3)` }} />
                            {item.sub}
                          </span>
                          <p className="text-[10.5px] leading-[1.65]" style={{ color: "rgba(255,255,255,0.55)" }}>{item.text}</p>
                        </div>
                      ))}
                    </div>
                  </HoverBoard>

                  {/* ══ 5. CONFLUENCES BOARD ══ */}
                  {forecast.confluences.length > 0 && (
                    <HoverBoard accent={ACCENT.cyan.rgb} icon={Zap} title="Confluences">
                      <div className="space-y-1.5">
                        {forecast.confluences.map((c) => {
                          const catColor = c.category === "structure" ? ACCENT.emerald.rgb
                            : c.category === "momentum" ? ACCENT.blue.rgb
                            : c.category === "liquidity" ? ACCENT.purple.rgb
                            : c.category === "session" ? ACCENT.cyan.rgb
                            : ACCENT.slate.rgb
                          return (
                            <ConfluenceRow key={c.id} name={c.name} category={c.category} strength={c.strength} color={catColor} />
                          )
                        })}
                      </div>
                    </HoverBoard>
                  )}

                  {/* ══ 6. RISK ASSESSMENT BOARD ══ */}
                  <HoverBoard accent={ACCENT.amber.rgb} icon={Shield} title="Risk Assessment">
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {[
                        { label: "R:R", value: forecast.riskReward, color: ACCENT.amber.hex, rgb: ACCENT.amber.rgb },
                        { label: "Confidence", value: `${forecast.confidence}%`, color: `rgba(${getConfidenceColor(forecast.confidence)},0.85)`, rgb: getConfidenceColor(forecast.confidence) },
                        ...(riskRewardDistances ? [
                          { label: "Risk Dist.", value: riskRewardDistances.risk, color: `rgba(${ACCENT.rose.rgb},0.75)`, rgb: ACCENT.rose.rgb },
                          { label: "Reward Dist.", value: riskRewardDistances.reward, color: `rgba(${ACCENT.emerald.rgb},0.75)`, rgb: ACCENT.emerald.rgb },
                        ] : []),
                        ...(projectedMove ? [{ label: "Proj. Move", value: projectedMove, color: dirColor.hex, rgb: dirColor.rgb }] : []),
                      ].map((item, i) => (
                        <div key={i} className="px-3 py-2.5 rounded-lg transition-all duration-200 hover:border-opacity-20" style={{
                          background: `linear-gradient(180deg, rgba(${item.rgb},0.04) 0%, rgba(${item.rgb},0.015) 100%)`,
                          border: `1px solid rgba(${item.rgb},0.08)`,
                          boxShadow: `inset 0 1px 0 rgba(${item.rgb},0.04)`,
                        }}>
                          <span className="text-[7px] font-mono uppercase tracking-[0.12em] font-bold block mb-1" style={{ color: `rgba(${item.rgb},0.4)` }}>{item.label}</span>
                          <span className="text-[15px] font-black font-mono block" style={{
                            color: item.color,
                            fontVariantNumeric: "tabular-nums",
                            letterSpacing: "-0.03em",
                            textShadow: `0 0 16px rgba(${item.rgb},0.12)`,
                          }}>{item.value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pl-3 py-1" style={{ borderLeft: `2px solid ${S.borderLight}` }}>
                      <p className="text-[9.5px] leading-relaxed" style={{ color: "rgba(255,255,255,0.42)" }}>
                        {parseFloat(forecast.riskReward.split(":")[1] || "0") >= 2
                          ? "R:R exceeds 1:2 minimum threshold. Acceptable risk profile."
                          : "R:R below 1:2. Consider tighter entry or wider target."}
                        {forecast.confidence >= 70 ? " High conviction -- standard position size." : forecast.confidence >= 50 ? " Moderate conviction -- consider reduced size." : " Low conviction -- minimum size or skip."}
                      </p>
                    </div>
                  </HoverBoard>

                  {/* ══ 7. AI ANALYSIS BOARD ══ */}
                  <HoverBoard accent={ACCENT.purple.rgb} icon={Cpu} title="AI Analysis">
                    <AIBreakdownPanel forecast={forecast} dirColor={dirColor} />
                  </HoverBoard>

                  {/* ══ 8. TIMELINE BOARD ══ */}
                  <HoverBoard accent={ACCENT.blue.rgb} icon={Clock} title="Timeline">
                    <div className="relative pl-5">
                      <div className="absolute left-[7px] top-1.5 bottom-1.5 w-px" style={{
                        background: `linear-gradient(180deg, rgba(${ACCENT.blue.rgb},0.15), rgba(${ACCENT.blue.rgb},0.04))`,
                      }} />
                      {[
                        { event: "Submitted", time: forecast.createdAt, color: ACCENT.purple.rgb, done: true },
                        { event: "Active", time: forecast.createdAt, color: ACCENT.blue.rgb, done: true },
                        ...(forecast.expiresAt ? [{ event: "Expires", time: forecast.expiresAt, color: ACCENT.amber.rgb, done: false }] : []),
                        ...(forecast.resolvedAt ? [{
                          event: forecast.status === "resolved_win" ? "Won" : "Lost",
                          time: forecast.resolvedAt,
                          color: forecast.status === "resolved_win" ? ACCENT.emerald.rgb : ACCENT.rose.rgb,
                          done: true,
                        }] : []),
                      ].map((step, i) => (
                        <div key={i} className="relative flex items-center gap-3 pb-3.5 last:pb-0">
                          <div className="relative z-[1] w-[14px] h-[14px] rounded-full flex-shrink-0 flex items-center justify-center" style={{
                            background: step.done ? `linear-gradient(135deg, rgba(${step.color},0.18), rgba(${step.color},0.06))` : "rgba(255,255,255,0.02)",
                            border: `1.5px solid rgba(${step.color},${step.done ? 0.4 : 0.1})`,
                            boxShadow: step.done ? `0 0 10px rgba(${step.color},0.12)` : "none",
                          }}>
                            {step.done && <div className="w-[5px] h-[5px] rounded-full" style={{
                              background: `rgba(${step.color},0.7)`,
                              boxShadow: `0 0 6px rgba(${step.color},0.3)`,
                            }} />}
                          </div>
                          <span className="text-[10.5px] font-semibold" style={{ color: step.done ? `rgba(${step.color},0.8)` : S.textTertiary }}>{step.event}</span>
                          <span className="text-[8.5px] font-mono ml-auto" style={{ color: `rgba(148,163,184,${step.done ? 0.3 : 0.15})` }}>
                            {new Date(step.time).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </HoverBoard>

                  {/* ══ 9. ACTIONS DOCK ══ */}
                  <div className="rounded-xl overflow-hidden" style={{
                    background: `linear-gradient(180deg, rgba(10,14,24,0.98) 0%, rgba(8,11,20,0.95) 100%)`,
                    border: `1px solid rgba(148,163,184,0.06)`,
                    boxShadow: "0 2px 12px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.02)",
                  }}>
                    <div className="px-3.5 py-2 flex items-center gap-2" style={{ borderBottom: `1px solid ${S.border}` }}>
                      <Activity size={9} style={{ color: S.textTertiary }} />
                      <span className="text-[8px] font-mono uppercase tracking-[0.15em] font-bold" style={{ color: S.textTertiary }}>Actions</span>
                    </div>
                    <div className="p-1.5 grid grid-cols-2 gap-1">
                      {[
                        { icon: Cpu, label: "Open in Copilot", desc: "Run as scenario", color: ACCENT.purple.rgb },
                        { icon: Globe, label: "MRKT Intelligence", desc: "Live market context", color: ACCENT.blue.rgb },
                        { icon: User, label: "View Profile", desc: `${forecast.user.name}`, color: ACCENT.emerald.rgb },
                        ...(forecast.communityContext ? [{ icon: Users, label: forecast.communityContext.name, desc: "Community", color: ACCENT.cyan.rgb }] : []),
                        ...(forecast.user.role === "student" && !forecast.mentorReview ? [{ icon: BookOpen, label: "Request Review", desc: "Mentor feedback", color: ACCENT.amber.rgb }] : []),
                      ].map((action, i) => (
                        <button key={i}
                          className="flex items-center gap-2.5 px-3 py-2.5 cursor-pointer rounded-lg group transition-all duration-200"
                          style={{ background: "transparent", border: `1px solid transparent` }}
                          onMouseEnter={(e) => {
                            const el = e.currentTarget as HTMLElement
                            el.style.background = `linear-gradient(135deg, rgba(${action.color},0.06) 0%, rgba(${action.color},0.02) 100%)`
                            el.style.borderColor = `rgba(${action.color},0.1)`
                            el.style.boxShadow = `0 0 12px rgba(${action.color},0.04)`
                          }}
                          onMouseLeave={(e) => {
                            const el = e.currentTarget as HTMLElement
                            el.style.background = "transparent"
                            el.style.borderColor = "transparent"
                            el.style.boxShadow = "none"
                          }}
                        >
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200" style={{
                            background: `linear-gradient(135deg, rgba(${action.color},0.1) 0%, rgba(${action.color},0.03) 100%)`,
                            border: `1px solid rgba(${action.color},0.08)`,
                            boxShadow: `inset 0 1px 0 rgba(${action.color},0.04)`,
                          }}>
                            <action.icon size={12} style={{ color: `rgba(${action.color},0.65)` }} />
                          </div>
                          <div className="text-left flex-1 min-w-0">
                            <span className="text-[10px] font-semibold block leading-tight" style={{ color: "rgba(255,255,255,0.6)" }}>{action.label}</span>
                            <span className="text-[8px] block" style={{ color: S.textGhost }}>{action.desc}</span>
                          </div>
                          <ChevronRight size={10} className="opacity-0 group-hover:opacity-70 transition-all duration-200 flex-shrink-0" style={{ color: `rgba(${action.color},0.6)` }} />
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ══════════════════════════════════════════════════════════════════════ */

function ToolbarBtn({ icon: Icon, label }: { icon: typeof Copy; label: string }) {
  return (
    <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg cursor-pointer transition-all duration-150"
      title={label}
      style={{ border: `1px solid transparent` }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.background = "rgba(255,255,255,0.04)"
        el.style.borderColor = S.border
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.background = "transparent"
        el.style.borderColor = "transparent"
      }}
    >
      <Icon size={12} style={{ color: S.textSecondary }} />
      <span className="text-[9px] font-medium hidden xl:block" style={{ color: S.textSecondary }}>{label}</span>
    </button>
  )
}

/* ── HoverBoard: Premium intelligence board with hover response ── */
function HoverBoard({ accent, icon: Icon, title, children }: { accent: string; icon: typeof Copy; title: string; children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      animate={{
        y: hovered ? -1.5 : 0,
        boxShadow: hovered ? S.boardGlowHover(accent) : S.boardGlow(accent),
        borderColor: hovered ? S.boardBorderHover : S.boardBorder,
      }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-xl overflow-hidden"
      style={{
        background: S.boardBg,
        border: `1px solid ${S.boardBorder}`,
        boxShadow: S.boardGlow(accent),
      }}
    >
      {/* Top edge highlight */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px"
        animate={{ opacity: hovered ? 0.12 : 0.04 }}
        transition={{ duration: 0.25 }}
        style={{ background: `linear-gradient(90deg, transparent, rgba(${accent},0.5), transparent)` }}
      />
      {/* Subtle scanning sweep on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: `linear-gradient(180deg, rgba(${accent},0.02) 0%, transparent 30%, transparent 70%, rgba(${accent},0.01) 100%)`,
        }}
      />
      {/* Header */}
      <div className="relative px-3.5 pt-3 pb-1.5 flex items-center gap-2">
        <motion.div
          animate={{ opacity: hovered ? 0.7 : 0.35, scale: hovered ? 1.05 : 1 }}
          transition={{ duration: 0.2 }}
          className="w-5 h-5 rounded-md flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, rgba(${accent},0.12) 0%, rgba(${accent},0.04) 100%)`,
            border: `1px solid rgba(${accent},0.1)`,
          }}
        >
          <Icon size={10} style={{ color: `rgba(${accent},0.7)` }} />
        </motion.div>
        <motion.span
          animate={{ color: hovered ? S.boardHeaderActive : S.boardHeaderColor }}
          transition={{ duration: 0.2 }}
          className="text-[8px] font-mono uppercase tracking-[0.15em] font-bold"
        >{title}</motion.span>
        <motion.div
          className="flex-1 h-px"
          animate={{ opacity: hovered ? 0.12 : 0.06 }}
          transition={{ duration: 0.25 }}
          style={{ background: `linear-gradient(90deg, rgba(${accent},0.3), transparent)` }}
        />
      </div>
      {/* Body */}
      <div className="relative px-3.5 pb-3.5 pt-1">{children}</div>
    </motion.div>
  )
}

/* ── StatPill: Small inline stat badge for profile ── */
function StatPill({ label, color, bright }: { label: string; color: string; bright?: boolean }) {
  return (
    <span className="text-[8px] font-mono font-bold px-2 py-0.5 rounded-md" style={{
      background: `rgba(${color},${bright ? 0.08 : 0.05})`,
      border: `1px solid rgba(${color},${bright ? 0.12 : 0.06})`,
      color: `rgba(${color},${bright ? 0.8 : 0.55})`,
      boxShadow: bright ? `0 0 8px rgba(${color},0.06)` : "none",
    }}>{label}</span>
  )
}

/* ── ConfluenceRow: Single confluence signal with strength bar ── */
function ConfluenceRow({ name, category, strength, color }: { name: string; category: string; strength: number; color: string }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      animate={{
        background: hovered ? `rgba(${color},0.04)` : "rgba(255,255,255,0.012)",
        borderColor: hovered ? `rgba(${color},0.12)` : "rgba(148,163,184,0.04)",
      }}
      transition={{ duration: 0.2 }}
      className="flex items-center justify-between px-3 py-2.5 rounded-lg cursor-default"
      style={{
        background: "rgba(255,255,255,0.012)",
        border: `1px solid rgba(148,163,184,0.04)`,
      }}
    >
      <div className="flex items-center gap-2.5">
        <motion.div
          animate={{ boxShadow: hovered ? `0 0 8px rgba(${color},0.15)` : `0 0 4px rgba(${color},0.05)` }}
          transition={{ duration: 0.2 }}
          className="w-6 h-6 rounded-lg flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, rgba(${color},0.12) 0%, rgba(${color},0.04) 100%)`,
            border: `1px solid rgba(${color},0.1)`,
          }}
        >
          <Zap size={10} style={{ color: `rgba(${color},0.65)` }} />
        </motion.div>
        <div>
          <span className="text-[10.5px] font-semibold block leading-tight" style={{ color: "rgba(255,255,255,0.7)" }}>{name}</span>
          <span className="text-[7px] font-mono uppercase tracking-wider" style={{ color: `rgba(${color},0.35)` }}>{category}</span>
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        <div className="w-14 h-[4px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${strength}%` }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, rgba(${color},0.35), rgba(${color},0.65))`,
              boxShadow: `0 0 8px rgba(${color},0.2)`,
            }}
          />
        </div>
        <span className="text-[10px] font-mono font-black w-5 text-right" style={{
          color: `rgba(${color},0.75)`,
          fontVariantNumeric: "tabular-nums",
          textShadow: `0 0 8px rgba(${color},0.1)`,
        }}>{strength}</span>
      </div>
    </motion.div>
  )
}

/* ── Workspace Chart ── */
function WorkspaceChart({ forecast, dirColor }: { forecast: ForecastItem; dirColor: { rgb: string; hex: string } }) {
  const seed = forecast.id.charCodeAt(forecast.id.length - 1)
  const isLong = forecast.direction === "LONG"
  const candles: { x: number; o: number; c: number; h: number; l: number }[] = []
  let price = 50 + (seed % 20)
  for (let i = 0; i < 48; i++) {
    const move = (Math.sin(seed * 0.5 + i * 0.55) * 4.8) + (isLong ? 0.28 : -0.28)
    const open = price; const close = price + move
    const high = Math.max(open, close) + Math.abs(Math.sin(i + seed) * 2.5)
    const low = Math.min(open, close) - Math.abs(Math.cos(i + seed) * 2.5)
    candles.push({ x: i * 13 + 8, o: open, c: close, h: high, l: low })
    price = close
  }
  const allP = candles.flatMap(c => [c.h, c.l])
  const mn = Math.min(...allP) - 4, mx = Math.max(...allP) + 4
  const s = (v: number) => ((mx - v) / (mx - mn)) * 280

  const entryPrice = candles[34].c
  const slPrice = isLong ? entryPrice - 7 : entryPrice + 7
  const tpPrice = isLong ? entryPrice + 14 : entryPrice - 14
  const entryY = s(entryPrice), slY = s(slPrice), tpY = s(tpPrice)

  return (
    <div className="w-full h-full p-2">
      <svg viewBox="0 0 640 285" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="ws-tp-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={`rgba(${ACCENT.emerald.rgb},0.06)`} />
            <stop offset="100%" stopColor={`rgba(${ACCENT.emerald.rgb},0.015)`} />
          </linearGradient>
          <linearGradient id="ws-sl-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={`rgba(${ACCENT.rose.rgb},0.05)`} />
            <stop offset="100%" stopColor={`rgba(${ACCENT.rose.rgb},0.01)`} />
          </linearGradient>
        </defs>
        {/* Grid */}
        {[0.2, 0.4, 0.6, 0.8].map((f) => (
          <line key={f} x1="0" y1={285 * f} x2="640" y2={285 * f} stroke="rgba(148,163,184,0.025)" strokeWidth="0.5" />
        ))}
        {/* TP zone */}
        <rect x="440" y={Math.min(entryY, tpY)} width="200" height={Math.abs(tpY - entryY)}
          fill="url(#ws-tp-fill)" />
        {/* SL zone */}
        <rect x="440" y={Math.min(entryY, slY)} width="200" height={Math.abs(slY - entryY)}
          fill="url(#ws-sl-fill)" />
        {/* Lines */}
        <line x1="0" y1={entryY} x2="640" y2={entryY} stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" strokeDasharray="4 3" />
        <line x1="380" y1={tpY} x2="640" y2={tpY} stroke={`rgba(${ACCENT.emerald.rgb},0.25)`} strokeWidth="0.5" strokeDasharray="4 3" />
        <line x1="380" y1={slY} x2="640" y2={slY} stroke={`rgba(${ACCENT.rose.rgb},0.2)`} strokeWidth="0.5" strokeDasharray="4 3" />
        {/* Labels */}
        <text x="634" y={tpY - 4} textAnchor="end" fill={`rgba(${ACCENT.emerald.rgb},0.4)`} fontSize="7" fontFamily="monospace">TP</text>
        <text x="634" y={slY - 4} textAnchor="end" fill={`rgba(${ACCENT.rose.rgb},0.35)`} fontSize="7" fontFamily="monospace">SL</text>
        <text x="634" y={entryY - 4} textAnchor="end" fill="rgba(255,255,255,0.2)" fontSize="7" fontFamily="monospace">Entry</text>
        {/* Candles */}
        {candles.map((c, i) => {
          const bull = c.c > c.o
          const col = bull ? `rgba(${ACCENT.emerald.rgb},0.6)` : `rgba(${ACCENT.rose.rgb},0.5)`
          const top = s(Math.max(c.o, c.c))
          const bot = s(Math.min(c.o, c.c))
          return (
            <g key={i}>
              <line x1={c.x} y1={s(c.h)} x2={c.x} y2={s(c.l)} stroke={col} strokeWidth="0.7" />
              <rect x={c.x - 3.5} y={top} width="7" height={Math.max(1, bot - top)} fill={col} rx="0.5" />
            </g>
          )
        })}
      </svg>
    </div>
  )
}

/* ── AI Breakdown ── */
function AIBreakdownPanel({ forecast, dirColor }: { forecast: ForecastItem; dirColor: { rgb: string; hex: string } }) {
  const sections = useMemo(() => [
    {
      title: "Market Context",
      content: `${forecast.instrument} showing ${forecast.direction === "LONG" ? "bullish" : "bearish"} structure on ${forecast.timeframe}. Price action aligns with thesis and current conditions support directional bias.`,
    },
    {
      title: "Entry Logic",
      content: forecast.confluences.length > 0
        ? `Triggered by ${forecast.confluences.map(c => c.name).join(", ")}. ${forecast.confluences.length >= 2 ? "Multiple confluence factors strengthen this." : "Single confluence identified."}`
        : "Entry based on price action analysis and structural alignment.",
    },
    {
      title: "Risk Assessment",
      content: `Risk at ${forecast.stopLoss}, target ${forecast.takeProfit}. ${forecast.riskReward} R:R ${parseFloat(forecast.riskReward.split(":")[1] || "0") >= 2 ? "exceeds 1:2 minimum" : "provides acceptable ratio"}. ${forecast.confidence >= 70 ? "High conviction." : forecast.confidence >= 50 ? "Moderate conviction." : "Low conviction -- reduce size."}`,
    },
    ...(forecast.invalidation ? [{
      title: "Failure Scenario",
      content: forecast.invalidation,
    }] : []),
  ], [forecast])

  const sectionColors = [ACCENT.blue.rgb, ACCENT.emerald.rgb, ACCENT.amber.rgb, ACCENT.rose.rgb]

  return (
    <div className="space-y-2">
      {sections.map((s2, i) => (
        <div key={i} className="rounded-lg px-3 py-2.5 transition-all duration-200 hover:bg-white/[0.015]" style={{
          background: `linear-gradient(135deg, rgba(${sectionColors[i] || ACCENT.purple.rgb},0.02) 0%, transparent 100%)`,
          borderLeft: `2px solid rgba(${sectionColors[i] || ACCENT.purple.rgb},0.2)`,
        }}>
          <span className="text-[8px] font-mono uppercase tracking-[0.12em] font-bold flex items-center gap-1.5 mb-1" style={{ color: `rgba(${sectionColors[i] || ACCENT.purple.rgb},0.5)` }}>
            <div className="w-1 h-1 rounded-full" style={{ background: `rgba(${sectionColors[i] || ACCENT.purple.rgb},0.45)`, boxShadow: `0 0 4px rgba(${sectionColors[i] || ACCENT.purple.rgb},0.25)` }} />
            {s2.title}
          </span>
          <p className="text-[10.5px] leading-[1.65]" style={{ color: "rgba(255,255,255,0.52)" }}>{s2.content}</p>
        </div>
      ))}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════════════════════════════ */
function getStatusConfig(status: ForecastStatus) {
  switch (status) {
    case "active": return { label: "Active", icon: Timer, color: ACCENT.blue.rgb }
    case "near_expiry": return { label: "Expiring", icon: Hourglass, color: ACCENT.amber.rgb }
    case "awaiting_resolution": return { label: "Awaiting", icon: Clock, color: ACCENT.cyan.rgb }
    case "resolved_win": return { label: "Won", icon: CheckCircle2, color: ACCENT.emerald.rgb }
    case "resolved_loss": return { label: "Lost", icon: XCircle, color: ACCENT.rose.rgb }
    case "expired": return { label: "Expired", icon: Clock, color: ACCENT.slate.rgb }
    case "invalidated": return { label: "Void", icon: XCircle, color: ACCENT.slate.rgb }
  }
}

function getConfidenceColor(confidence: number) {
  if (confidence >= 75) return ACCENT.emerald.rgb
  if (confidence >= 50) return ACCENT.amber.rgb
  return ACCENT.rose.rgb
}

function getTimeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

function getTimeUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now()
  if (diff <= 0) return "expired"
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m left`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h left`
  return `${Math.floor(hours / 24)}d left`
}
