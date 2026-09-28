"use client"
/**
 * DiscoveryEngine v9 -- Custom SVG Orbit Intelligence
 *
 * Full-width centered orbit with hero content in the center.
 * Custom detailed SVG icons for every dimension.
 * Labels appear only on hover. Click to filter.
 * Constellation connections between active filters.
 */

import { useState, useCallback, useRef, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ALL_DIMENSIONS, RING_LABELS, type DiscoveryDimension } from "./discovery-dimensions"

/* ── CUSTOM SVG ICONS ── */
// Each returns a detailed SVG matching the dimension concept
function DimIcon({ id, size = 28, color = "currentColor", glow }: { id: string; size?: number; color?: string; glow?: string }) {
  const s = size
  const c = color
  const g = glow || color

  const icons: Record<string, React.ReactNode> = {
    "ai-models": (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
        {/* Neural network brain */}
        <circle cx="24" cy="14" r="6" stroke={c} strokeWidth="1.5" fill="none" opacity="0.7"/>
        <circle cx="14" cy="28" r="5" stroke={c} strokeWidth="1.5" fill="none" opacity="0.7"/>
        <circle cx="34" cy="28" r="5" stroke={c} strokeWidth="1.5" fill="none" opacity="0.7"/>
        <circle cx="24" cy="38" r="4" stroke={c} strokeWidth="1.5" fill="none" opacity="0.7"/>
        <line x1="24" y1="20" x2="14" y2="23" stroke={c} strokeWidth="1" opacity="0.4"/>
        <line x1="24" y1="20" x2="34" y2="23" stroke={c} strokeWidth="1" opacity="0.4"/>
        <line x1="14" y1="33" x2="24" y2="34" stroke={c} strokeWidth="1" opacity="0.4"/>
        <line x1="34" y1="33" x2="24" y2="34" stroke={c} strokeWidth="1" opacity="0.4"/>
        <circle cx="24" cy="14" r="2.5" fill={c} opacity="0.9"/>
        <circle cx="14" cy="28" r="2" fill={c} opacity="0.7"/>
        <circle cx="34" cy="28" r="2" fill={c} opacity="0.7"/>
        <circle cx="24" cy="38" r="1.5" fill={c} opacity="0.6"/>
        {/* Pulse rings */}
        <circle cx="24" cy="14" r="9" stroke={g} strokeWidth="0.5" opacity="0.15"/>
      </svg>
    ),
    "live-calls": (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
        {/* Broadcast tower with signal waves */}
        <line x1="24" y1="40" x2="24" y2="18" stroke={c} strokeWidth="2" opacity="0.8"/>
        <line x1="18" y1="40" x2="24" y2="24" stroke={c} strokeWidth="1.5" opacity="0.5"/>
        <line x1="30" y1="40" x2="24" y2="24" stroke={c} strokeWidth="1.5" opacity="0.5"/>
        <circle cx="24" cy="16" r="3" fill={c} opacity="0.9"/>
        {/* Signal waves */}
        <path d="M16 12 C16 6, 32 6, 32 12" stroke={c} strokeWidth="1.2" fill="none" opacity="0.4"/>
        <path d="M12 10 C12 2, 36 2, 36 10" stroke={c} strokeWidth="1" fill="none" opacity="0.25"/>
        <path d="M8 8 C8 -2, 40 -2, 40 8" stroke={c} strokeWidth="0.8" fill="none" opacity="0.15"/>
        {/* REC dot */}
        <circle cx="37" cy="8" r="2.5" fill="#EF4444" opacity="0.9"/>
      </svg>
    ),
    "mentor-dashboard": (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
        {/* Analytics dashboard with bars and line */}
        <rect x="6" y="8" width="36" height="32" rx="4" stroke={c} strokeWidth="1.5" fill="none" opacity="0.3"/>
        <line x1="6" y1="16" x2="42" y2="16" stroke={c} strokeWidth="0.8" opacity="0.2"/>
        {/* Traffic light dots */}
        <circle cx="12" cy="12" r="1.5" fill="#EF4444" opacity="0.6"/>
        <circle cx="17" cy="12" r="1.5" fill="#F59E0B" opacity="0.6"/>
        <circle cx="22" cy="12" r="1.5" fill="#10B981" opacity="0.6"/>
        {/* Bars */}
        <rect x="12" y="28" width="4" height="8" rx="1" fill={c} opacity="0.5"/>
        <rect x="19" y="24" width="4" height="12" rx="1" fill={c} opacity="0.65"/>
        <rect x="26" y="20" width="4" height="16" rx="1" fill={c} opacity="0.8"/>
        <rect x="33" y="26" width="4" height="10" rx="1" fill={c} opacity="0.6"/>
        {/* Trend line */}
        <polyline points="14,26 21,22 28,18 35,24" stroke={g} strokeWidth="1.5" fill="none" opacity="0.7"/>
      </svg>
    ),
    "verified": (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
        {/* Shield with checkmark */}
        <path d="M24 4 L40 12 L40 24 C40 34 32 42 24 44 C16 42 8 34 8 24 L8 12 Z" stroke={c} strokeWidth="1.5" fill="none" opacity="0.4"/>
        <path d="M24 8 L36 14 L36 24 C36 32 30 38 24 40 C18 38 12 32 12 24 L12 14 Z" stroke={c} strokeWidth="0.8" fill="none" opacity="0.15"/>
        {/* Checkmark */}
        <polyline points="16,24 22,30 32,18" stroke={c} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.9"/>
        <circle cx="24" cy="24" r="1.5" fill={g} opacity="0.3"/>
      </svg>
    ),
    "direct-mentor": (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
        {/* Compass / guidance */}
        <circle cx="24" cy="24" r="16" stroke={c} strokeWidth="1.2" fill="none" opacity="0.3"/>
        <circle cx="24" cy="24" r="12" stroke={c} strokeWidth="0.8" fill="none" opacity="0.15"/>
        {/* Compass needle */}
        <polygon points="24,10 27,24 24,28 21,24" fill={c} opacity="0.8"/>
        <polygon points="24,38 21,24 24,20 27,24" fill={c} opacity="0.3"/>
        {/* Cardinal marks */}
        <line x1="24" y1="6" x2="24" y2="9" stroke={c} strokeWidth="1.5" opacity="0.5"/>
        <line x1="24" y1="39" x2="24" y2="42" stroke={c} strokeWidth="1.5" opacity="0.5"/>
        <line x1="6" y1="24" x2="9" y2="24" stroke={c} strokeWidth="1.5" opacity="0.5"/>
        <line x1="39" y1="24" x2="42" y2="24" stroke={c} strokeWidth="1.5" opacity="0.5"/>
        <circle cx="24" cy="24" r="2" fill={g} opacity="0.9"/>
      </svg>
    ),
    "beginner-safe": (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
        {/* Seedling / sapling growing */}
        <path d="M24 40 L24 24" stroke={c} strokeWidth="2" opacity="0.7"/>
        {/* Leaves */}
        <path d="M24 24 C20 18, 12 16, 12 22 C12 28, 24 24, 24 24" fill={c} opacity="0.5"/>
        <path d="M24 20 C28 14, 36 12, 36 18 C36 24, 24 20, 24 20" fill={c} opacity="0.35"/>
        <path d="M24 28 C28 22, 34 20, 34 26 C34 30, 24 28, 24 28" fill={c} opacity="0.2"/>
        {/* Roots */}
        <path d="M24 40 C20 42, 16 44, 14 42" stroke={c} strokeWidth="1" opacity="0.3"/>
        <path d="M24 40 C28 42, 32 44, 34 42" stroke={c} strokeWidth="1" opacity="0.3"/>
        {/* Ground */}
        <line x1="10" y1="40" x2="38" y2="40" stroke={c} strokeWidth="0.8" opacity="0.2"/>
      </svg>
    ),
    "accountability": (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
        {/* Precision target / crosshair */}
        <circle cx="24" cy="24" r="16" stroke={c} strokeWidth="1" fill="none" opacity="0.25"/>
        <circle cx="24" cy="24" r="10" stroke={c} strokeWidth="1" fill="none" opacity="0.35"/>
        <circle cx="24" cy="24" r="4" stroke={c} strokeWidth="1.2" fill="none" opacity="0.6"/>
        <circle cx="24" cy="24" r="1.5" fill={c} opacity="0.9"/>
        {/* Crosshair lines */}
        <line x1="24" y1="4" x2="24" y2="18" stroke={c} strokeWidth="0.8" opacity="0.35"/>
        <line x1="24" y1="30" x2="24" y2="44" stroke={c} strokeWidth="0.8" opacity="0.35"/>
        <line x1="4" y1="24" x2="18" y2="24" stroke={c} strokeWidth="0.8" opacity="0.35"/>
        <line x1="30" y1="24" x2="44" y2="24" stroke={c} strokeWidth="0.8" opacity="0.35"/>
      </svg>
    ),
    "peer-energy": (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
        {/* Lightning bolt - energy */}
        <polygon points="28,4 18,22 24,22 20,44 34,20 26,20" fill={c} opacity="0.8"/>
        <polygon points="28,4 18,22 24,22 20,44 34,20 26,20" stroke={g} strokeWidth="0.5" fill="none" opacity="0.3"/>
        {/* Radiating lines */}
        <line x1="10" y1="24" x2="14" y2="24" stroke={c} strokeWidth="0.8" opacity="0.3"/>
        <line x1="34" y1="24" x2="38" y2="24" stroke={c} strokeWidth="0.8" opacity="0.3"/>
        <line x1="12" y1="14" x2="15" y2="17" stroke={c} strokeWidth="0.8" opacity="0.2"/>
        <line x1="33" y1="33" x2="36" y2="36" stroke={c} strokeWidth="0.8" opacity="0.2"/>
      </svg>
    ),
    "small-tribe": (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
        {/* Diamond / gem */}
        <polygon points="24,6 40,20 24,42 8,20" stroke={c} strokeWidth="1.5" fill="none" opacity="0.5"/>
        {/* Facets */}
        <line x1="8" y1="20" x2="40" y2="20" stroke={c} strokeWidth="1" opacity="0.4"/>
        <line x1="24" y1="6" x2="16" y2="20" stroke={c} strokeWidth="0.8" opacity="0.3"/>
        <line x1="24" y1="6" x2="32" y2="20" stroke={c} strokeWidth="0.8" opacity="0.3"/>
        <line x1="16" y1="20" x2="24" y2="42" stroke={c} strokeWidth="0.8" opacity="0.3"/>
        <line x1="32" y1="20" x2="24" y2="42" stroke={c} strokeWidth="0.8" opacity="0.3"/>
        {/* Center glow */}
        <circle cx="24" cy="22" r="3" fill={g} opacity="0.2"/>
      </svg>
    ),
    "scalping": (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
        {/* Stopwatch / speed */}
        <circle cx="24" cy="26" r="14" stroke={c} strokeWidth="1.5" fill="none" opacity="0.4"/>
        <circle cx="24" cy="26" r="10" stroke={c} strokeWidth="0.5" fill="none" opacity="0.15" strokeDasharray="2 3"/>
        {/* Hands */}
        <line x1="24" y1="26" x2="24" y2="16" stroke={c} strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
        <line x1="24" y1="26" x2="32" y2="26" stroke={c} strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
        {/* Top button */}
        <rect x="22" y="8" width="4" height="4" rx="1" stroke={c} strokeWidth="1" fill="none" opacity="0.5"/>
        <line x1="24" y1="8" x2="24" y2="6" stroke={c} strokeWidth="1" opacity="0.4"/>
        {/* Center */}
        <circle cx="24" cy="26" r="2" fill={c} opacity="0.8"/>
        {/* Tick marks */}
        <line x1="24" y1="13" x2="24" y2="15" stroke={c} strokeWidth="0.8" opacity="0.4"/>
        <line x1="37" y1="26" x2="35" y2="26" stroke={c} strokeWidth="0.8" opacity="0.4"/>
        <line x1="24" y1="39" x2="24" y2="37" stroke={c} strokeWidth="0.8" opacity="0.4"/>
        <line x1="11" y1="26" x2="13" y2="26" stroke={c} strokeWidth="0.8" opacity="0.4"/>
      </svg>
    ),
    "day-trading": (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
        {/* Sun with chart */}
        <circle cx="24" cy="18" r="8" stroke={c} strokeWidth="1.5" fill="none" opacity="0.4"/>
        <circle cx="24" cy="18" r="4" fill={c} opacity="0.6"/>
        {/* Sun rays */}
        {[0,45,90,135,180,225,270,315].map(a => (
          <line key={a}
            x1={24 + Math.cos(a * Math.PI/180) * 11}
            y1={18 + Math.sin(a * Math.PI/180) * 11}
            x2={24 + Math.cos(a * Math.PI/180) * 14}
            y2={18 + Math.sin(a * Math.PI/180) * 14}
            stroke={c} strokeWidth="1" opacity="0.35" strokeLinecap="round"
          />
        ))}
        {/* Mini chart below */}
        <polyline points="8,38 16,32 22,36 28,30 34,34 40,28" stroke={c} strokeWidth="1.2" fill="none" opacity="0.5"/>
      </svg>
    ),
    "swing": (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
        {/* Wave / sine curve */}
        <path d="M4 24 C10 10, 18 10, 24 24 C30 38, 38 38, 44 24" stroke={c} strokeWidth="2" fill="none" opacity="0.7"/>
        <path d="M4 24 C10 10, 18 10, 24 24 C30 38, 38 38, 44 24" stroke={g} strokeWidth="4" fill="none" opacity="0.08"/>
        {/* Dots at peaks */}
        <circle cx="17" cy="13" r="2" fill={c} opacity="0.6"/>
        <circle cx="31" cy="35" r="2" fill={c} opacity="0.6"/>
        {/* Arrow at end */}
        <polyline points="40,22 44,24 40,26" stroke={c} strokeWidth="1" fill="none" opacity="0.5"/>
      </svg>
    ),
    "forex": (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
        {/* Currency exchange arrows */}
        <circle cx="24" cy="24" r="16" stroke={c} strokeWidth="1" fill="none" opacity="0.2"/>
        {/* $ symbol */}
        <text x="16" y="22" fontSize="12" fill={c} opacity="0.8" fontWeight="bold" fontFamily="system-ui">{"$"}</text>
        {/* Euro */}
        <text x="28" y="34" fontSize="11" fill={c} opacity="0.6" fontWeight="bold" fontFamily="system-ui">{"\u20AC"}</text>
        {/* Exchange arrows */}
        <path d="M20 28 L28 20" stroke={c} strokeWidth="1.2" opacity="0.5"/>
        <polyline points="25,19 29,19 29,23" stroke={c} strokeWidth="1.2" fill="none" opacity="0.5"/>
        <polyline points="23,29 19,29 19,25" stroke={c} strokeWidth="1.2" fill="none" opacity="0.5"/>
      </svg>
    ),
    "crypto": (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
        {/* Chain links */}
        <rect x="8" y="16" width="14" height="16" rx="8" stroke={c} strokeWidth="1.5" fill="none" opacity="0.5"/>
        <rect x="26" y="16" width="14" height="16" rx="8" stroke={c} strokeWidth="1.5" fill="none" opacity="0.5"/>
        {/* Overlap connection */}
        <line x1="20" y1="20" x2="28" y2="20" stroke={c} strokeWidth="1.2" opacity="0.4"/>
        <line x1="20" y1="28" x2="28" y2="28" stroke={c} strokeWidth="1.2" opacity="0.4"/>
        {/* Digital dots */}
        <circle cx="15" cy="24" r="2" fill={c} opacity="0.6"/>
        <circle cx="33" cy="24" r="2" fill={c} opacity="0.6"/>
        <circle cx="24" cy="24" r="1.5" fill={g} opacity="0.4"/>
      </svg>
    ),
    "stocks": (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
        {/* Candlestick chart */}
        {/* Candle 1 - bearish */}
        <line x1="12" y1="10" x2="12" y2="38" stroke={c} strokeWidth="0.8" opacity="0.4"/>
        <rect x="9" y="16" width="6" height="12" rx="1" fill={c} opacity="0.6"/>
        {/* Candle 2 - bullish */}
        <line x1="22" y1="8" x2="22" y2="36" stroke={c} strokeWidth="0.8" opacity="0.4"/>
        <rect x="19" y="14" width="6" height="14" rx="1" stroke={c} strokeWidth="1" fill="none" opacity="0.5"/>
        {/* Candle 3 - bullish tall */}
        <line x1="32" y1="12" x2="32" y2="40" stroke={c} strokeWidth="0.8" opacity="0.4"/>
        <rect x="29" y="18" width="6" height="16" rx="1" stroke={c} strokeWidth="1" fill="none" opacity="0.7"/>
        {/* Candle 4 - small bearish */}
        <line x1="42" y1="14" x2="42" y2="34" stroke={c} strokeWidth="0.8" opacity="0.4"/>
        <rect x="39" y="20" width="6" height="8" rx="1" fill={c} opacity="0.5"/>
      </svg>
    ),
    "london-session": (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
        {/* Clock tower / Big Ben silhouette */}
        <rect x="18" y="12" width="12" height="28" rx="1" stroke={c} strokeWidth="1.2" fill="none" opacity="0.4"/>
        <rect x="20" y="8" width="8" height="4" rx="1" stroke={c} strokeWidth="1" fill="none" opacity="0.3"/>
        {/* Spire */}
        <line x1="24" y1="2" x2="24" y2="8" stroke={c} strokeWidth="1.2" opacity="0.5"/>
        <polygon points="22,8 24,4 26,8" fill={c} opacity="0.3"/>
        {/* Clock face */}
        <circle cx="24" cy="22" r="5" stroke={c} strokeWidth="1" fill="none" opacity="0.5"/>
        <line x1="24" y1="22" x2="24" y2="18" stroke={c} strokeWidth="1.2" strokeLinecap="round" opacity="0.7"/>
        <line x1="24" y1="22" x2="27" y2="22" stroke={c} strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
        <circle cx="24" cy="22" r="1" fill={c} opacity="0.8"/>
        {/* Base */}
        <rect x="14" y="40" width="20" height="4" rx="1" stroke={c} strokeWidth="1" fill="none" opacity="0.3"/>
      </svg>
    ),
  }

  const extraIcons: Record<string, React.ReactNode> = {
    "trading-psychology": (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="20" r="12" stroke={c} strokeWidth="1.2" fill="none" opacity="0.3"/>
        <path d="M16 20 C16 14, 20 10, 24 10 C28 10, 32 14, 32 20 C32 26, 28 28, 28 32 L20 32 C20 28, 16 26, 16 20" stroke={c} strokeWidth="1.5" fill="none" opacity="0.5"/>
        <line x1="20" y1="36" x2="28" y2="36" stroke={c} strokeWidth="1" opacity="0.4"/>
        <line x1="21" y1="40" x2="27" y2="40" stroke={c} strokeWidth="1" opacity="0.3"/>
        <circle cx="24" cy="18" r="2" fill={g} opacity="0.5"/>
      </svg>
    ),
    "education-library": (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
        <rect x="8" y="10" width="8" height="28" rx="1" stroke={c} strokeWidth="1" fill="none" opacity="0.4"/>
        <rect x="18" y="8" width="8" height="30" rx="1" stroke={c} strokeWidth="1" fill="none" opacity="0.5"/>
        <rect x="28" y="12" width="8" height="26" rx="1" stroke={c} strokeWidth="1" fill="none" opacity="0.35"/>
        <rect x="38" y="14" width="6" height="24" rx="1" stroke={c} strokeWidth="1" fill="none" opacity="0.25"/>
        <line x1="6" y1="40" x2="44" y2="40" stroke={c} strokeWidth="0.8" opacity="0.2"/>
      </svg>
    ),
    "global-sessions": (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="16" stroke={c} strokeWidth="1.2" fill="none" opacity="0.35"/>
        <ellipse cx="24" cy="24" rx="8" ry="16" stroke={c} strokeWidth="0.8" fill="none" opacity="0.25"/>
        <line x1="8" y1="18" x2="40" y2="18" stroke={c} strokeWidth="0.6" opacity="0.2"/>
        <line x1="8" y1="30" x2="40" y2="30" stroke={c} strokeWidth="0.6" opacity="0.2"/>
        <circle cx="34" cy="14" r="2" fill={g} opacity="0.5"/>
      </svg>
    ),
    "research-analysis": (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
        <circle cx="20" cy="20" r="12" stroke={c} strokeWidth="1.5" fill="none" opacity="0.4"/>
        <line x1="30" y1="30" x2="42" y2="42" stroke={c} strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
        <polyline points="14,24 18,18 22,22 26,16" stroke={c} strokeWidth="1" fill="none" opacity="0.5"/>
      </svg>
    ),
    "community-culture": (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
        <circle cx="16" cy="18" r="5" stroke={c} strokeWidth="1" fill="none" opacity="0.4"/>
        <circle cx="32" cy="18" r="5" stroke={c} strokeWidth="1" fill="none" opacity="0.4"/>
        <circle cx="24" cy="30" r="5" stroke={c} strokeWidth="1" fill="none" opacity="0.4"/>
        <line x1="20" y1="20" x2="22" y2="26" stroke={c} strokeWidth="0.8" opacity="0.3"/>
        <line x1="28" y1="20" x2="26" y2="26" stroke={c} strokeWidth="0.8" opacity="0.3"/>
        <line x1="20" y1="16" x2="28" y2="16" stroke={c} strokeWidth="0.8" opacity="0.3"/>
        <circle cx="16" cy="18" r="2" fill={c} opacity="0.6"/>
        <circle cx="32" cy="18" r="2" fill={c} opacity="0.6"/>
        <circle cx="24" cy="30" r="2" fill={c} opacity="0.6"/>
      </svg>
    ),
    "competitions": (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
        <path d="M16 10 L16 22 C16 28, 20 32, 24 32 C28 32, 32 28, 32 22 L32 10" stroke={c} strokeWidth="1.5" fill="none" opacity="0.5"/>
        <line x1="12" y1="10" x2="36" y2="10" stroke={c} strokeWidth="1.2" opacity="0.3"/>
        <line x1="24" y1="32" x2="24" y2="38" stroke={c} strokeWidth="1.5" opacity="0.5"/>
        <rect x="18" y="38" width="12" height="4" rx="1" stroke={c} strokeWidth="1" fill="none" opacity="0.4"/>
        <path d="M12 14 C8 14, 8 20, 12 20" stroke={c} strokeWidth="1" fill="none" opacity="0.3"/>
        <path d="M36 14 C40 14, 40 20, 36 20" stroke={c} strokeWidth="1" fill="none" opacity="0.3"/>
      </svg>
    ),
    "funded-programs": (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="14" stroke={c} strokeWidth="1.2" fill="none" opacity="0.3"/>
        <text x="18" y="30" fontSize="16" fill={c} opacity="0.8" fontWeight="bold" fontFamily="system-ui">{"$"}</text>
        <polyline points="14,18 20,14 26,18 32,12 38,16" stroke={c} strokeWidth="1" fill="none" opacity="0.4"/>
        <polyline points="35,11 38,12 37,16" stroke={c} strokeWidth="1" fill="none" opacity="0.4"/>
      </svg>
    ),
  }

  return <>{icons[id] || extraIcons[id] || (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="14" stroke={c} strokeWidth="1" fill="none" opacity="0.3"/>
      <circle cx="24" cy="24" r="6" stroke={c} strokeWidth="1" fill="none" opacity="0.2"/>
      <circle cx="24" cy="24" r="2" fill={c} opacity="0.5"/>
    </svg>
  )}</>
}

