"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { MentorAIPersona } from "@/lib/mentor/types"

/* ═══════════════════════════════════════════════════════════════
   JADECAP AI AGENT
   
   A method-biased conversational AI that answers as if it IS the
   mentor. It has the mentor's terminology, patience rules, risk
   philosophy, and session preferences baked in.
   
   This is NOT generic Copilot. This is JadeCap's brain.
   ═══════════════════════════════════════════════════════════════ */

interface ChatMessage {
  id: string
  role: "user" | "mentor" | "system"
  text: string
  timestamp: Date
}

interface Props {
  persona: MentorAIPersona
  mentorName: string
  accentColor: string
  conditionsSummary: string
  sessionPhase?: string
  bias?: string
}

// Simulated response logic (Phase 2: replace with real AI route)
function generateMentorResponse(
  message: string,
  persona: MentorAIPersona,
  conditionsSummary: string,
  sessionPhase?: string,
  bias?: string,
): string {
  const lower = message.toLowerCase()

  // Session/timing questions
  if (lower.includes("should i trade") || lower.includes("can i trade") || lower.includes("is it time")) {
    if (sessionPhase === "CLOSED") {
      return "The session is closed. There is nothing to do right now. Review your trade plan for tomorrow, mark your key levels, and step away from the screen. The market will be here tomorrow."
    }
    if (sessionPhase === "PRE_SESSION") {
      return `You are in pre-session. This is analysis time, not trading time. ${conditionsSummary}. Build your bias, mark your levels, and wait for the killzone to open. No entries before 9:30 AM ET.`
    }
    if (sessionPhase === "KILLZONE") {
      return `The killzone is active. ${conditionsSummary}. ${
        conditionsSummary.startsWith("0") || conditionsSummary.startsWith("1")
          ? "Not enough conditions are met yet. Be patient. Wait for displacement."
          : "Conditions are forming. Stay sharp but do not force anything. The setup will either come to you or it will not."
      }`
    }
    return `${conditionsSummary}. ${persona.patience}`
  }

  // Setup validation
  if (lower.includes("valid") || lower.includes("setup") || lower.includes("entry") || lower.includes("take this")) {
    return `Let me check the conditions. ${conditionsSummary}. ${persona.refusalPattern.replace("[Specific reason]", "Not all conditions are confirmed")} Remember: partial setups are not setups. All conditions must be green before you consider an entry.`
  }

  // FVG questions
  if (lower.includes("fvg") || lower.includes("fair value") || lower.includes("gap")) {
    return "A Fair Value Gap is a 3-candle pattern where candle 1 and candle 3 wicks do not overlap. The gap between them represents an imbalance. I only trade FVGs on M5 or M15 -- M1 FVGs are noise. The FVG must form AFTER displacement, not before. If the FVG gets immediately filled in the next candle, it is invalid. Mark it and wait for price to retrace to it."
  }

  // Order block questions
  if (lower.includes("order block") || lower.includes("ob") || lower.includes("order block")) {
    return "The order block is the last opposing candle before displacement. For a bearish setup, the OB is the last green candle before the strong red move. Your entry goes at the OB candle body, your stop goes 1-2 pips beyond its wick. I always use limit orders here -- never market orders. If price does not come to my level, I do not chase."
  }

  // Displacement questions
  if (lower.includes("displacement") || lower.includes("displace")) {
    return "Displacement is a rapid, aggressive price move of at least 15 pips in the bias direction. It is NOT a slow drift. It is violent and unmistakable. On M5, look for a candle with a large body relative to the session average. If you are unsure whether it is displacement, it is not. Real displacement makes you feel like you missed it. That feeling is your confirmation -- now wait for the retracement."
  }

  // Psychology / discipline
  if (lower.includes("revenge") || lower.includes("emotional") || lower.includes("scared") || lower.includes("anxious") || lower.includes("fomo") || lower.includes("frustrated")) {
    return "If you are feeling this way, step away from the screen immediately. Close your charts. The market does not care about your emotions, but your account does. The method works on discipline, not feelings. Take a 30-minute break. When you come back, ask yourself: does the setup meet all 5 conditions? If yes, execute. If no, wait. There is no third option."
  }

  // Stop loss questions
  if (lower.includes("stop") || lower.includes("sl") || lower.includes("stop loss")) {
    return "Your stop loss is your business partner. It is placed 1-2 pips beyond the order block wick -- always. Do not widen it. Do not remove it. Do not pray. If price hits your stop, the market is telling you the OB is invalid. Accept the information and move on. The cost of a stop loss is the cost of doing business. The cost of not having one is your account."
  }

  // Risk/position sizing
  if (lower.includes("risk") || lower.includes("lot") || lower.includes("size") || lower.includes("position")) {
    return "Maximum 1% of your account per trade. No exceptions. No matter how perfect the setup looks. If you had 2 consecutive losses, stop trading for the day. Maximum 2 trades per session. These are not guidelines -- they are rules. Breaking them is the fastest way to destroy the edge this method gives you."
  }

  // Timing
  if (lower.includes("when") || lower.includes("time") || lower.includes("how long")) {
    return persona.patience
  }

  // Bias questions
  if (lower.includes("bias") || lower.includes("direction") || lower.includes("bullish") || lower.includes("bearish")) {
    return `Current bias: ${bias || "Check the D1 + H4 charts"}. The bias is established in pre-session by reading D1 structure first, then confirming on H4. If D1 and H4 disagree, I sit on my hands. Both timeframes must align. The bias does not change during the session unless there is a clear structural break on H4.`
  }

  // Default: core belief + method reminder
  const belief = persona.coreBeliefs[Math.floor(Math.random() * persona.coreBeliefs.length)]
  return `${belief} Remember: the method is your edge. Every answer I give you comes from the same rules. Trust the process.`
}

