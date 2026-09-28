"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { cn } from "@/lib/utils"
import {
  ActivityIntelligenceIcon,
  StrategyOSIcon,
  PsychologyMappingIcon,
  MentorIntelligenceIcon,
  SecureEnvironmentIcon,
  AICopilotIcon,
} from "./icons"
import { LayerDetailModal } from "./LayerDetailModal"
import { ActivityOrbitField } from "./orbit-fields/ActivityOrbitField"
import { StrategyOrbitField } from "./orbit-fields/StrategyOrbitField"
import { SURFACE, ACCENT, GLOW, RADIUS } from "@/components/mtf/mtf-theme"

interface AccessArchitecturePreviewProps {
  interactionState?: "idle" | "hovering" | "email-focus" | "password-focus" | "confirm-focus" | "cta-hover" | "submitting" | "success"
  breathValue?: number
  className?: string
  onHoveredLayerChange?: (layerId: string | null) => void
}

// System layer definitions with deeper internal structure
const SYSTEM_LAYERS = [
  {
    id: "activity-intelligence",
    name: "Activity Intelligence",
    shorthand: "ACT-INT",
    icon: ActivityIntelligenceIcon,
    status: "ACTIVE",
    statusColor: "emerald",
    triggeredBy: "hovering",
    description: "Real-time pattern recognition across all market movements and position flows.",
    sublayers: [
      { name: "Pattern Engine", status: "Running", load: "12ms" },
      { name: "Flow Analysis", status: "Streaming", load: "8ms" },
      { name: "Signal Cache", status: "Warm", load: "2ms" },
    ],
  },
  {
    id: "strategy-os",
    name: "Strategy Operating System",
    shorthand: "STRAT-OS",
    icon: StrategyOSIcon,
    status: "READY",
    statusColor: "blue",
    triggeredBy: "email-focus",
    description: "Structured execution frameworks with adaptive logic and rule validation.",
    sublayers: [
      { name: "Rule Engine", status: "Loaded", load: "4ms" },
      { name: "Backtest Core", status: "Standby", load: "---" },
      { name: "Risk Matrix", status: "Calibrated", load: "6ms" },
    ],
  },
  {
    id: "psychology-mapping",
    name: "Psychology Mapping",
    shorthand: "PSY-MAP",
    icon: PsychologyMappingIcon,
    status: "CALIBRATING",
    statusColor: "amber",
    triggeredBy: "email-focus",
    description: "Behavioral analysis, emotional state tracking, and decision bias detection.",
    sublayers: [
      { name: "Bias Detector", status: "Calibrating", load: "---" },
      { name: "State Model", status: "Awaiting", load: "---" },
      { name: "Journal Engine", status: "Ready", load: "3ms" },
    ],
  },
  {
    id: "secure-environment",
    name: "Secure Environment",
    shorthand: "SEC-ENV",
    icon: SecureEnvironmentIcon,
    status: "VERIFIED",
    statusColor: "emerald",
    triggeredBy: "password-focus",
    description: "Institutional-grade encryption, access control, and data isolation protocols.",
    sublayers: [
      { name: "Encryption Layer", status: "AES-256", load: "1ms" },
      { name: "Access Control", status: "Locked", load: "---" },
      { name: "Audit Log", status: "Recording", load: "2ms" },
    ],
  },
  {
    id: "mentor-intelligence",
    name: "Mentor Intelligence",
    shorthand: "MNT-INT",
    icon: MentorIntelligenceIcon,
    status: "STANDBY",
    statusColor: "slate",
    triggeredBy: "confirm-focus",
    description: "Expert-derived decision frameworks, contextual guidance, and learning paths.",
    sublayers: [
      { name: "Knowledge Base", status: "Indexed", load: "5ms" },
      { name: "Context Engine", status: "Standby", load: "---" },
      { name: "Guidance Model", status: "Loaded", load: "7ms" },
    ],
  },
  {
    id: "ai-copilot",
    name: "AI Copilot",
    shorthand: "AI-COP",
    icon: AICopilotIcon,
    status: "INITIALIZING",
    statusColor: "purple",
    triggeredBy: "cta-hover",
    description: "Contextual interpretation, adaptive assistance, and intelligent automation.",
    sublayers: [
      { name: "Language Model", status: "Loading", load: "---" },
      { name: "Context Window", status: "Empty", load: "---" },
      { name: "Action Engine", status: "Standby", load: "---" },
    ],
  },
]