/* ── COLOR SYSTEM ── */
const C = {
  bg: "#070B16",
  text: "#E8EAF0",
  textMuted: "#8B93A8",
  textDim: "#3D4560",
  ring0: "99,165,255",
  ring1: "74,222,178",
  ring2: "196,167,255",
  ring3: "255,191,105",
  active: "99,165,255",
  white: "255,255,255",
}

const NODE_ACCENT: Record<string, string> = {
  "ai-models": "255,191,105",
  "live-calls": "239,100,100",
  "mentor-dashboard": "99,165,255",
  "verified": "74,222,178",
  "direct-mentor": "255,191,105",
  "beginner-safe": "74,222,178",
  "accountability": "239,100,100",
  "peer-energy": "255,160,80",
  "small-tribe": "255,191,105",
  "scalping": "239,100,100",
  "day-trading": "99,165,255",
  "swing": "255,191,105",
  "forex": "74,222,178",
  "crypto": "196,167,255",
  "stocks": "99,165,255",
  "london-session": "74,222,178",
}

const RING_RGB = [C.ring0, C.ring1, C.ring2, C.ring3]
const getAccent = (d: DiscoveryDimension) => NODE_ACCENT[d.id] || RING_RGB[d.ring]

/* ── ORBIT CONFIG ── */
const RING_RADII = [210, 340, 470]
const ORBIT_SPEED = [0.00007, 0.00005, 0.000035]
const RING_ANGLE_OFFSET = [0, 22, 10]