export function MentorAIChat({ persona, mentorName, accentColor, conditionsSummary, sessionPhase, bias }: Props) {
  const [expanded, setExpanded] = useState(true)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "system",
      text: `${mentorName} AI is active. Ask anything about the method, current conditions, or trade psychology.`,
      timestamp: new Date(),
    },
  ])
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = useCallback(() => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()

    setMessages(prev => [...prev, {
      id: `u-${Date.now()}`,
      role: "user",
      text: userMsg,
      timestamp: new Date(),
    }])
    setInput("")
    setLoading(true)

    // Simulate typing delay
    const delay = 800 + Math.random() * 1200
    setTimeout(() => {
      const response = generateMentorResponse(userMsg, persona, conditionsSummary, sessionPhase, bias)
      setMessages(prev => [...prev, {
        id: `m-${Date.now()}`,
        role: "mentor",
        text: response,
        timestamp: new Date(),
      }])
      setLoading(false)
    }, delay)
  }, [input, loading, persona, conditionsSummary, sessionPhase, bias])

  const handleQuickQuestion = useCallback((q: string) => {
    setInput(q)
    setTimeout(() => {
      setInput("")
      setMessages(prev => [...prev, {
        id: `u-${Date.now()}`,
        role: "user",
        text: q,
        timestamp: new Date(),
      }])
      setLoading(true)
      setTimeout(() => {
        const response = generateMentorResponse(q, persona, conditionsSummary, sessionPhase, bias)
        setMessages(prev => [...prev, {
          id: `m-${Date.now()}`,
          role: "mentor",
          text: response,
          timestamp: new Date(),
        }])
        setLoading(false)
      }, 800 + Math.random() * 1200)
    }, 100)
  }, [persona, conditionsSummary, sessionPhase, bias])

  return (
    <div className="mx-3 my-2">
      <div
        className="rounded-xl overflow-hidden flex flex-col"
        style={{ backgroundColor: `${accentColor}03`, border: `1px solid ${accentColor}12` }}
      >
        {/* Header */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between px-3 py-2.5 text-left shrink-0"
          style={{ borderBottom: expanded ? `1px solid ${accentColor}08` : "none" }}
        >
          <div className="flex items-center gap-2.5">
            {/* AI avatar */}
            <div
              className="relative w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${accentColor}12`, border: `1px solid ${accentColor}20` }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="4.5" r="2.5" stroke={accentColor} strokeWidth="1" opacity="0.6" />
                <path d="M2 11C2 8.8 3.8 7 6 7C8.2 7 10 8.8 10 11" stroke={accentColor} strokeWidth="1" opacity="0.4" />
              </svg>
              <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-[#0c0c12]" style={{ backgroundColor: "#10b981" }} />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold block" style={{ color: `${accentColor}80` }}>
                {mentorName} AI Agent
              </span>
              <span className="text-[7px] font-mono text-white/15 block">
                Method-biased -- answers as {mentorName} would
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[6px] font-mono font-black tracking-wider uppercase px-1.5 py-0.5 rounded" style={{ color: "#10b981", backgroundColor: "rgba(16,185,129,0.06)" }}>
              LIVE
            </span>
            <svg
              width="10" height="10" viewBox="0 0 10 10" fill="none"
              className="transition-transform duration-200"
              style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
            >
              <path d="M3 4L5 6L7 4" stroke={`${accentColor}40`} strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </div>
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden flex flex-col"
            >
              {/* Quick question chips */}
              {messages.length <= 2 && persona.suggestedQuestions && (
                <div className="px-3 py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.02)" }}>
                  <span className="text-[6.5px] font-mono font-black tracking-wider uppercase text-white/12 block mb-1.5">SUGGESTED</span>
                  <div className="flex flex-wrap gap-1">
                    {persona.suggestedQuestions.slice(0, 4).map((q, i) => (
                      <button
                        key={i}
                        onClick={() => handleQuickQuestion(q)}
                        className="text-[7.5px] font-mono px-2 py-1 rounded-md transition-all hover:bg-white/[0.03]"
                        style={{ color: `${accentColor}40`, border: `1px solid ${accentColor}08` }}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages */}
              <div
                ref={scrollRef}
                className="max-h-[280px] overflow-y-auto scrollbar-terminal px-3 py-2"
              >
                {messages.map(msg => (
                  <div key={msg.id} className={`mb-2.5 ${msg.role === "user" ? "flex justify-end" : "flex justify-start"}`}>
                    {msg.role === "system" ? (
                      <div className="w-full text-center py-1">
                        <span className="text-[7.5px] font-mono text-white/12">{msg.text}</span>
                      </div>
                    ) : (
                      <div
                        className="max-w-[90%] rounded-lg px-3 py-2"
                        style={{
                          backgroundColor: msg.role === "user" ? "rgba(255,255,255,0.03)" : `${accentColor}06`,
                          border: `1px solid ${msg.role === "user" ? "rgba(255,255,255,0.05)" : `${accentColor}10`}`,
                        }}
                      >
                        {msg.role === "mentor" && (
                          <div className="flex items-center gap-1.5 mb-1">
                            <div className="w-1 h-1 rounded-full" style={{ backgroundColor: accentColor }} />
                            <span className="text-[7px] font-mono font-black tracking-wider uppercase" style={{ color: `${accentColor}50` }}>
                              {mentorName}
                            </span>
                            <span className="text-[6px] font-mono text-white/10 ml-auto">
                              {msg.timestamp.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                            </span>
                          </div>
                        )}
                        <p className={`text-[9px] font-mono leading-[1.7] ${msg.role === "user" ? "text-white/45" : "text-white/40"}`}>
                          {msg.text}
                        </p>
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing indicator */}
                {loading && (
                  <div className="flex justify-start mb-2">
                    <div className="rounded-lg px-3 py-2" style={{ backgroundColor: `${accentColor}06`, border: `1px solid ${accentColor}10` }}>
                      <div className="flex items-center gap-1.5">
                        <div className="w-1 h-1 rounded-full" style={{ backgroundColor: accentColor }} />
                        <span className="text-[7px] font-mono" style={{ color: `${accentColor}40` }}>{mentorName} is thinking</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {[0, 1, 2].map(i => (
                          <motion.div
                            key={i}
                            className="w-1 h-1 rounded-full"
                            style={{ backgroundColor: accentColor }}
                            animate={{ opacity: [0.2, 0.7, 0.2] }}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="px-2.5 pb-2.5 pt-1" style={{ borderTop: "1px solid rgba(255,255,255,0.02)" }}>
                <div
                  className="flex items-center gap-2 rounded-lg px-3 py-2"
                  style={{ backgroundColor: "rgba(255,255,255,0.02)", border: `1px solid ${accentColor}10` }}
                >
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSend()}
                    placeholder={`Ask ${mentorName} anything...`}
                    className="flex-1 bg-transparent text-[9px] font-mono text-white/50 placeholder:text-white/12 outline-none"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || loading}
                    className="shrink-0 w-6 h-6 rounded-md flex items-center justify-center transition-all disabled:opacity-15"
                    style={{ backgroundColor: input.trim() ? `${accentColor}15` : "transparent", border: `1px solid ${input.trim() ? `${accentColor}25` : "transparent"}` }}
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M1 5H8M5.5 2.5L8 5L5.5 7.5" stroke={accentColor} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity={input.trim() ? 0.7 : 0.2} />
                    </svg>
                  </button>
                </div>

                {/* Context indicator */}
                <div className="flex items-center gap-2 mt-1.5 px-1">
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-emerald-400/30" />
                    <span className="text-[6px] font-mono text-white/10">Context-aware</span>
                  </div>
                  <span className="text-[6px] font-mono text-white/06">|</span>
                  <span className="text-[6px] font-mono text-white/10">{conditionsSummary}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