const STATUS_COLORS: Record<string, { text: string; bg: string; dot: string; stroke: string }> = {
  emerald: { text: "text-emerald-500/70", bg: "bg-emerald-500/8", dot: "bg-emerald-500/60", stroke: ACCENT.emerald.hex },
  blue: { text: "text-blue-400/70", bg: "bg-blue-400/8", dot: "bg-blue-400/60", stroke: ACCENT.blue.hex },
  amber: { text: "text-amber-500/70", bg: "bg-amber-500/8", dot: "bg-amber-500/60", stroke: ACCENT.amber.hex },
  slate: { text: "text-slate-400/60", bg: "bg-slate-400/8", dot: "bg-slate-500/40", stroke: ACCENT.slate.hex },
  purple: { text: "text-purple-400/70", bg: "bg-purple-400/8", dot: "bg-purple-400/60", stroke: ACCENT.purple.hex },
}

// Animated status SVG indicators per layer color
function StatusSVG({ color, isActive, isSuccess }: { color: string; isActive: boolean; isSuccess: boolean }) {
  const c = STATUS_COLORS[color] || STATUS_COLORS.slate
  const s = isSuccess ? ACCENT.emerald.hex : c.stroke
  const o = isActive ? 0.7 : 0.35
  
  if (color === "emerald") {
    return (
      <svg width="18" height="18" viewBox="0 0 18 18" style={{ opacity: o }}>
        <circle cx="9" cy="9" r="6" stroke={s} strokeWidth="0.8" fill="none" opacity="0.5" />
        <circle cx="9" cy="9" r="3" stroke={s} strokeWidth="0.6" fill="none" opacity="0.3" />
        <circle cx="9" cy="3" r="1.2" fill={s}>
          <animateTransform attributeName="transform" type="rotate" from="0 9 9" to="360 9 9" dur="3s" repeatCount="indefinite" />
        </circle>
      </svg>
    )
  }
  if (color === "blue") {
    return (
      <svg width="18" height="18" viewBox="0 0 18 18" style={{ opacity: o }}>
        <rect x="3" y="5" width="12" height="1" fill={s} opacity="0.4">
          <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2s" repeatCount="indefinite" />
        </rect>
        <rect x="3" y="8.5" width="12" height="1" fill={s} opacity="0.6">
          <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite" />
        </rect>
        <rect x="3" y="12" width="12" height="1" fill={s} opacity="0.3">
          <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2.5s" repeatCount="indefinite" />
        </rect>
      </svg>
    )
  }
  if (color === "amber") {
    return (
      <svg width="18" height="18" viewBox="0 0 18 18" style={{ opacity: o }}>
        <polygon points="9,3 15,13 3,13" stroke={s} strokeWidth="0.8" fill="none">
          <animateTransform attributeName="transform" type="rotate" from="0 9 9" to="360 9 9" dur="6s" repeatCount="indefinite" />
        </polygon>
        <circle cx="9" cy="9" r="1" fill={s} opacity="0.5">
          <animate attributeName="r" values="0.8;1.5;0.8" dur="2s" repeatCount="indefinite" />
        </circle>
      </svg>
    )
  }
  if (color === "purple") {
    return (
      <svg width="18" height="18" viewBox="0 0 18 18" style={{ opacity: o }}>
        <rect x="5" y="5" width="8" height="8" stroke={s} strokeWidth="0.8" fill="none" transform="rotate(45 9 9)">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite" />
        </rect>
        <rect x="7" y="7" width="4" height="4" stroke={s} strokeWidth="0.6" fill={s} fillOpacity="0.15" transform="rotate(45 9 9)">
          <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
        </rect>
      </svg>
    )
  }
  // Default (slate) - gentle crosshair
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" style={{ opacity: o }}>
      <line x1="9" y1="3" x2="9" y2="7" stroke={s} strokeWidth="0.6">
        <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2.5s" repeatCount="indefinite" />
      </line>
      <line x1="9" y1="11" x2="9" y2="15" stroke={s} strokeWidth="0.6">
        <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2.5s" repeatCount="indefinite" />
      </line>
      <line x1="3" y1="9" x2="7" y2="9" stroke={s} strokeWidth="0.6">
        <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2.5s" repeatCount="indefinite" />
      </line>
      <line x1="11" y1="9" x2="15" y2="9" stroke={s} strokeWidth="0.6">
        <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2.5s" repeatCount="indefinite" />
      </line>
      <circle cx="9" cy="9" r="1.5" stroke={s} strokeWidth="0.5" fill="none" />
    </svg>
  )
}