/* ── EXTRA DISCOVERY DIMENSIONS (ring 3) ── */
const EXTRA_RADIUS = 600
const EXTRA_SPEED = 0.000025
const EXTRA_DIMS = [
  { id: "trading-psychology", label: "Trading Psychology", short: "Psychology", meaning: "Communities focused on mindset, emotional regulation, and performance psychology for consistent trading." },
  { id: "education-library",  label: "Education Libraries", short: "Education", meaning: "Structured courses, video libraries, and mentorship curricula for accelerated learning." },
  { id: "global-sessions",    label: "Global Sessions", short: "Global", meaning: "24/7 coverage across London, New York, Tokyo, and Sydney sessions." },
  { id: "research-analysis",  label: "Research & Analysis", short: "Research", meaning: "Deep fundamental analysis, macro research, and institutional-grade insights." },
  { id: "community-culture",  label: "Community Culture", short: "Culture", meaning: "High-engagement rooms with active discussion, debates, and collaborative trading." },
  { id: "competitions",       label: "Competitions", short: "Compete", meaning: "Trading challenges, leaderboards, and competitive learning environments." },
  { id: "funded-programs",    label: "Funded Programs", short: "Funded", meaning: "Communities partnered with prop firms offering funded account pathways." },
]

/* ── Center messages ── */
const CTR_MSGS: Record<string, string> = {
  default: "Hover a node to explore. Click to filter.",
  "ai-models": "AI extends mentor knowledge into always-on intelligence.",
  "live-calls": "Real-time sessions with live mentor execution and analysis.",
  "mentor-dashboard": "Professional analytics and progress tracking tools.",
  "verified": "Mentors vetted through Archio's verification process.",
  "direct-mentor": "Premium access with tight feedback loops.",
  "beginner-safe": "Structured paths for traders in their first year.",
  "accountability": "Discipline systems, journaling, and daily check-ins.",
  "peer-energy": "High-activity communities with collaborative energy.",
  "small-tribe": "Intentionally small groups where every member matters.",
  "scalping": "High-speed execution rooms for rapid-fire traders.",
  "day-trading": "Intraday workflows with session-based structure.",
  "swing": "Patient analysis for multi-day to multi-week positions.",
  "forex": "Currency pair specialization and session trading.",
  "crypto": "24/7 digital asset rooms with on-chain analysis.",
  "stocks": "Equities, options flow, and earnings analysis.",
  "london-session": "The highest-volume institutional session window.",
}

interface Props {
  activeDimensions: Set<string>
  onToggleDimension: (id: string) => void
  searchQuery: string
  onSearchChange: (q: string) => void
  resultCount: number
}

interface NodePos { x: number; y: number; angle: number }

export default function DiscoveryEngine({ activeDimensions, onToggleDimension, searchQuery, onSearchChange, resultCount }: Props) {
  const [hoveredDim, setHoveredDim] = useState<DiscoveryDimension | null>(null)
  const [hoveredExtra, setHoveredExtra] = useState<typeof EXTRA_DIMS[0] | null>(null)
  const [frozenPositions, setFrozenPositions] = useState<Record<string, NodePos>>({})
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [nodePositions, setNodePositions] = useState<Record<string, NodePos>>({})
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 })
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [showExtraRing, setShowExtraRing] = useState(true)

  const rings = useMemo(() => [
    ALL_DIMENSIONS.filter(d => d.ring === 0),
    ALL_DIMENSIONS.filter(d => d.ring === 1),
    ALL_DIMENSIONS.filter(d => d.ring === 2),
  ], [])

  const handleNodeEnter = useCallback((dim: DiscoveryDimension) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    setHoveredDim(dim)
    setHoveredExtra(null)
  }, [])

  const handleExtraEnter = useCallback((dim: typeof EXTRA_DIMS[0]) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    setHoveredExtra(dim)
    setHoveredDim(null)
  }, [])

  const handleLeave = useCallback(() => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredDim(null)
      setHoveredExtra(null)
    }, 150)
  }, [])

  /* ── CANVAS: mesh + rings + center emblem ── */
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    let animId: number

    interface Dot { x: number; y: number; vx: number; vy: number; r: number; o: number }
    let dots: Dot[] = []
    let w = 0, h = 0

    function resize() {
      const dpr = Math.min(window.devicePixelRatio, 2)
      const rect = container!.getBoundingClientRect()
      w = rect.width; h = rect.height
      canvas!.width = w * dpr; canvas!.height = h * dpr
      canvas!.style.width = w + "px"; canvas!.style.height = h + "px"
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      setContainerSize({ w, h })
      initDots()
    }

    function initDots() {
      dots = []
      const count = Math.floor((w * h) / 7000)
      for (let i = 0; i < Math.min(count, 100); i++) {
        dots.push({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.04, vy: (Math.random() - 0.5) * 0.04,
          r: 0.3 + Math.random() * 0.7, o: 0.02 + Math.random() * 0.08,
        })
      }
    }

    function draw(t: number) {
      ctx!.clearRect(0, 0, w, h)
      const cx = w / 2, cy = h / 2

      // Drift dots
      for (const d of dots) {
        d.x += d.vx; d.y += d.vy
        if (d.x < 0 || d.x > w) d.vx *= -1
        if (d.y < 0 || d.y > h) d.vy *= -1
      }

      // Mesh connections
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x
          const dy = dots[i].y - dots[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 80) {
            ctx!.beginPath()
            ctx!.moveTo(dots[i].x, dots[i].y)
            ctx!.lineTo(dots[j].x, dots[j].y)
            ctx!.strokeStyle = `rgba(${C.white},${(1 - dist / 80) * 0.04})`
            ctx!.lineWidth = 0.3
            ctx!.stroke()
          }
        }
      }

      // Mesh dots
      for (const d of dots) {
        ctx!.beginPath()
        ctx!.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(${C.white},${d.o})`
        ctx!.fill()
      }

      // Draw ring arcs
      const allRadii = showExtraRing ? [...RING_RADII, EXTRA_RADIUS] : RING_RADII
      const allRGB = showExtraRing ? [...RING_RGB.slice(0, 3), C.ring3] : RING_RGB.slice(0, 3)

      allRadii.forEach((r, ri) => {
        const breathe = 0.5 + 0.5 * Math.sin(t * 0.0003 + ri * 1.8)

        // Wide soft glow
        ctx!.beginPath()
        ctx!.arc(cx, cy, r, 0, Math.PI * 2)
        ctx!.strokeStyle = `rgba(${allRGB[ri]},${0.03 + breathe * 0.015})`
        ctx!.lineWidth = 18
        ctx!.stroke()

        // Crisp line
        ctx!.beginPath()
        ctx!.arc(cx, cy, r, 0, Math.PI * 2)
        ctx!.strokeStyle = `rgba(${allRGB[ri]},${0.10 + breathe * 0.05})`
        ctx!.lineWidth = 1
        ctx!.stroke()

        // Dotted inner
        ctx!.beginPath()
        ctx!.setLineDash([2, 8])
        ctx!.arc(cx, cy, r - 4, 0, Math.PI * 2)
        ctx!.strokeStyle = `rgba(${allRGB[ri]},${0.05 + breathe * 0.02})`
        ctx!.lineWidth = 0.5
        ctx!.stroke()
        ctx!.setLineDash([])

        // Traveling particles
        for (let p = 0; p < 2; p++) {
          const speed = ri === 3 ? EXTRA_SPEED * 4 : (ORBIT_SPEED[ri] || 0.00003) * 4
          const pAngle = t * speed + p * Math.PI
          const px = cx + Math.cos(pAngle) * r
          const py = cy + Math.sin(pAngle) * r
          const pg = ctx!.createRadialGradient(px, py, 0, px, py, 5)
          pg.addColorStop(0, `rgba(${allRGB[ri]},${0.3 + breathe * 0.3})`)
          pg.addColorStop(1, "transparent")
          ctx!.fillStyle = pg
          ctx!.fillRect(px - 5, py - 5, 10, 10)
        }
      })

      // Center emblem
      const bv = 0.5 + 0.5 * Math.sin(t * 0.0003)
      ctx!.save()
      ctx!.translate(cx, cy)
      ctx!.rotate(t * 0.00008)

      ctx!.beginPath()
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i - Math.PI / 2
        const hx = Math.cos(a) * 42, hy = Math.sin(a) * 42
        i === 0 ? ctx!.moveTo(hx, hy) : ctx!.lineTo(hx, hy)
      }
      ctx!.closePath()
      ctx!.strokeStyle = `rgba(${C.ring0},${0.10 + bv * 0.06})`
      ctx!.lineWidth = 1.5
      ctx!.stroke()

      ctx!.beginPath()
      for (let i = 0; i < 3; i++) {
        const a = (Math.PI * 2 / 3) * i - Math.PI / 2
        const tx = Math.cos(a) * 22, ty = Math.sin(a) * 22
        i === 0 ? ctx!.moveTo(tx, ty) : ctx!.lineTo(tx, ty)
      }
      ctx!.closePath()
      ctx!.strokeStyle = `rgba(${C.ring1},${0.08 + bv * 0.04})`
      ctx!.lineWidth = 1
      ctx!.stroke()

      const coreGlow = ctx!.createRadialGradient(0, 0, 0, 0, 0, 12)
      coreGlow.addColorStop(0, `rgba(${C.ring0},${0.5 + bv * 0.3})`)
      coreGlow.addColorStop(0.5, `rgba(${C.ring1},${0.1 + bv * 0.1})`)
      coreGlow.addColorStop(1, "transparent")
      ctx!.fillStyle = coreGlow
      ctx!.fillRect(-12, -12, 24, 24)

      ctx!.restore()

      // Center atmospheric glow
      const atmo = ctx!.createRadialGradient(cx, cy, 0, cx, cy, 100)
      atmo.addColorStop(0, "rgba(99,165,255,0.05)")
      atmo.addColorStop(0.5, "rgba(74,222,178,0.015)")
      atmo.addColorStop(1, "transparent")
      ctx!.fillStyle = atmo
      ctx!.fillRect(0, 0, w, h)

      // Calculate node positions
      const positions: Record<string, NodePos> = {}
      rings.forEach((ringDims, ri) => {
        const radius = RING_RADII[ri]
        ringDims.forEach((dim, di) => {
          const baseAngle = (di / ringDims.length) * Math.PI * 2 + (RING_ANGLE_OFFSET[ri] * Math.PI / 180)
          const isHov = hoveredDim?.id === dim.id
          if (isHov && frozenPositions[dim.id]) {
            positions[dim.id] = frozenPositions[dim.id]
          } else {
            const speed = isHov ? 0 : ORBIT_SPEED[ri]
            const angle = baseAngle + t * speed
            positions[dim.id] = { x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius, angle }
          }
        })
      })

      if (showExtraRing) {
        EXTRA_DIMS.forEach((dim, di) => {
          const baseAngle = (di / EXTRA_DIMS.length) * Math.PI * 2
          const isHov = hoveredExtra?.id === dim.id
          if (isHov && frozenPositions[dim.id]) {
            positions[dim.id] = frozenPositions[dim.id]
          } else {
            const speed = isHov ? 0 : EXTRA_SPEED
            const angle = baseAngle + t * speed
            positions[dim.id] = { x: cx + Math.cos(angle) * EXTRA_RADIUS, y: cy + Math.sin(angle) * EXTRA_RADIUS, angle }
          }
        })
      }

      setNodePositions(positions)
      animId = requestAnimationFrame(draw)
    }

    resize()
    animId = requestAnimationFrame(draw)
    window.addEventListener("resize", resize)
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoveredDim?.id, hoveredExtra?.id, showExtraRing])

  useEffect(() => {
    const id = hoveredDim?.id || hoveredExtra?.id
    if (id && nodePositions[id]) {
      setFrozenPositions(prev => ({ ...prev, [id]: nodePositions[id] }))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoveredDim?.id, hoveredExtra?.id])

  const activeNodes = useMemo(() =>
    ALL_DIMENSIONS.filter(d => activeDimensions.has(d.id)), [activeDimensions])

  const anyHovered = hoveredDim || hoveredExtra

  return (
    <section className="relative w-full overflow-hidden" style={{
      minHeight: "min(100vh, 960px)",
      background: `radial-gradient(ellipse 70% 55% at 50% 45%, #0D1225 0%, ${C.bg} 100%)`,
    }}>
      {/* Atmospheric blooms */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute" style={{ width: 900, height: 900, top: -350, right: -250, background: "radial-gradient(circle, rgba(99,165,255,0.035) 0%, transparent 60%)", borderRadius: "50%" }} />
        <div className="absolute" style={{ width: 700, height: 700, bottom: -250, left: "5%", background: "radial-gradient(circle, rgba(74,222,178,0.025) 0%, transparent 55%)", borderRadius: "50%" }} />
        <div className="absolute" style={{ width: 500, height: 500, top: "25%", left: -100, background: "radial-gradient(circle, rgba(196,167,255,0.02) 0%, transparent 55%)", borderRadius: "50%" }} />
      </div>

      {/* ── FULL-WIDTH CENTERED ORBIT ── */}
      <div ref={containerRef}
        className="relative w-full flex items-center justify-center z-10"
        style={{ minHeight: "min(100vh, 960px)" }}
      >
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }} />

        {/* ── CENTER HUB ── */}
        <div className="absolute z-30 flex flex-col items-center text-center pointer-events-none" style={{ maxWidth: 300 }}>

          {/* Hero headline */}
          <h1 className="text-[32px] md:text-[40px] font-bold leading-[1.05] mb-3 text-balance"
            style={{ color: C.text, letterSpacing: "-0.03em" }}>
            Find Your{" "}
            <span className="bg-clip-text text-transparent" style={{
              backgroundImage: "linear-gradient(135deg, #63A5FF 0%, #4ADEB2 50%, #C4A7FF 100%)",
            }}>Perfect</span>{" "}
            Ecosystem
          </h1>

          {/* Dynamic subtitle */}
          <AnimatePresence mode="wait">
            <motion.p key={anyHovered ? (hoveredDim?.id || hoveredExtra?.id) : "default"}
              initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.15 }}
              className="text-[12px] leading-[1.7] mb-5"
              style={{ color: C.textMuted }}>
              {hoveredDim ? (CTR_MSGS[hoveredDim.id] || CTR_MSGS.default)
                : hoveredExtra ? hoveredExtra.meaning
                : CTR_MSGS.default}
            </motion.p>
          </AnimatePresence>

          {/* Search bar */}
          <div className="relative w-full max-w-[280px] pointer-events-auto">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.textDim} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <input value={searchQuery} onChange={e => onSearchChange(e.target.value)}
              placeholder="Describe your ideal community..."
              className="w-full text-[12px] py-3 pl-10 pr-4 rounded-xl outline-none transition-all duration-300 placeholder:text-[#2D3550]"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
                color: C.text,
                boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
                backdropFilter: "blur(12px)",
              }}
            />
          </div>

          {/* Active filter count */}
          {(activeDimensions.size > 0 || searchQuery) && (
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
              className="mt-3 pointer-events-auto">
              <span className="text-[12px] font-bold" style={{ color: `rgb(${C.ring0})` }}>
                {resultCount} communit{resultCount !== 1 ? "ies" : "y"} matched
              </span>
            </motion.div>
          )}

          {/* Active filters as small tags */}
          {activeDimensions.size > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-wrap justify-center gap-1.5 mt-3 pointer-events-auto max-w-[300px]">
              {ALL_DIMENSIONS.filter(d => activeDimensions.has(d.id)).map(dim => {
                const a = getAccent(dim)
                return (
                  <motion.button key={dim.id} layout onClick={() => onToggleDimension(dim.id)}
                    className="px-2 py-1 rounded-md flex items-center gap-1.5 group"
                    style={{ background: `rgba(${a},0.1)`, border: `1px solid rgba(${a},0.18)` }}
                    whileHover={{ scale: 1.05 }}>
                    <DimIcon id={dim.id} size={18} color={`rgb(${a})`} />
                    <span className="text-[9px] font-semibold" style={{ color: `rgb(${a})` }}>{dim.short}</span>
                    <span className="text-[8px] opacity-40 group-hover:opacity-100 ml-0.5" style={{ color: `rgb(${a})` }}>{"x"}</span>
                  </motion.button>
                )
              })}
              <button onClick={() => ALL_DIMENSIONS.forEach(d => { if (activeDimensions.has(d.id)) onToggleDimension(d.id) })}
                className="px-2 py-1 rounded-md text-[9px] font-medium"
                style={{ color: C.textDim, background: "rgba(255,255,255,0.03)" }}>
                Clear
              </button>
            </motion.div>
          )}
        </div>

        {/* ── CONSTELLATION CONNECTIONS ── */}
        {activeNodes.length >= 2 && containerSize.w > 0 && (
          <svg className="absolute inset-0 pointer-events-none" style={{ width: containerSize.w, height: containerSize.h, zIndex: 4 }}>
            {activeNodes.map((a, ai) =>
              activeNodes.slice(ai + 1).map(b => {
                const pa = nodePositions[a.id]
                const pb = nodePositions[b.id]
                if (!pa || !pb) return null
                return (
                  <line key={`${a.id}-${b.id}`}
                    x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y}
                    stroke={`rgba(${C.active},0.18)`}
                    strokeWidth="1" strokeDasharray="4 8"
                  />
                )
              })
            )}
            {activeNodes.map(d => {
              const p = nodePositions[d.id]
              if (!p) return null
              return (
                <circle key={`pulse-${d.id}`} cx={p.x} cy={p.y} r="4" fill="none"
                  stroke={`rgba(${C.active},0.3)`} strokeWidth="1">
                  <animate attributeName="r" from="4" to="18" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.4" to="0" dur="2s" repeatCount="indefinite" />
                </circle>
              )
            })}
          </svg>
        )}

        {/* Hover connector to center */}
        {hoveredDim && nodePositions[hoveredDim.id] && containerSize.w > 0 && (
          <svg className="absolute inset-0 pointer-events-none" style={{ width: containerSize.w, height: containerSize.h, zIndex: 5 }}>
            <motion.line
              x1={nodePositions[hoveredDim.id].x} y1={nodePositions[hoveredDim.id].y}
              x2={containerSize.w / 2} y2={containerSize.h / 2}
              stroke={`rgba(${getAccent(hoveredDim)},0.2)`}
              strokeWidth="1" strokeDasharray="3 6"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            />
          </svg>
        )}

        {/* ── MAIN SVG ORBIT NODES ── */}
        {ALL_DIMENSIONS.map(dim => {
          const pos = nodePositions[dim.id]
          if (!pos) return null
          const accent = getAccent(dim)
          const isActive = activeDimensions.has(dim.id)
          const isHovered = hoveredDim?.id === dim.id
          const dimmed = anyHovered && !isHovered && !isActive

          return (
            <motion.button key={dim.id}
              className="absolute z-10 flex flex-col items-center gap-1"
              style={{ left: pos.x, top: pos.y, transform: "translate(-50%, -50%)", cursor: "pointer" }}
              animate={{
                opacity: dimmed ? 0.15 : 1,
                scale: isHovered ? 1.4 : isActive ? 1.15 : 1,
              }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onMouseEnter={() => handleNodeEnter(dim)}
              onMouseLeave={handleLeave}
              onClick={() => onToggleDimension(dim.id)}
            >
              {isActive && (
                <motion.div className="absolute rounded-full"
                  style={{ inset: -10, background: `radial-gradient(circle, rgba(${accent},0.2) 0%, transparent 70%)` }}
                  animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
              <DimIcon
                id={dim.id}
                size={isHovered ? 64 : isActive ? 56 : 48}
                color={isActive ? `rgb(${accent})` : isHovered ? C.text : `rgba(${C.white},0.55)`}
                glow={`rgb(${accent})`}
              />
              <span
                className="font-semibold whitespace-nowrap"
                style={{
                  fontSize: 11,
                  color: isActive ? `rgb(${accent})` : isHovered ? C.text : `rgba(${C.white},0.45)`,
                  textShadow: isActive || isHovered ? `0 0 12px rgba(${accent},0.3)` : "none",
                  letterSpacing: "0.04em",
                  transition: "color 0.2s, text-shadow 0.2s",
                }}>
                {dim.short}
              </span>
            </motion.button>
          )
        })}

        {/* ── EXTRA RING NODES ── */}
        {showExtraRing && EXTRA_DIMS.map(dim => {
          const pos = nodePositions[dim.id]
          if (!pos) return null
          const isHov = hoveredExtra?.id === dim.id
          const dimmed = anyHovered && !isHov

          return (
            <motion.button key={dim.id}
              className="absolute z-10 flex flex-col items-center gap-1"
              style={{ left: pos.x, top: pos.y, transform: "translate(-50%, -50%)", cursor: "pointer" }}
              animate={{
                opacity: dimmed ? 0.1 : 1,
                scale: isHov ? 1.3 : 1,
              }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onMouseEnter={() => handleExtraEnter(dim)}
              onMouseLeave={handleLeave}
            >
              <DimIcon
                id={dim.id}
                size={isHov ? 52 : 40}
                color={isHov ? C.text : `rgba(${C.ring3},0.5)`}
                glow={`rgb(${C.ring3})`}
              />
              <span
                className="font-semibold whitespace-nowrap"
                style={{
                  fontSize: 10,
                  color: isHov ? C.text : `rgba(${C.ring3},0.45)`,
                  letterSpacing: "0.04em",
                  transition: "color 0.2s",
                }}>
                {dim.short}
              </span>
            </motion.button>
          )
        })}

        {/* ── Ring arc labels ── */}
        {RING_RADII.map((r, i) => {
          const topPx = containerSize.h ? containerSize.h / 2 - r - 14 : 0
          return containerSize.h > 0 && (
            <div key={i} className="absolute z-20 left-1/2 -translate-x-1/2 flex items-center gap-2" style={{ top: topPx }}>
              <div className="h-px w-5" style={{ background: `rgba(${RING_RGB[i]},0.10)` }} />
              <span className="text-[7px] uppercase font-bold whitespace-nowrap select-none px-2 py-0.5 rounded-full"
                style={{
                  letterSpacing: "0.18em",
                  color: `rgba(${RING_RGB[i]},0.35)`,
                  background: `rgba(${RING_RGB[i]},0.03)`,
                  border: `1px solid rgba(${RING_RGB[i]},0.05)`,
                }}>
                {RING_LABELS[i as 0|1|2]}
              </span>
              <div className="h-px w-5" style={{ background: `rgba(${RING_RGB[i]},0.10)` }} />
            </div>
          )
        })}

        {/* Extra ring label */}
        {showExtraRing && containerSize.h > 0 && (
          <div className="absolute z-20 left-1/2 -translate-x-1/2 flex items-center gap-2"
            style={{ top: containerSize.h / 2 - EXTRA_RADIUS - 14 }}>
            <div className="h-px w-5" style={{ background: `rgba(${C.ring3},0.10)` }} />
            <button onClick={() => setShowExtraRing(prev => !prev)}
              className="text-[7px] uppercase font-bold whitespace-nowrap select-none px-2 py-0.5 rounded-full cursor-pointer transition-all hover:scale-105"
              style={{
                letterSpacing: "0.18em",
                color: `rgba(${C.ring3},0.35)`,
                background: `rgba(${C.ring3},0.03)`,
                border: `1px solid rgba(${C.ring3},0.05)`,
              }}>
              Explore More
            </button>
            <div className="h-px w-5" style={{ background: `rgba(${C.ring3},0.10)` }} />
          </div>
        )}

        {/* ── POPOVER ── */}
        <AnimatePresence>
          {hoveredDim && nodePositions[hoveredDim.id] && containerSize.w > 0 && (
            <NodePopover
              dim={hoveredDim}
              pos={nodePositions[hoveredDim.id]}
              container={containerSize}
              onEnter={() => handleNodeEnter(hoveredDim)}
              onLeave={handleLeave}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {hoveredExtra && nodePositions[hoveredExtra.id] && containerSize.w > 0 && (
            <ExtraPopover
              dim={hoveredExtra}
              pos={nodePositions[hoveredExtra.id]}
              container={containerSize}
              onEnter={() => handleExtraEnter(hoveredExtra)}
              onLeave={handleLeave}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}


/* ═══ MAIN NODE POPOVER ═══ */
function NodePopover({ dim, pos, container, onEnter, onLeave }: {
  dim: DiscoveryDimension; pos: NodePos; container: { w: number; h: number }; onEnter: () => void; onLeave: () => void
}) {
  const accent = getAccent(dim)
  const popW = 310, popH = 280
  const cx = container.w / 2, cy = container.h / 2

  // ALWAYS place popover to LEFT or RIGHT side of the icon (never above/below)
  // This ensures the icon remains visible and clickable
  const dx = pos.x - cx
  const SIDE_OFFSET = 50 // Gap between icon and popover

  let left: number, top: number, connX: number, connY: number

  // If icon is on right half of screen, place popover to the RIGHT
  // If icon is on left half of screen, place popover to the LEFT
  if (dx >= 0) {
    // Icon is on right side -> popover goes further RIGHT
    left = pos.x + SIDE_OFFSET
    top = pos.y - popH / 2
    connX = left
    connY = pos.y
  } else {
    // Icon is on left side -> popover goes further LEFT
    left = pos.x - popW - SIDE_OFFSET
    top = pos.y - popH / 2
    connX = left + popW
    connY = pos.y
  }

  // Clamp inside viewport
  left = Math.max(12, Math.min(left, container.w - popW - 12))
  top = Math.max(12, Math.min(top, container.h - popH - 12))

  return (
    <>
      <svg className="absolute inset-0 pointer-events-none z-30" style={{ width: container.w, height: container.h }}>
        <motion.line
          x1={pos.x} y1={pos.y} x2={connX} y2={connY}
          stroke={`rgba(${accent},0.25)`} strokeWidth="1" strokeDasharray="3 5"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        />
      </svg>
      <motion.div
        initial={{ opacity: 0, scale: 0.92, x: dx >= 0 ? 10 : -10 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        exit={{ opacity: 0, scale: 0.94 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="absolute z-40" style={{ left, top, width: popW }}
        onMouseEnter={onEnter} onMouseLeave={onLeave}
      >
        <div className="relative overflow-hidden rounded-2xl"
          style={{
            background: "rgba(8,12,26,0.96)",
            border: "1px solid rgba(255,255,255,0.06)",
            boxShadow: `0 20px 64px rgba(0,0,0,0.6), 0 0 40px rgba(${accent},0.06), inset 0 1px 0 rgba(255,255,255,0.04)`,
            backdropFilter: "blur(32px)",
          }}>
          {/* Top accent bar */}
          <div style={{ height: 2, background: `linear-gradient(90deg, transparent 5%, rgb(${accent}) 50%, transparent 95%)`, opacity: 0.6 }} />

          <div className="p-5">
            {/* Header with large icon */}
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 p-2 rounded-xl" style={{
                background: `rgba(${accent},0.08)`,
                border: `1px solid rgba(${accent},0.1)`,
              }}>
                <DimIcon id={dim.id} size={48} color={`rgb(${accent})`} glow={`rgb(${accent})`} />
              </div>
              <div className="pt-1">
                <span className="text-[8px] uppercase tracking-[0.22em] font-bold block mb-1" style={{ color: `rgba(${accent},0.6)` }}>
                  {RING_LABELS[dim.ring as 0|1|2]}
                </span>
                <span className="text-[16px] font-bold block leading-tight" style={{ color: "#E8EAF0" }}>{dim.label}</span>
              </div>
            </div>

            <p className="text-[11px] leading-[1.85] mb-4" style={{ color: "#8B93A8" }}>{dim.meaning}</p>

            <div className="mb-4 pl-3" style={{ borderLeft: `2px solid rgba(${accent},0.2)` }}>
              <span className="text-[9px] uppercase tracking-[0.15em] font-bold block mb-1" style={{ color: `rgba(${accent},0.5)` }}>Why it matters</span>
              <p className="text-[10px] leading-[1.7]" style={{ color: "#525B73" }}>
                {dim.whyItMatters.length > 140 ? dim.whyItMatters.slice(0, 140) + "..." : dim.whyItMatters}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
              <span className="text-[9px] font-medium" style={{ color: "#3D4560" }}>Click node to filter</span>
              <div className="px-3 py-1.5 rounded-lg" style={{ background: `rgba(${accent},0.1)`, border: `1px solid rgba(${accent},0.12)` }}>
                <span className="text-[10px] font-bold" style={{ color: `rgb(${accent})` }}>Explore</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}


/* ═══ EXTRA RING POPOVER ═══ */
function ExtraPopover({ dim, pos, container, onEnter, onLeave }: {
  dim: typeof EXTRA_DIMS[0]; pos: NodePos; container: { w: number; h: number }; onEnter: () => void; onLeave: () => void
}) {
  const popW = 280, popH = 160
  const cx = container.w / 2
  const dx = pos.x - cx
  const SIDE_OFFSET = 45

  // ALWAYS place to LEFT or RIGHT side (never above/below)
  let left: number, top: number, connX: number, connY: number
  if (dx >= 0) {
    // Icon on right -> popover goes RIGHT
    left = pos.x + SIDE_OFFSET; top = pos.y - popH / 2; connX = left; connY = pos.y
  } else {
    // Icon on left -> popover goes LEFT
    left = pos.x - popW - SIDE_OFFSET; top = pos.y - popH / 2; connX = left + popW; connY = pos.y
  }
  left = Math.max(12, Math.min(left, container.w - popW - 12))
  top = Math.max(12, Math.min(top, container.h - 200))

  return (
    <>
      <svg className="absolute inset-0 pointer-events-none z-30" style={{ width: container.w, height: container.h }}>
        <motion.line
          x1={pos.x} y1={pos.y} x2={connX} y2={connY}
          stroke={`rgba(${C.ring3},0.2)`} strokeWidth="1" strokeDasharray="3 5"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        />
      </svg>
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="absolute z-40" style={{ left, top, width: popW }}
        onMouseEnter={onEnter} onMouseLeave={onLeave}
      >
        <div className="relative overflow-hidden rounded-2xl"
          style={{
            background: "rgba(8,12,26,0.96)",
            border: "1px solid rgba(255,255,255,0.06)",
            boxShadow: `0 20px 64px rgba(0,0,0,0.6), 0 0 30px rgba(${C.ring3},0.04), inset 0 1px 0 rgba(255,255,255,0.04)`,
            backdropFilter: "blur(32px)",
          }}>
          <div style={{ height: 2, background: `linear-gradient(90deg, transparent 5%, rgb(${C.ring3}) 50%, transparent 95%)`, opacity: 0.4 }} />
          <div className="p-5">
            <div className="flex items-start gap-3 mb-3">
              <div className="flex-shrink-0 p-1.5 rounded-xl" style={{
                background: `rgba(${C.ring3},0.08)`,
                border: `1px solid rgba(${C.ring3},0.1)`,
              }}>
                <DimIcon id={dim.id} size={40} color={`rgb(${C.ring3})`} glow={`rgb(${C.ring3})`} />
              </div>
              <div className="pt-1">
                <span className="text-[8px] uppercase tracking-[0.2em] font-bold block mb-1" style={{ color: `rgba(${C.ring3},0.5)` }}>Discovery</span>
                <span className="text-[14px] font-bold block leading-tight" style={{ color: "#E8EAF0" }}>{dim.label}</span>
              </div>
            </div>
            <p className="text-[11px] leading-[1.8]" style={{ color: "#8B93A8" }}>{dim.meaning}</p>
            <div className="mt-3 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
              <span className="text-[9px] font-medium" style={{ color: "#3D4560" }}>Coming soon</span>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}