export function AccessArchitecturePreview({
  interactionState = "idle",
  breathValue = 0,
  className,
  onHoveredLayerChange,
}: AccessArchitecturePreviewProps) {
  const [expandedLayer, setExpandedLayer] = useState<string | null>(null)
  const [hoveredLayer, setHoveredLayer] = useState<string | null>(null)
  const [cascadeIndex, setCascadeIndex] = useState(-1)
  const [modalLayer, setModalLayer] = useState<{ id: string; name: string; color: string } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const layerRowRefs = useRef<Map<string, HTMLButtonElement>>(new Map())
  const [orbitCenter, setOrbitCenter] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    if (!hoveredLayer || !containerRef.current) {
      setOrbitCenter(null)
      return
    }
    const rowEl = layerRowRefs.current.get(hoveredLayer)
    if (!rowEl || !containerRef.current) {
      setOrbitCenter(null)
      return
    }
    const containerRect = containerRef.current.getBoundingClientRect()
    const rowRect = rowEl.getBoundingClientRect()
    setOrbitCenter({
      x: rowRect.left - containerRect.left + rowRect.width / 2,
      y: rowRect.top - containerRect.top + rowRect.height / 2,
    })
  }, [hoveredLayer])

  useEffect(() => {
    if (interactionState !== "submitting") {
      setCascadeIndex(-1)
      return
    }
    let i = 0
    const interval = setInterval(() => {
      setCascadeIndex(i)
      i = (i + 1) % SYSTEM_LAYERS.length
    }, 300)
    return () => clearInterval(interval)
  }, [interactionState])

  useEffect(() => {
    if (interactionState === "submitting" || interactionState === "success") {
      setExpandedLayer(null)
    }
  }, [interactionState])

  const isSuccess = interactionState === "success"
  const isSubmitting = interactionState === "submitting"
  const isEngaged = interactionState !== "idle"

  return (
    <div ref={containerRef} className={cn("relative h-full w-full overflow-hidden flex flex-col justify-center", className)}>
      {/* Layer-specific orbit fields */}
      {orbitCenter && hoveredLayer === "activity-intelligence" && (
        <ActivityOrbitField centerX={orbitCenter.x} centerY={orbitCenter.y} isActive={true} />
      )}
      {orbitCenter && hoveredLayer === "strategy-os" && (
        <StrategyOrbitField centerX={orbitCenter.x} centerY={orbitCenter.y} isActive={true} />
      )}

      {/* Ambient depth field */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            opacity: isEngaged ? 0.5 : 0.2,
            background: `
              radial-gradient(ellipse 60% 50% at 50% 40%, rgba(${ACCENT.purple.rgb},0.06), transparent),
              radial-gradient(ellipse 40% 30% at 70% 60%, rgba(${ACCENT.blue.rgb},0.04), transparent)
            `,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 px-8 py-10 max-w-[420px] mx-auto w-full">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <div
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-all duration-500",
              )}
              style={{
                background: isSuccess
                  ? ACCENT.emerald.hex
                  : isEngaged
                    ? ACCENT.purple.hex
                    : "rgb(51,65,85)",
                boxShadow: isEngaged
                  ? GLOW.low(isSuccess ? ACCENT.emerald.rgb : ACCENT.purple.rgb)
                  : "none",
              }}
            />
            <span className="text-[9px] font-mono tracking-[0.2em] text-slate-500 uppercase">
              Access Architecture
            </span>
          </div>
          <p className={cn(
            "text-[13px] text-slate-500 leading-relaxed transition-colors duration-500",
            isEngaged && "text-slate-400"
          )}>
            Your credentials activate the following operational layers. Each module initializes independently upon verified access.
          </p>
        </div>

        {/* System layers */}
        <div className="space-y-1">
          {SYSTEM_LAYERS.map((layer, index) => {
            const Icon = layer.icon
            const colors = STATUS_COLORS[layer.statusColor]
            const isTriggered = interactionState === layer.triggeredBy || interactionState === "submitting" || interactionState === "success"
            const isCascading = cascadeIndex === index
            const isHovered = hoveredLayer === layer.id

            return (
              <div key={layer.id}>
                {/* Layer row */}
                <button
                  ref={(el) => { if (el) layerRowRefs.current.set(layer.id, el) }}
                  type="button"
                  onClick={() => setModalLayer({ id: layer.id, name: layer.name, color: layer.statusColor })}
                  onMouseEnter={() => { setHoveredLayer(layer.id); onHoveredLayerChange?.(layer.id) }}
                  onMouseLeave={() => { setHoveredLayer(null); onHoveredLayerChange?.(null) }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3.5",
                    "text-left transition-all duration-300",
                    "border border-transparent outline-none",
                    "group cursor-pointer",
                  )}
                  style={{
                    borderRadius: RADIUS.badge,
                    background: isSuccess
                      ? `rgba(${ACCENT.emerald.rgb},0.04)`
                      : isCascading
                        ? `rgba(${ACCENT.blue.rgb},0.06)`
                        : isHovered
                          ? `rgba(${ACCENT.purple.rgb},0.06)`
                          : isTriggered
                            ? `rgba(${ACCENT.purple.rgb},0.03)`
                            : "transparent",
                    borderColor: isSuccess
                      ? `rgba(${ACCENT.emerald.rgb},0.1)`
                      : isCascading
                        ? `rgba(${ACCENT.blue.rgb},0.1)`
                        : isHovered
                          ? `rgba(${ACCENT.purple.rgb},0.08)`
                          : isTriggered
                            ? `rgba(${ACCENT.purple.rgb},0.04)`
                            : "transparent",
                  }}
                >
                  {/* Icon container */}
                  <div
                    className="flex-shrink-0 w-8 h-8 flex items-center justify-center transition-all duration-300"
                    style={{
                      borderRadius: RADIUS.badge,
                      border: `1px solid ${isSuccess
                        ? `rgba(${ACCENT.emerald.rgb},0.15)`
                        : isCascading
                          ? `rgba(${ACCENT.blue.rgb},0.15)`
                          : isHovered
                            ? `rgba(${ACCENT.purple.rgb},0.12)`
                            : isTriggered
                              ? `rgba(${ACCENT.purple.rgb},0.06)`
                              : `rgba(${ACCENT.purple.rgb},0.04)`
                      }`,
                    }}
                  >
                    <Icon
                      size={16}
                      className={cn(
                        "transition-colors duration-300",
                        "text-slate-600",
                        isTriggered && "text-slate-400",
                        isCascading && "text-blue-400",
                        isHovered && "text-purple-300",
                        isSuccess && "text-emerald-400",
                      )}
                    />
                  </div>

                  {/* Layer info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "text-[12px] font-medium tracking-wide transition-colors duration-300",
                          "text-slate-500",
                          isTriggered && "text-slate-300",
                          isCascading && "text-slate-200",
                          isHovered && "text-slate-200",
                          isSuccess && "text-emerald-300",
                        )}
                      >
                        {layer.name}
                      </span>
                    </div>
                  </div>

                  {/* Animated status SVG */}
                  <StatusSVG 
                    color={layer.statusColor} 
                    isActive={isTriggered || isHovered || false} 
                    isSuccess={isSuccess} 
                  />

                  {/* Inspect indicator */}
                  <div
                    className={cn(
                      "w-4 h-4 flex items-center justify-center",
                      "text-slate-700 transition-all duration-200",
                      "group-hover:text-purple-400/60",
                    )}
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <rect x="1" y="1" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.5" />
                      <path d="M3 5H7M5 3V7" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
                    </svg>
                  </div>
                </button>

                {/* Click indicator */}
                <div className="ml-[30px] flex items-center gap-2 px-4 py-1">
                  <span className={cn(
                    "text-[8px] font-mono tracking-[0.12em] transition-colors duration-200",
                    isHovered ? "text-purple-400/40" : "text-transparent"
                  )}>
                    CLICK TO INSPECT
                  </span>
                </div>

                {/* Connection seam to next layer */}
                {index < SYSTEM_LAYERS.length - 1 && (
                  <div
                    className="ml-[30px] h-px transition-all duration-500"
                    style={{
                      background: isTriggered
                        ? `linear-gradient(90deg, rgba(${ACCENT.purple.rgb},0.1) 0%, rgba(${ACCENT.purple.rgb},0.04) 60%, transparent 100%)`
                        : `linear-gradient(90deg, rgba(${ACCENT.purple.rgb},0.04) 0%, transparent 40%)`,
                    }}
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* Footer system readout */}
        <div
          className="mt-10 pt-5"
          style={{ borderTop: `1px solid rgba(${ACCENT.purple.rgb},0.06)` }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono tracking-[0.15em] text-slate-600 uppercase">
              {isSubmitting
                ? "Authenticating operator..."
                : isSuccess
                  ? "All layers initialized"
                  : "Awaiting valid credentials"}
            </span>
            <div className="flex items-center gap-1.5">
              {SYSTEM_LAYERS.map((_, i) => (
                <div
                  key={i}
                  className="w-1 h-3 transition-all duration-300"
                  style={{
                    borderRadius: "2px",
                    background: isSuccess
                      ? `rgba(${ACCENT.emerald.rgb},0.5)`
                      : cascadeIndex >= i && isSubmitting
                        ? `rgba(${ACCENT.blue.rgb},0.5)`
                        : `rgba(${ACCENT.purple.rgb},0.08)`,
                    opacity: 0.4 + (breathValue * 0.15) + (i * 0.08),
                    transitionDelay: `${i * 60}ms`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Layer Detail Modal */}
      {modalLayer && (
        <LayerDetailModal
          layerId={modalLayer.id}
          layerName={modalLayer.name}
          layerColor={modalLayer.color}
          isOpen={true}
          onClose={() => setModalLayer(null)}
        />
      )}
    </div>
  )
}
